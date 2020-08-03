import delayResponse from './delay-response'

describe('delay-response', () => {
    test('records start time and delays call to next()', () => {
        jest.useFakeTimers()
        const send = jest.fn()
        const next = jest.fn()
        const req = { send } as any
        const startTime = Date.now()
        delayResponse(6, 10)({} as any, req, next as any)
        expect(next).toBeCalled()
        req.send()
        expect(send).toBeCalledTimes(0)
        jest.runAllTimers()
        expect(Date.now() - startTime).toBeGreaterThan(5)
        expect(send).toBeCalled()
    })

    test('doesn\'t delay if delay is as short as operation', () => {
        const send = jest.fn()
        const next = jest.fn()
        const req = { send } as any
        const startTime = Date.now()
        delayResponse(0, 0)({} as any, req, next as any)
        expect(next).toBeCalled()
        req.send()
        expect(send).toBeCalled()
    })
})