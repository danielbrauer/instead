import { useEffect, useRef } from "react"

type PromiseCanceler<T> = {
    promise: Promise<T>
    cancel: () => void
}

export function makeCanceler<T>(promise: Promise<T>): PromiseCanceler<T> {
    let hasCanceled_ = false

    const wrappedPromise = new Promise((resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => {
        promise.then(
            (val: T) => hasCanceled_ ? reject({ isCanceled: true }) : resolve(val),
            (error: any) => hasCanceled_ ? reject({ isCanceled: true }) : reject(error)
        )
    })

    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true
        },
    }
}

export function useCleanupPromise() {
    const promises = useRef<PromiseCanceler<any>[]>([])
    useEffect(
        () => {
            return function cancel() {
                promises.current.forEach(p => p.cancel())
                promises.current = []
            }
        },
        []
    )

    return function(p: Promise<any>) {
        const cPromise = makeCanceler(p)
        promises.current.push(cPromise)
        return cPromise.promise
    }
}

export function useCleanTimeout() {
    const timeouts = useRef<NodeJS.Timeout[]>([])

    useEffect(
        () => {
            return function cancel() {
                timeouts.current.forEach(t => clearTimeout(t))
                timeouts.current = []
            }
        },
        []
    )

    return function(timerHandler : (...args: any[]) => void, timeout: number, ...args : any) {
        timeouts.current.push(setTimeout(timerHandler, timeout, ...args))
    }
}