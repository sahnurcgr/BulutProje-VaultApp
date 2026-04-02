from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    # Ana şifreyi asla düz metin (plain-text) tutmuyoruz
    master_password_hash = db.Column(db.String(200), nullable=False)

class Vault(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    site_name = db.Column(db.String(100), nullable=False)
    site_url = db.Column(db.String(200))
    # Şifrelenmiş (encrypted) parolayı tutacağımız alan
    encrypted_password = db.Column(db.Text, nullable=False)