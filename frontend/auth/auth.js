// tiketbioskop/auth/auth.js

export class AuthManager {
  constructor() {
    this.tokenStorage = {};
  }

  login(username, password) {
    if (username && password) {
      const token = this.#generateToken(username);
      this.tokenStorage[username] = token;
      return { success: true, token };
    }
    return { success: false, message: "Login gagal" };
  }

  logout(username) {
    delete this.tokenStorage[username];
    return { success: true };
  }

  isAuthenticated(username) {
    return !!this.tokenStorage[username];
  }

  #generateToken(user) {
    const timestamp = new Date().getTime();
    return `${user}-${btoa(user + timestamp)}`;
  }

  verifyToken(username, token) {
    return this.tokenStorage[username] === token;
  }

  encryptData(data) {
    return btoa(data); // Base64 encoding simulasi "enkripsi"
  }

  decryptData(encrypted) {
    try {
      return atob(encrypted);
    } catch {
      return null;
    }
  }

  logActivity(username, action) {
    console.log(`[AUTH LOG] ${new Date().toISOString()} - ${username}: ${action}`);
  }
}
