from flask import Flask, request, jsonify
from flask_cors import CORS # Bunu ekledik
from models import db, User, Vault
from utils import encrypt_password, decrypt_password

app = Flask(__name__)
CORS(app) # Bunu ekledik: Artık React uygulamamız API ile haberleşebilecek!
#???
# Format: postgresql://kullanici_adi:sifre@endpoint_adresi:5432/postgres
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Minseok99@proje1database.cmdekkcucoay.us-east-1.rds.amazonaws.com:5432/postgres'

# Az önce kopyaladığın anahtarı buraya yapıştır (Örn: b'abc123...')
ENCRYPTION_KEY = b'EDBoFP8acLl0GHSr7excTdMzDOEIrSCneOI91FWExJ4='

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/')
def hello():
    return jsonify({"mesaj": "Vault API Çalışıyor!"})

# 1. Sisteme Yeni Kullanıcı Ekleme
# 1. Sisteme Yeni Kullanıcı Ekleme veya Giriş Yapma
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']
    
    # Veritabanında bu kullanıcı adıyla biri var mı diye bakıyoruz
    mevcut_kullanici = User.query.filter_by(username=username).first()
    
    if mevcut_kullanici:
        # Kullanıcı zaten varsa: Şifresi doğru mu diye kontrol et (Login İşlemi)
        if mevcut_kullanici.master_password_hash == password:
            return jsonify({"mesaj": "Giriş başarılı!", "user_id": mevcut_kullanici.id}), 200
        else:
            # Şifre yanlışsa hata döndür
            return jsonify({"hata": "Bu kullanıcı adı alınmış veya şifreniz hatalı!"}), 401
    else:
        # Kullanıcı yoksa: Yeni kayıt oluştur (Register İşlemi)
        yeni_kullanici = User(
            username=username,
            master_password_hash=password 
        )
        db.session.add(yeni_kullanici)
        db.session.commit()
        return jsonify({"mesaj": "Kayıt başarılı, giriş yapıldı!", "user_id": yeni_kullanici.id}), 201

# 2. Kasaya Şifreli Parola Ekleme
@app.route('/add_password', methods=['POST'])
def add_password():
    data = request.get_json()
    
    # Gelen düz metin şifreyi AES ile şifreliyoruz
    encrypted_pw = encrypt_password(data['password'], ENCRYPTION_KEY)
    
    yeni_kasa_kaydi = Vault(
        user_id=data['user_id'],
        site_name=data['site_name'],
        site_url=data.get('site_url', ''),
        encrypted_password=encrypted_pw
    )
    db.session.add(yeni_kasa_kaydi)
    db.session.commit()
    return jsonify({"mesaj": f"{data['site_name']} şifresi güvenli bir şekilde kasaya eklendi!"}), 201

# 3. Kasadaki Şifreleri Çözerek Getirme
@app.route('/get_passwords/<int:user_id>', methods=['GET'])
def get_passwords(user_id):
    kasa_kayitlari = Vault.query.filter_by(user_id=user_id).all()
    sonuclar = []
    
    for kayit in kasa_kayitlari:
        # Veritabanındaki şifreli veriyi çözüyoruz
        decrypted_pw = decrypt_password(kayit.encrypted_password, ENCRYPTION_KEY)
        sonuclar.append({
            "id": kayit.id,
            "site_name": kayit.site_name,
            "site_url": kayit.site_url,
            "password": decrypted_pw # Çözülmüş şifre
        })
        
    return jsonify({"kullanici_id": user_id, "sifreler": sonuclar}), 200

if __name__ == '__main__':
    app.run(debug=True)