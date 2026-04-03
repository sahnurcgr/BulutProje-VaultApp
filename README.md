# Bulut Bilişim Projesi 1: Çift Katmanlı Şifre Kasası (Vault) Uygulaması

Bu proje, Bulut Bilişim dersi kapsamında geliştirilmiş, kullanıcıların şifrelerini güvenli bir şekilde saklayabildiği çift katmanlı (Full-Stack) bir web uygulamasıdır.

## Kullanılan Teknolojiler
* **Backend:** Python (Flask), Cryptography (AES Şifreleme)
* **Frontend:** React.js
* **Veritabanı:** WS RDS (PostgreSQL)
* **Bulut Mimarisi:** AWS EC2
* **Güvenlik Katmanı:** AES-256 Bit Şifreleme (Cryptography.io)

## Güvenlik Mimarisi
Kullanıcıların eklediği site şifreleri, veritabanına kaydedilmeden önce backend katmanında AES algoritması ile şifrelenir (encryption). Bu sayede veritabanı sızıntılarına karşı maksimum güvenlik sağlanır. Şifreler yalnızca kullanıcının talebi üzerine anlık olarak çözülüp (decryption) ön yüze iletilir.
