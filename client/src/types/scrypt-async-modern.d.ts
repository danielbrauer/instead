declare module 'scrypt-async-modern' {
    export interface ScryptOptions {
        N: number,
        r: number,
        p: number,
        dkLen: number,
        encoding: string,
    }

    export default function(password : Uint8Array, salt : Uint8Array, options : ScryptOptions) : Promise<string>
}