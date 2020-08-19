import { Button, ButtonProps } from 'semantic-ui-react'
import React, { useState } from 'react'
import { useCleanTimeout } from './UnmountCleanup'

export default function SafetyButton(props: ButtonProps) {
    const [tapped, setTapped] = useState(false)
    const setCleanTimeout = useCleanTimeout()

    function firstTap() {
        setTapped(true)
        setCleanTimeout(revert, 2000)
    }

    function revert() {
        setTapped(false)
    }

    if (!tapped)
        return (
            <Button {...props} onClick={firstTap}>
                {props.children}
            </Button>
        )
    else
        return (
            <Button {...props} negative>
                Confirm
            </Button>
        )
}
