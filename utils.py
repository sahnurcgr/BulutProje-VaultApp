from cryptography.fernet import Fernet

def encrypt_password(password, key):
    f = Fernet(key)
    # Şifrele (Byte döner)
    encrypted_bytes = f.encrypt(password.encode('utf-8'))
    # PostgreSQL'e kaydetmek için temiz bir string'e çevir
    return encrypted_bytes.decode('utf-8') 

def decrypt_password(encrypted_password, key):
    f = Fernet(key)
    # PostgreSQL'den string olarak gelen veriyi çözmek için tekrar byte'a çevir
    decrypted_bytes = f.decrypt(encrypted_password.encode('utf-8'))
    return decrypted_bytes.decode('utf-8')