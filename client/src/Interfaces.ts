import { ButtonProps } from 'semantic-ui-react'

export interface LoginInfo {
    username: string
    password: string
    secretKey: string
}

export interface NewUserInfo {
    displayName: string
    password: string
}

export interface SignupResult {
    username: string
    secretKey: string
}
