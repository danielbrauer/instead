import React, { useEffect, useRef, useState } from 'react'
import { queryCache, useQuery } from 'react-query'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
import { Dropdown, Icon, Label, Menu } from 'semantic-ui-react'
import CurrentUser from './CurrentUser'
import FollowerPage from './FollowerPage'
import HomePosts from './HomePosts'
import NewPost from './NewPost'
import * as Routes from './routes/api'
import SinglePost from './SinglePost'
import UserPosts from './UserPosts'

export default function () {
    const [uploadInput, setUploadInput] = useState<File | null>(null)
    const [previousPage, setPreviousPage] = useState('')

    const inputFile = useRef<HTMLInputElement>(null)

    const history = useHistory()
    const requests = useQuery('followRequests', Routes.getFollowRequests)

    function onSelect(evt: React.ChangeEvent<HTMLInputElement>) {
        const file = evt.target.files && evt.target.files[0]
        if (file) {
            setUploadInput(file)
            setPreviousPage(history.location.pathname)
            history.push('/new')
        }
    }

    function onCancel() {
        setUploadInput(null)
        history.push(previousPage)
    }

    const logOutAndClear = async () => {
        try {
            await Routes.logout()
        } finally {
            queryCache.clear()
            CurrentUser.clear()
            history.push('/login')
        }
    }

    useEffect(() => {
        if (!CurrentUser.loggedIn()) logOutAndClear()
    })

    if (!CurrentUser.loggedIn()) return <Redirect to='/login' />

    return (
        <div>
            <input
                type='file'
                id='file'
                accept='image/jpeg, image/png'
                ref={inputFile}
                onChange={onSelect}
                style={{ display: 'none' }}
            />
            <Menu inverted fixed='top' size='small'>
                <Menu.Item header onClick={() => history.location.pathname !== '/home' && history.push('/home')}>
                    Instead
                </Menu.Item>
                <Menu.Item onClick={() => inputFile.current!.click()}>
                    <Icon fitted name='camera' />
                </Menu.Item>
                <Menu.Menu position='right'>
                    <Menu.Item onClick={() => history.push('/followers')}>
                        <Icon fitted name='users' />
                        {requests.isSuccess && requests.data!.length > 0 ? (
                            <Label color='red' size='medium' empty circular corner />
                        ) : null}
                    </Menu.Item>
                    <Dropdown item direction='left' text={CurrentUser.getUsername()}>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                icon='user'
                                text='Profile'
                                onClick={() => history.push(`/user/${CurrentUser.getId()}`)}
                            />
                            <Dropdown.Divider />
                            <Dropdown.Item icon='sign-out' text='Log Out' onClick={logOutAndClear} />
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
            </Menu>
            <br />
            <br />
            <Switch>
                <Route path={['/followers', '/following']} component={FollowerPage} />
                <Route path='/home' component={HomePosts} />
                <Route path='/new'>
                    <NewPost uploadInput={uploadInput!} onCancel={onCancel} />
                </Route>
                <Route path='/post/:id' component={SinglePost} />
                <Route path='/user/:id' component={UserPosts} />
            </Switch>
        </div>
    )
}
