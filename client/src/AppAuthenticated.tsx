import React, { useEffect, useRef, useState } from 'react'
import { queryCache, useQuery } from 'react-query'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
import { Icon, Label, Menu } from 'semantic-ui-react'
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

    const homeActive = history.location.pathname === '/home'
    const newActive = history.location.pathname === '/new'
    const followersActive = history.location.pathname === '/followers' || history.location.pathname === '/following'
    const profileActive = history.location.pathname === `/user/${CurrentUser.getId()}`

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
            <Menu inverted widths={4} fixed='bottom' size='small'>
                <Menu.Item icon='home' active={homeActive} onClick={() => !homeActive && history.push('/home')} />
                <Menu.Item icon='camera' active={newActive} onClick={() => !newActive && inputFile.current!.click()} />
                <Menu.Item active={followersActive} onClick={() => history.push('/followers')}>
                    <Icon name='users' />
                    {requests.isSuccess && requests.data!.length > 0 ? (
                        <Label content={requests.data!.length.toString()} color='red' size='small' circular floating />
                    ) : null}
                </Menu.Item>
                <Menu.Item
                    active={profileActive}
                    icon='user'
                    onClick={() => !profileActive && history.push(`/user/${CurrentUser.getId()}`)}
                />
            </Menu>
            <Switch>
                <Route path={['/followers', '/following']} component={FollowerPage} />
                <Route path='/home' component={HomePosts} />
                <Route path='/new'>
                    <NewPost uploadInput={uploadInput!} onCancel={onCancel} />
                </Route>
                <Route path='/post/:id' component={SinglePost} />
                <Route path='/user/:id'>
                    <UserPosts logout={logOutAndClear} />
                </Route>
            </Switch>
        </div>
    )
}
