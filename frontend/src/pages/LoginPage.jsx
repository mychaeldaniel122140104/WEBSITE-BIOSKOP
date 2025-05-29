import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './artpages/login.css';


function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            alert('Isi username dan password terlebih dahulu.');
            return;
        }

        try {
            const response = await fetch('http://localhost:6543/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', 
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Simpan informasi login (opsional, misal token)
                // localStorage.setItem('token', data.token);
                navigate('/home');
            } else {
                alert(data.message || 'Login gagal!');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Terjadi kesalahan saat login.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <img src="/images/logo.jpg" alt="Logo" className="login-logo" />
                <form className="login-form" onSubmit={handleLogin}>
                    <h2 className="login-title">filmmychael</h2>
                    <p className="login-subtitle">Pesan Tiket dan Makanan di filmmychael!</p>

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>

                    <p className="signup-text">
                        Belum punya akun? <Link to="/register" className="signup-link">Daftar Sekarang!</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
