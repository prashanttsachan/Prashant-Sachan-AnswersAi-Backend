const { Encoding, createCipheriv, createDecipheriv, randomBytes } = require("crypto");


class Encrypt {

    static Key = `0A3C5F0AAA6B75444D340CCE1C2631B32F52B7EB7C17996A`;

    static encrypt = (TokenConstant, data) => {
        const iv = randomBytes(TokenConstant.IV_LENGTH);
        const cipher = createCipheriv(TokenConstant.ALGORITHM, Buffer.from(TokenConstant.KEY), iv);
        return Buffer.concat([cipher.update(data,), cipher.final(), iv]).toString(TokenConstant.ENCODING);
    }

    static decrypt = (TokenConstant, token) => {
        try {
            const binaryData = Buffer.from(token, TokenConstant.ENCODING);
            const iv = binaryData.slice(-TokenConstant.IV_LENGTH);
            const encryptedData = binaryData.slice(0, binaryData.length - TokenConstant.IV_LENGTH);
            const decipher = createDecipheriv(TokenConstant.ALGORITHM, Buffer.from(TokenConstant.KEY), iv);
            return Buffer.concat([decipher.update(encryptedData), decipher.final()]).toString();
        }
          catch(err) {
            return "Invalid Token"
        }
    }
}

module.exports = { Encrypt };