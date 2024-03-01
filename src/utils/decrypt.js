import CryptoJS from 'crypto-js';
import { authName, secretKey } from './config';

export const decryptData = () => {

    const encryptionKey = secretKey;
    const storedEncryptedData = localStorage.getItem(authName)

    if (storedEncryptedData) {
        const decryptedBytes = CryptoJS.AES.decrypt(storedEncryptedData, encryptionKey);
        const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
        return decryptedData;
    }
  };
