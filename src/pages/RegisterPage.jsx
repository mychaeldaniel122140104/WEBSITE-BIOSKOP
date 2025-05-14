import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './artpages/login.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password dan konfirmasi password tidak cocok.");
      return;
    }
    if (name.trim() && email.trim() && phone.trim() && password.trim()) {
      // Simulasi pendaftaran berhasil, redirect ke halaman login
      alert('Registrasi berhasil!');
      navigate('/login');
    } else {
      alert('Isi semua field dengan benar.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src="/images/logo.png" alt="Logo" className="login-logo" />
        <form className="login-form" onSubmit={handleRegister}>
          <h2 className="login-title">filmmychael</h2>
          <p className="login-subtitle">Daftar Akun untuk Pesan Tiket dan Makanan di filmmychael!</p>

          <input
            type="text"
            placeholder="Nama Lengkap"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nomor Telepon"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Konfirmasi Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <button type="submit">Daftar</button>

          <p className="signup-text">
            Sudah punya akun? <a href="/login" className="signup-link">Login Sekarang!</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
