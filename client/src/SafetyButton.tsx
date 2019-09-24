import { Button, SemanticSIZES } from "semantic-ui-react"
import React, { useState, ReactNode } from "react"
import { ButtonCallback } from "./Interfaces"

 interface SafetyButtonProps {
     size? : SemanticSIZES,
     onClick : ButtonCallback,
     children : ReactNode
 }

export default function SafetyButton(props : SafetyButtonProps) {
    const [tapped, setTapped] = useState(false)

    function firstTap() {
        setTapped(true)
    }

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