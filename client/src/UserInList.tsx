import React from 'react'
import { List, Icon } from "semantic-ui-react"
import { User } from "./Interfaces"

export default function UserInList(props: { id: number, getUser: (userid: number) => User }) {
    return (

        <List.Content>
            <Icon size='big' name='user' />
            {props.getUser(props.id).username}
        </List.Content>
    )
}