import { useEffect, useRef } from "react"

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