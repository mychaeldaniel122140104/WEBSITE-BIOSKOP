# 122140104
# Mychael Daniel N
# Pemweb RB

### 📘 Judul Aplikasi Web

**TiketBioskop Web App**

---

### 📝 Deskripsi Aplikasi Web

Aplikasi TiketBioskop adalah platform pemesanan tiket film berbasis web yang memungkinkan pengguna untuk melihat daftar film, memilih jadwal tayang, dan melakukan pemesanan tiket secara real-time. Aplikasi ini juga mendukung fitur administrasi untuk input data film dan manajemen pesanan.

---

### 📦 Dependensi Paket (Library)

Untuk menjalankan aplikasi ini, pastikan Anda menginstal dependensi berikut:

```bash
npm install
```

Daftar dependensi utama:
npx create-react-app my-app
cd my-app
npm install react-router-dom
* `react`
* `react-dom`
* `react-router-dom`

Backend :
pip install pyramid sqlalchemy passlib alembic psycopg2-binary
- pyramid: Framework web Python yang fleksibel dan ringan.
- sqlalchemy: ORM (Object-Relational Mapper) untuk berinteraksi dengan database.
- passlib: Digunakan untuk hashing password secara aman.
- alembic: Alat untuk migrasi skema database.
- psycopg2-binary: Driver PostgreSQL untuk Python.
  
DATABASE : PostgreSQL
---

### ⚙️ Fitur pada Aplikasi

- Pemesanan Tiket Film secara online.
- Pemilihan Kursi Real-Time (kursi langsung tertutup jika dibeli).
- Penjadwalan dan Manajemen Film oleh admin.
- Pemesanan Makanan dan Minuman dan pembelian tiket.
- Pembayaran Online dan Offline.
- Notifikasi atau Bukti Pemesanan.

---
# 🚀 Cara Menjalankan Frontend React

Proyek ini dibuat menggunakan [Create React App](https://github.com/facebook/create-react-app).

## 📦 Persiapan Awal

1. **Buka terminal / command prompt**
2. **Masuk ke folder proyek React**, misalnya:

   ```bash
   cd nama-folder-frontend
   ```

3. **Install semua dependensi** (hanya perlu sekali):

   ```bash
   npm install
   ```

## ▶️ Menjalankan Aplikasi

Untuk menjalankan aplikasi dalam mode development:

```bash
npm start
```

- Aplikasi akan terbuka di browser otomatis.
- Atau buka manual: [http://localhost:3000](http://localhost:3000)
- Perubahan pada file akan langsung terlihat (hot reload).

## 🧪 Menjalankan Testing (Opsional)

Jika ingin menjalankan test:

```bash
npm test
```

## 🔧 Build untuk Produksi

Jika ingin menyiapkan aplikasi untuk di-*deploy* (misalnya ke hosting):

```bash
npm run build
```

- Hasilnya akan ada di folder `build/`
- Sudah dioptimasi dan siap upload ke server.

## ⚠️ (Opsional) Eject Project

> **Hanya untuk pengguna tingkat lanjut!**

Jika ingin mengatur sendiri konfigurasi seperti webpack, Babel, dll:

```bash
npm run eject
```

Setelah eject, kamu tidak bisa kembali ke mode awal.

### CARA MEMBUAT DAN MENJALANKAN BACKEND PYRAMID 

Tahapan Pembuatan Aplikasi Web dengan Pyramid

# Buat folder untuk proyek
mkdir pyramid_mahasiswa
cd pyramid_mahasiswa

1. Instalasi Pyramid
- Pastikan Python 3 sudah terinstal di sistem kamu.
- Disarankan untuk menggunakan virtual environment:
python -m venv env
source env/bin/activate  # Untuk Linux/macOS
env\Scripts\activate     # Untuk Windows
- iNSTAL PYramid menggunakan pip
pip install "pyramid==2.0"
- Pastikan virtual environment aktif Jalankan cookiecutter dengan template Pyramid :
cookiecutter gh:Pylons/pyramid-cookiecutter-alchemy
Masukkan nama proyek dan template Language
-  Install dependensi proyek (development mode)
pip install -e ".[testing]"
2. Struktur yang terlihat

   pyramid_mahasiswa/
├── .coveragerc
├── .gitignore
├── CHANGES.txt
├── MANIFEST.in
├── README.txt
├── development.ini
├── production.ini
├── pytest.ini
├── setup.py
└── pyramid_mahasiswa/
    ├── __init__.py
    ├── alembic/
    │   ├── env.py
    │   ├── README
    │   ├── script.py.mako
    │   └── versions/
    ├── models/
    │   ├── __init__.py
    │   ├── meta.py
    │   └── mymodel.py
    ├── routes.py
    ├── scripts/
    │   ├── __init__.py
    │   └── initialize_db.py
    ├── static/
    │   ├── pyramid.png
    │   ├── pyramid-16x16.png
    │   ├── pyramid-32x32.png
    │   ├── theme.css
    │   └── theme.min.css
    ├── templates/
    │   ├── 404.jinja2
    │   ├── layout.jinja2
    │   └── mytemplate.jinja2
    ├── tests/
    └── views/
        ├── __init__.py
        ├── default.py
        └── notfound.py

3. Menjalankan PostgreSQL
- Login ke PostgreSQL Ganti username dengan user PostgreSQL Anda
psql -U postgres
- Di dalam shell PostgreSQL
CREATE DATABASE pyramid_mahasiswa;
CREATE USER pyramid_user WITH ENCRYPTED PASSWORD 'pyramid_pass';
GRANT ALL PRIVILEGES ON DATABASE pyramid_mahasiswa TO pyramid_user;
\q
- iNSTAL PSYCOPG2 untuk penghubungan python dan postgre
pip install psycopg2-binary

4. Konfigurasi Pyramid
- Ubah isi file Development.ini Cari dan ganti baris sqlalchemy.url
sqlalchemy.url = sqlite:///%(here)s/pyramid_mahasiswa.sqlite
Menjadi: 
sqlalchemy.url = postgresql://pyramid_user:pyramid_pass@localhost:5432/pyramid_mahasiswa

5. Membuat file migrasi
Buat file migrasi
alembic -c development.ini revision --autogenerate -m "create mahasiswa table"
 Jalankan migrasi
alembic -c development.ini upgrade head

6. Menjalankan Aplikasi
Pastikan virtual environment aktif Di root proyek
pserve development.ini --reload

---

# 📚 Referensi : React.js, Fetch, dan Pyramid Framework

## 1. [MDN Web Docs - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
Panduan lengkap tentang cara menggunakan `fetch()` untuk melakukan permintaan HTTP dari JavaScript (client side). Cocok untuk pemula hingga mahir.

---

## 2. [React.dev - Dokumentasi Resmi React](https://react.dev/)
Dokumentasi resmi React.js versi modern. Berisi panduan hooks (`useState`, `useEffect`), konsep JSX, manajemen state, dan pengembangan UI.

---

## 3. [Create React App - GitHub](https://github.com/facebook/create-react-app)
Starter project resmi dari tim React. Cocok untuk membuat proyek React dengan konfigurasi minimal.

---

## 4. [React Router - Navigasi di React](https://reactrouter.com/)
Dokumentasi resmi `react-router-dom` yang digunakan untuk membuat navigasi antar halaman (routing) di aplikasi React.

---

## 5. [Pyramid Official Documentation](https://docs.pylonsproject.org/projects/pyramid/en/latest/)
Dokumentasi lengkap Pyramid Web Framework (Python). Menjelaskan routing, view, model, dan integrasi REST API.

---

## 6. [RealPython - Membuat Web App dengan Pyramid](https://realpython.com/pyramid-python-web-app/)
Tutorial praktis dari RealPython untuk membangun aplikasi web menggunakan Pyramid, termasuk koneksi database dan deployment.

---

## 7. [FreeCodeCamp - Fetch API dan Async/Await](https://www.freecodecamp.org/news/javascript-fetch-api-tutorial-with-js-fetch-post-and-header-examples/)
Tutorial ringan dan jelas untuk memahami penggunaan fetch API dengan pendekatan `async/await`. Cocok untuk komunikasi React ke API backend.

---

## REFRENSI UTAMA : https://prakifpemweb.vercel.app/pemrograman-web/react-dasar
