declare module 'futoin-hkdf' {
    export default function(
        ikm: string,
        length: number,
        { salt, info, hash }: { salt: string; info: string; hash: string },
    ) : Buffer
}