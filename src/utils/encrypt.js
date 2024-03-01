import CryptoJS from 'crypto-js';
import { secretKey } from './config';

export const encrypt = async (jsonData)=>{
    const encryptionKey = secretKey;
    const jsonDataString = await JSON.stringify(jsonData)
    const encryptedData = CryptoJS.AES.encrypt(jsonDataString, encryptionKey).toString();
    return encryptedData
}