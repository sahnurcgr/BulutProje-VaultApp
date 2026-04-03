🛡️ VaultApp: Full-Stack Password Manager with AWS Cloud Deployment
Bu proje, Ankara Üniversitesi Bilgisayar Mühendisliği kapsamında geliştirilmiş; güvenli parola saklama, uçtan uca şifreleme ve bulut bilişim prensiplerini temel alan bir parola yöneticisidir.

🚀 Canlı Dağıtım (Deployment) & Mimari
Uygulama, modern bulut mimarisi standartlarına uygun olarak Amazon Web Services (AWS) üzerinde canlıya alınmıştır.

Frontend: React.js (AWS EC2 üzerinde servis edilmektedir)

Backend API: Flask / Python (AWS EC2 - Gunicorn/Flask Server)

Veritabanı: AWS RDS (PostgreSQL)

Güvenlik Katmanı: AES-256 Bit Şifreleme (Cryptography.io)

✨ Öne Çıkan Özellikler
Uçtan Uca Şifreleme: Kullanıcı parolaları veritabanına asla "düz metin" (plain text) olarak kaydedilmez; AES algoritması ile şifrelenir.

Bulut Entegrasyonu: Yerel SQLite veritabanından, ölçeklenebilir AWS RDS PostgreSQL yapısına geçiş yapılmıştır.

CORS & Güvenlik: Frontend ve Backend arasındaki iletişim, güvenli köken (Origin) doğrulaması ile sağlanmaktadır.
