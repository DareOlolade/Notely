import CryptoJS from "crypto-js";

// ✅ FIX 1: Use environment variable instead of hardcoded key
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

if (!SECRET_KEY) {
  console.error(
    "⚠️ VITE_ENCRYPTION_KEY is not set in environment variables!"
  );
}

// ✅ FIX 2: Helper to check if text is actually encrypted
// CryptoJS AES prepends "Salted__" which encodes to base64 as "U2FsdGVkX1"
const isEncrypted = (text) => {
  try {
    return typeof text === "string" && text.startsWith("U2FsdGVkX1");
  } catch {
    return false;
  }
};

export const encryptData = (text) => {
  if (!text) return "";
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decryptData = (ciphertext) => {
  if (!ciphertext) return "";

  // ✅ FIX 3: If text isn't encrypted, return as-is (handles legacy plaintext notes)
  if (!isEncrypted(ciphertext)) {
    return ciphertext;
  }

  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    // ✅ FIX 4: Catch silent failures (wrong key or corrupted data)
    if (!decrypted) {
      console.error("Decryption produced empty result — wrong key or corrupted data");
      return "[Error: Could not decrypt this note]";
    }

    return decrypted;
  } catch (err) {
    console.error("Decryption failed:", err);
    return "[Error: Could not decrypt this note]";
  }
};