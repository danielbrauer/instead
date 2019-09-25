import { Button, SemanticSIZES } from "semantic-ui-react"
import React, { useState, ReactNode, useEffect } from "react"
import { ButtonCallback } from "./Interfaces"

 interface SafetyButtonProps {
     size? : SemanticSIZES,
     onClick : ButtonCallback,
     children : ReactNode
 }

export default function SafetyButton(props : SafetyButtonProps) {
    const [tapped, setTapped] = useState(false)
    const [timeoutHandle, setTimeoutHandle] = useState<NodeJS.Timeout | null>(null)

    function firstTap() {
        setTapped(true)
        setTimeoutHandle(setTimeout(revert, 2000))
    }

    function revert() {
        setTapped(false)
    }

    useEffect(() => {
        return () => {
            if (timeoutHandle)
                clearTimeout(timeoutHandle)
        }
    })

    return (
        <div>
            {tapped ?
                <Button size={props.size} onClick={props.onClick} color='red'>Confirm</Button>
            :
                <Button size={props.size} onClick={firstTap}>{props.children}</Button>
            }
        </div>
        
    )
}