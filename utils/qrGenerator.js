// server/utils/qrGenerator.js
const QRCode = require('qrcode');

// Generate a QR Code with session info
function generateQR(data) {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(JSON.stringify(data), (err, url) => {
      if (err) return reject(err);
      resolve(url);
    });
  });
}

module.exports = { generateQR };
