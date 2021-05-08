import config from './config'

describe('config', () => {
    describe('string', () => {
        test('returns value if it exists', () => {
            process.env.TEST1 = 'VALUE'
            const value = config.string('TEST1')
            expect(value).toEqual('VALUE')
        })

        test("throws if doesn't exist", () => {
            expect(() => config.string('TEST2')).toThrow()
        })
    })

    describe('int', () => {
        test('converts to integer', () => {
            process.env.TESTINT = '100'
            const value = config.int('TESTINT')
            expect(value).toEqual(100)
        })
    })

    describe('strings', () => {
        test('splits on comma', () => {
            process.env.TESTSTRINGS = 'a,b'
            const value = config.strings('TESTSTRINGS')
            expect(value).toHaveLength(2)
            expect(value[0]).toEqual('a')
            expect(value[1]).toEqual('b')
        })
    })

    describe('isLocalDev', () => {
        test('returns true during testing', () => {
            expect(config.isLocalDev()).toEqual(true)
        })

        test('returns false if NODE_ENV == production', () => {
            process.env.NODE_ENV = 'production'
            expect(config.isLocalDev()).toEqual(false)
        })
    })
})
