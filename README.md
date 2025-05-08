# WEBSITE-BIOSKOP
---

# Bioskop Online - Aplikasi Pemesanan Tiket Film

## Deskripsi
Website ini adalah aplikasi pemesanan tiket bioskop secara online. Pengguna dapat melihat daftar film yang tersedia, melihat detail film, dan melakukan pemesanan tiket secara online. Admin dapat menambah, mengedit, dan menghapus film.

## Fitur
- Autentikasi login untuk admin
- Daftar dan detail film
- CRUD data film (hanya admin)
- Pemesanan tiket
- Simpan data login di localStorage
- Proteksi endpoint dengan autentikasi dasar
- Responsive design

**BACK-END**

1. **Struktur Entitas**

   * **User (autentikasi & manajemen akun)**: Menangani proses pendaftaran, login, dan pengelolaan akun pengguna yang akan digunakan untuk pembelian tiket, pemilihan kursi, dan pengelolaan histori pembelian.
   * **Produk Film**: Informasi film yang mencakup judul, deskripsi, genre, durasi, gambar poster, tanggal tayang, dan jadwal tayang di bioskop.
   * **Pembelian Tiket**: Data transaksi tiket yang mencakup pemesanan tiket, kursi yang dipilih, jumlah tiket, total harga, dan status pembayaran.

2. **Endpoint RESTful API**

   * **/users** → CRUD akun pengguna
   * **/movies** → CRUD data film
   * **/schedule** → Menyediakan data jadwal tayang film
   * **/tickets** → CRUD pembelian tiket
   * **/payments** → Endpoint untuk sistem pembayaran

3. **Tools & Teknologi**

   * **Framework**: Node.js (opsional bisa menggunakan PHP jika diperlukan)
   * **Database**: postgresql untuk menyimpan data pengguna, film, jadwal, dan transaksi tiket
   * **ORM**: Sequelize atau Eloquent (untuk PHP)
   * **Autentikasi**: JSON Web Token (JWT) atau Basic Auth untuk autentikasi pengguna
   * **Testing**: Jest untuk pengujian unit dan integrasi
   * **Cakupan Fungsi**: Login pengguna, pembelian tiket, pemesanan kursi, CRUD film, dll ≥ 60%

---

**FERTILIZER E-COMMERCE FRONT-END**

1. **Halaman yang Dibuat**

   * **Home**: Halaman utama yang menampilkan film-film terbaru, rekomendasi film, dan jadwal tayang yang akan datang.
   * **Produk (List + Detail)**: Halaman daftar film beserta detail seperti sinopsis, pemeran utama, genre, dan durasi.
   * **Tambah/Edit Film (untuk Admin)**: Halaman yang hanya bisa diakses oleh admin untuk menambahkan atau mengedit data film yang tampil di bioskop.
   * **Login (Form Autentikasi)**: Form login untuk pengguna yang ingin memesan tiket atau bagi admin untuk mengelola data film.
   * **Tentang Bioskop**: Informasi tentang fasilitas, lokasi bioskop, cara pemesanan tiket, dan lain-lain.

2. **Teknologi & Tools**

   * **React.js** (Functional Components): Untuk membangun antarmuka pengguna dinamis
   * **React Router DOM**: Untuk navigasi antar halaman
   * **Axios**: Untuk komunikasi dengan backend API
   * **State Management**: Context API atau Redux Toolkit untuk mengelola state aplikasi
   * **Tailwind CSS / Bootstrap**: Untuk styling responsif dan tampilan yang rapi

---

**FERTILIZER E-COMMERCE PROSES AUTENTIKASI**

1. **Login dengan Form**

   * Pengguna mengisi form login untuk mengakses fitur pembelian tiket atau admin untuk mengelola data film.
   * Setelah berhasil login, data kredensial disimpan di localStorage untuk sesi pengguna.

2. **Kirim Token/Credential via Header**

   * Setiap request API yang membutuhkan autentikasi akan mengirimkan token yang disimpan di localStorage melalui header Authorization untuk mengakses data yang dilindungi.

---

**FERTILIZER E-COMMERCE USER FLOW**

1. **Pengunjung** dapat melihat daftar film, detail film, dan jadwal tayang tanpa login.
2. **Admin** harus login terlebih dahulu melalui halaman autentikasi. Setelah berhasil login, admin diarahkan ke dashboard untuk mengelola data film (menambah, mengedit, menghapus).
3. Admin dapat menambah film baru, memperbarui data film yang sudah ada, atau menghapus film yang tidak diperlukan. Semua interaksi admin dengan data film dilakukan melalui API dengan autentikasi dasar.
4. **CRUD Film** dilakukan melalui endpoint RESTful seperti GET, POST, PUT, dan DELETE pada `/movies`.
5. **Frontend React** berkomunikasi dengan backend (Node.js) menggunakan Axios atau Fetch API. Autentikasi dikirim melalui header Authorization dan digunakan untuk melindungi endpoint yang penting.
6. Setelah login, kredensial disimpan di localStorage untuk autentikasi selama sesi aktif, memastikan pengalaman yang lebih aman dan terkelola dengan baik.

