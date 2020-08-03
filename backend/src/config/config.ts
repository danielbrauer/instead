function split(input: string) {
    if (input === null || input === undefined)
        return []
    else
        return input.split(',')
}

export function requireString(name: string) {
    const value = process.env[name]
    if (value === undefined)
        throw new Error(`Environment variable ${name} required, but not found`)
    return value
}

export function requireInt(name: string) {
    return parseInt(requireString(name))
}

export function requireStrings(name: string) {
    return split(requireString(name))
}

export function isLocalDev() {
    return process.env.NODE_ENV != 'production'
}
