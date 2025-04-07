import React, { useEffect, useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './artpages/checkout.css';

function useCountdown(seconds) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return timeLeft;
}

function Checkout() {
  const [confirmed, setConfirmed] = useState(false);
  const [name, setName] = useState('');
  const [payment, setPayment] = useState('');
  const [ticketCode, setTicketCode] = useState('');
  const inputRef = useRef(null);
  const timeLeft = useCountdown(60); // 60 detik countdown

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleConfirm = () => {
    if (name && payment) {
      const code = `TIX-${Math.floor(Math.random() * 1000000)}`;
      setTicketCode(code);
      setConfirmed(true);
    }
  };

  useEffect(() => {
    if (confirmed) {
      localStorage.setItem('ticketName', name);
      localStorage.setItem('ticketPayment', payment);
      localStorage.setItem('ticketCode', ticketCode);
    }
  }, [confirmed, name, payment, ticketCode]);

  return (
    <div className="checkout-container">
      <h2>Konfirmasi Pembelian Tiket</h2>
      {!confirmed ? (
        <>
          <input
            ref={inputRef}
            type="text"
            placeholder="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="checkout-input"
          />
          <select
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            className="checkout-input"
          >
            <option value="">Pilih Metode Pembayaran</option>
            <option value="Dana">Dana</option>
            <option value="OVO">OVO</option>
            <option value="Gopay">Gopay</option>
            <option value="Transfer Bank">Transfer Bank</option>
          </select>
          <button className="buy-button" onClick={handleConfirm} disabled={!name || !payment}>
            Konfirmasi
          </button>
        </>
      ) : (
        <div className="confirmation">
          <h3>🎉 Tiket berhasil dipesan!</h3>
          <p>Nama: {name}</p>
          <p>Pembayaran: {payment}</p>
          <p>Kode Tiket: {ticketCode}</p>
          <p><QRCodeCanvas value={ticketCode} size={128} className="qr-code" /></p>
          <p className="timer">Sisa waktu: {timeLeft} detik</p>
        </div>
      )}
    </div>
  );
}

export default Checkout;
