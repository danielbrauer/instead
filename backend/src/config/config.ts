function split(input: string) {
    if (input === null || input === undefined)
        return []
    else
        return input.split(',')
}

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
    return split(string(name))
}

export function isLocalDev() {
    return process.env.NODE_ENV != 'production'
}
