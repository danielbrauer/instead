import React from 'react'
import { useHistory } from 'react-router'
import { Link, LinkProps } from 'react-router-dom'

export default function InternalLink(props: LinkProps) {
    const history = useHistory()

    const linkAction = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault()
        history.push(props.to as string)
    }

    return (
        <Link {...props} onClick={linkAction}>
            {props.children}
        </Link>
    )
}
