function string(name: string) {
    const value = process.env[name]
    if (value === undefined) throw new Error(`Environment variable ${name} required, but not found`)
    return value
}

function int(name: string) {
    return parseInt(string(name))
}

function strings(name: string) {
    return string(name).split(',')
}

function isLocalDev() {
    return process.env.NODE_ENV != 'production'
}

export default {
    string,
    int,
    strings,
    isLocalDev,
}
