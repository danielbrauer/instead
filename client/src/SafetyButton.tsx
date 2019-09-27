import { Button, SemanticSIZES } from "semantic-ui-react"
import React, { useState, ReactNode } from "react"
import { ButtonCallback } from "./Interfaces"
import {useCleanTimeout} from './UnmountCleanup'

 interface SafetyButtonProps {
     size? : SemanticSIZES,
     onClick : ButtonCallback,
     children : ReactNode
 }

export default function SafetyButton(props : SafetyButtonProps) {
    const [tapped, setTapped] = useState(false)
    const setCleanTimeout = useCleanTimeout()

    function firstTap() {
        setTapped(true)
        setCleanTimeout(revert, 2000)
    }

    function revert() {
        setTapped(false)
    }

    return (
        <div>
            {tapped ?
                <Button size={props.size} onClick={props.onClick} negative>Confirm</Button>
            :
                <Button size={props.size} onClick={firstTap}>{props.children}</Button>
            }
        </div>
        
    )
}