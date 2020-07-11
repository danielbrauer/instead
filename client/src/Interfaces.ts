import { ButtonProps } from "semantic-ui-react"

export interface LoginInfo {
    username: string
    password: string
    secretKey: string
}

export interface NewUserInfo {
    displayName: string
    password: string
}

export interface CurrentUserInfo {
    id: number
    username: string
    displayName: string
    secretKey: string
    accountKeys: CryptoKeyPair
}

export type ButtonCallback = (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => void