export type EncryptedSecretKey = {
    encrypted: string
    counter: string
    prefix: string
}

export interface LoginInfo {
    username: string
    password: string
    secretKey: string
}

export interface NewUserInfo {
    username: string
    password: string
}

export interface SignupResult {
    encryptedSecretKey: EncryptedSecretKey
    unencryptedSecretKey: string
}
