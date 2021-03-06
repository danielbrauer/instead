export function string(name: string) {
    const value = process.env[name]
    if (value === undefined)
        throw new Error(`Environment variable ${name} required, but not found`)
    return value
}

export function int(name: string) {
    return parseInt(string(name))
}

export function strings(name: string) {
    return string(name).split(',')
}

export function isLocalDev() {
    return process.env.NODE_ENV !== 'production'
}
