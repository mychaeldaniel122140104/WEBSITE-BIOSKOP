import React, { useEffect, useState } from 'react';
import './artpages/ProfilePage.css';
import { FaCrown, FaCoins } from 'react-icons/fa';

function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:6543/api/profile', {
      credentials: 'include', // Kirim cookie session
    })
      .then(res => {
        if (!res.ok) throw new Error("Gagal ambil data profil");
        return res.json();
      })
      .then(data => {
        setUserData(data);
      })
      .catch(err => {
        console.error(err);
        alert("Gagal mengambil data profil. Silakan login kembali.");
      });
  }, []);

  if (!userData) {
    return <div className="profile-container">Memuat data profil...</div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profil Pengguna</h2>
      <div className="profile-card">
        <img src="/images/profile.jpg" alt="User Profile" className="profile-image" />
        <div className="profile-info">
          <p><strong>Nama:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Total Tiket Dibeli:</strong> 3</p>
          <div className="profile-extra">
            <span className="coins"><FaCoins /> 120 Coin</span>
            <span className="premium"><FaCrown /> Premium Member</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
