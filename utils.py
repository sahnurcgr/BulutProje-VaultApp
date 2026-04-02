from cryptography.fernet import Fernet

# Bu fonksiyonu şifreleme anahtarımızı üretmek için kullanacağız
def generate_key():
    return Fernet.generate_key()

# Şifreleme fonksiyonu
def encrypt_password(plain_text_password, key):
    f = Fernet(key)
    # Metni byte formatına çevirip şifreliyoruz
    encrypted_password = f.encrypt(plain_text_password.encode())
    return encrypted_password

# Şifre çözme (decryption) fonksiyonu
def decrypt_password(encrypted_password, key):
    f = Fernet(key)
    # Şifreli veriyi çözüp tekrar normal metne (string) çeviriyoruz
    decrypted_password = f.decrypt(encrypted_password).decode()
    return decrypted_password