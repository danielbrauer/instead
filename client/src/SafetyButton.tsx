import { Button, ButtonProps } from "semantic-ui-react"
import React, { useState, ReactNode } from "react"
import { useCleanTimeout } from './UnmountCleanup'

export default function SafetyButton(props : ButtonProps) {
    const [tapped, setTapped] = useState(false)
    const setCleanTimeout = useCleanTimeout()

    function firstTap() {
        setTapped(true)
        setCleanTimeout(revert, 2000)
    }

    function revert() {
        setTapped(false)
    }

    if (tapped)
        return <Button onClick={props.onClick} negative {...props} >Confirm</Button>
    else
        return <Button onClick={firstTap} {...props}>{props.children}</Button>
}