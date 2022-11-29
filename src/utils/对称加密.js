import JsEncrypt from 'jsencrypt';

export const getRSApass = (password) => {
  const jse = new JsEncrypt();
  // 公钥
  const publicString = `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7EbntGrc7HmrXOP89E8H
    r3nty3q7ZEGkPhrwdpe8lfH4fRXigC4MypISLjAnQPDvVC8X6a2iByyBpQpSeJhv
    vce8c1PAEVz4zjgHpU05zTPJLSHLivk04s/ryQy8z2KneN2vbreH1Y+87LEvhc4y
    AfAtWtD13E8ezUXDVOor4O/0Vzn9H0qwUSljfdB6gCVh2EtNrYstBt1tmfB0m5Dl
    0VwesnO3LayBvQnAYWnx3DvtRzWbFeVjAlZJk3guywAsDzTeLdq+rXLpI2LD6KN/
    oaS+GJRpNHtV2x7Wy0s/U4rWruaBrIpX0mkMwiKP7hrcc70QdczZKI6ZvWWVSqXz
    LQIDAQAB
    -----END PUBLIC KEY-----`;
  jse.setPublicKey(publicString);
  // 加密内容
  const encrypted = jse.encrypt(password);
  return encrypted;
};

// console.log('password:', getRSApass('147258'))
