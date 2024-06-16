//system constant for user
const userConstant = {
    EMAIL_VERIFIED_TRUE: 1,
    EMAIL_VERIFIED_FALSE: 0,
    STATUS_ACTIVE: 1,
    STATUS_INACTIVE: 0,
    STATUS_REMOVED: 2,
};
//verification code constant
const verificationCodeConstant = {
    TYPE_EMAIL_VERIFICATION: 1,
    TYPE_RESET_PASSWORD: 2,
    STATUS_NOT_USED: 0,
    STATUS_USED: 1,
};

// Password encoding constant
const PasswordConstant = {
    ALGORITHM: 'aes-256-cbc',
    ENCODING: 'hex',
    IV_LENGTH: 16,
    KEY: '57AD7A514FEFE224F6B5F33DCA181TYI'
}

const AuthConstant = {
    ALGORITHM: 'aes-256-cbc',
    ENCODING: 'hex',
    IV_LENGTH: 16,
    KEY: '7D376CBF5D4C64BCB254DB67B7BFBSBJ'
}

module.exports = {
    userConstant,
    verificationCodeConstant,
    PasswordConstant
};
