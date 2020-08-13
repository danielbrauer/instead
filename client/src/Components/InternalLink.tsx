import React, { ReactNode } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'

interface Props {
    to: string,
    children: ReactNode,
}

export default function(props: Props) {
    const history = useHistory()

    const linkAction = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault()
        history.push(props.to)
    }

    return (
    <Link to={props.to} onClick={linkAction}>
        {props.children}
    </Link>
    )
}