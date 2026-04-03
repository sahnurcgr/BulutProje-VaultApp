import React, { useState } from 'react';

function App() {
  // Kullanıcı ve navigasyon durumları
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('login'); // login, list, add
  const [username, setUsername] = useState('');
  const [masterPassword, setMasterPassword] = useState('');

  // Şifre ekleme durumları
  const [siteName, setSiteName] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [sitePassword, setSitePassword] = useState('');

  // Kasa durumları
  const [passwords, setPasswords] = useState([]);

  // İstek Fonksiyonları
  const handleRegister = async () => {
    if(!username || !masterPassword) return alert("Lütfen boş alan bırakmayın!");
    
    const response = await fetch('http://3.236.112.142:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password: masterPassword })
    });
    
    const data = await response.json();
    
    // Eğer backend'den başarılı durumu (200 veya 201) dönerse
    if (response.ok) {
      setUserId(data.user_id);
      setActiveTab('list'); 
      alert("Hoş geldiniz! " + data.mesaj);
    } else {
      // Şifre yanlışsa veya hata varsa ekrana yazdır
      alert("Hata: " + data.hata);
    }
  };

  const handleAddPassword = async () => {
    if (!siteName || !sitePassword) return alert("Site adı ve şifre zorunludur!");
    const response = await fetch('http://3.236.112.142:5000/add_password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, site_name: siteName, site_url: siteUrl, password: sitePassword })
    });
    const data = await response.json();
    alert(data.mesaj);
    setSiteName(''); setSiteUrl(''); setSitePassword('');
    setActiveTab('list'); // Ekledikten sonra listeye dön
  };

  const handleGetPasswords = async () => {
    const response = await fetch(`http://3.236.112.142:5000/get_passwords/${userId}`);
    const data = await response.json();
    setPasswords(data.sifreler);
  };

  // Sekme değiştiğinde şifreleri otomatik çek
  React.useEffect(() => {
    if (activeTab === 'list' && userId) {
      handleGetPasswords();
    }
  }, [activeTab, userId]);

  // STİLLER (CSS)
  const styles = {
    container: { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: '#f4f7f6', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '50px' },
    card: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' },
    input: { display: 'block', width: '95%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px' },
    button: { width: '100%', padding: '12px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' },
    nav: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', backgroundColor: '#34495e', padding: '10px', borderRadius: '8px', color: 'white' },
    navItem: { cursor: 'pointer', padding: '8px 12px', borderRadius: '4px' },
    listItem: { backgroundColor: '#f9f9f9', padding: '15px', borderLeft: '4px solid #3498db', marginBottom: '10px', borderRadius: '4px', display: 'flex', flexDirection: 'column' }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ color: '#2c3e50', marginBottom: '30px' }}>🔐 MyVault</h1>

      <div style={styles.card}>
        {/* GİRİŞ YAPILMAMIŞSA SADECE LOGİN GÖSTER */}
        {activeTab === 'login' && (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sisteme Giriş</h2>
            <input placeholder="Kullanıcı Adı" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} />
            <input type="password" placeholder="Ana Şifre (Master Password)" value={masterPassword} onChange={(e) => setMasterPassword(e.target.value)} style={styles.input} />
            <button onClick={handleRegister} style={styles.button}>Kayıt Ol / Giriş Yap</button>
          </div>
        )}

        {/* GİRİŞ YAPILMIŞSA MENÜYÜ GÖSTER */}
        {activeTab !== 'login' && (
          <div style={styles.nav}>
            <div 
              style={{...styles.navItem, backgroundColor: activeTab === 'list' ? '#2c3e50' : 'transparent'}} 
              onClick={() => setActiveTab('list')}>
              📂 Kasam
            </div>
            <div 
              style={{...styles.navItem, backgroundColor: activeTab === 'add' ? '#2c3e50' : 'transparent'}} 
              onClick={() => setActiveTab('add')}>
              ➕ Yeni Şifre Ekle
            </div>
            <div 
              style={{...styles.navItem, color: '#e74c3c'}} 
              onClick={() => { setUserId(null); setActiveTab('login'); setPasswords([]); }}>
              Çıkış
            </div>
          </div>
        )}

        {/* ŞİFRE LİSTELEME EKRANI */}
        {activeTab === 'list' && (
          <div>
            <h3 style={{ marginBottom: '15px' }}>Kasadaki Şifreler</h3>
            {passwords.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#7f8c8d' }}>Kasanız şu an boş.</p>
            ) : (
              passwords.map((pw, index) => (
                <div key={index} style={styles.listItem}>
                  <strong style={{ fontSize: '18px', color: '#2c3e50' }}>{pw.site_name}</strong>
                  <span style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: '8px' }}>{pw.site_url}</span>
                  <div style={{ backgroundColor: '#ecf0f1', padding: '8px', borderRadius: '4px', fontFamily: 'monospace', color: '#c0392b', wordBreak: 'break-all' }}>
                    {pw.password}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* YENİ ŞİFRE EKLEME EKRANI */}
        {activeTab === 'add' && (
          <div>
            <h3 style={{ marginBottom: '15px' }}>Yeni Şifre Şifrele</h3>
            <input placeholder="Site Adı (Örn: Netflix)" value={siteName} onChange={(e) => setSiteName(e.target.value)} style={styles.input} />
            <input placeholder="Site URL (Örn: netflix.com)" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} style={styles.input} />
            <input type="password" placeholder="Bu Site İçin Şifreniz" value={sitePassword} onChange={(e) => setSitePassword(e.target.value)} style={styles.input} />
            <button onClick={handleAddPassword} style={{...styles.button, backgroundColor: '#27ae60'}}>Şifrele ve Kaydet</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;