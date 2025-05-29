import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './artpages/login.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('2'); // default user = 2
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validasi frontend
    if (!name.trim()) {
      alert("Nama lengkap tidak boleh kosong.");
      return;
    }

    if (!email.trim()) {
      alert("Email tidak boleh kosong.");
      return;
    }

    if (!password.trim()) {
      alert("Password tidak boleh kosong.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Password dan konfirmasi password tidak cocok.");
      return;
    }

    if (password.length < 3) {
      alert("Password minimal 3 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        username: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role: parseInt(role, 10) || 2,
      };

      // Debug: Log payload yang akan dikirim
      console.log('=== DEBUG FRONTEND ===');
      console.log('Payload yang akan dikirim:', payload);
      console.log('Role type:', typeof payload.role);
      console.log('Role value:', payload.role);

      const response = await fetch('http://127.0.0.1:6543/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Cek apakah response adalah JSON
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const textResult = await response.text();
        console.log('Non-JSON response:', textResult);
        throw new Error('Server tidak mengembalikan JSON response');
      }

      console.log('Response data:', result);
      console.log('=== END DEBUG FRONTEND ===');

      if (response.ok) {
        alert(result.message || 'Registrasi berhasil!');
        // Reset form
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setRole('2');
        // Navigate to login
        navigate('/login');
      } else {
        // Handle specific error messages
        const errorMessage = result.message || result.error || 'Registrasi gagal.';
        alert(errorMessage);
      }
      
    } catch (error) {
      console.error('Fetch error:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert('Tidak dapat menghubungi server. Pastikan server berjalan di http://127.0.0.1:6543');
      } else {
        alert('Terjadi kesalahan: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src="/images/logo.jpg" alt="Logo" className="login-logo" />
        <form className="login-form" onSubmit={handleRegister}>
          <h2 className="login-title">filmmychael</h2>
          <p className="login-subtitle">Daftar Akun untuk Pesan Tiket dan Makanan di filmmychael!</p>

          <input
            type="text"
            placeholder="Nama Lengkap"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={isLoading}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
          <input
            type="password"
            placeholder="Password (min 3 karakter)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isLoading}
            required
            minLength="3"
          />
          <input
            type="password"
            placeholder="Konfirmasi Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            required
          />

          <select 
            value={role} 
            onChange={e => setRole(e.target.value)}
            disabled={isLoading}
          >
            <option value="2">User</option>
            <option value="1">Admin</option>
          </select>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Mendaftar...' : 'Daftar'}
          </button>

          <p className="signup-text">
            Sudah punya akun? <a href="/login" className="signup-link">Login Sekarang!</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;