import React, { useEffect, useRef, useState } from 'react'
import { queryCache, useQuery } from 'react-query'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
import { Icon, Label, Menu } from 'semantic-ui-react'
import Activity from './Activity'
import CurrentUser from './CurrentUser'
import FollowerPage from './FollowerPage'
import HomePosts from './HomePosts'
import NewPost from './NewPost'
import * as Routes from './routes/api'
import SinglePost from './SinglePost'
import UserPosts from './UserPosts'

export default function AppAuthenticated() {
    const [uploadInput, setUploadInput] = useState<File | null>(null)
    const [previousPage, setPreviousPage] = useState('')

    const fileInputElement = useRef<HTMLInputElement>(null)

    const history = useHistory()
    const requestCount = useQuery('followRequestCount', Routes.getFollowRequestCount)
    const activityCount = useQuery('activityCount', Routes.getActivityCount)

    function onSelect(evt: React.ChangeEvent<HTMLInputElement>) {
        const file = evt.target.files && evt.target.files[0]
        if (file) {
            setUploadInput(file)
            setPreviousPage(history.location.pathname)
            history.push('/new')
        }
    }

    function afterUpload() {
        setUploadInput(null)
        fileInputElement.current!.value = ''
        history.push('/home')
    }

    function cancelUpload() {
        setUploadInput(null)
        fileInputElement.current!.value = ''
        history.push(previousPage || '/home')
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
        if (history.location.pathname === '/new' && !uploadInput) cancelUpload()
    })

    if (!CurrentUser.loggedIn()) return <Redirect to='/login' />

    const homeActive = history.location.pathname === '/home'
    const newActive = history.location.pathname === '/new'
    const activityActive = history.location.pathname === '/activity'
    const followersActive = history.location.pathname === '/followers' || history.location.pathname === '/following'
    const profileActive = history.location.pathname === `/user/${CurrentUser.getId()}`

    return (
        <div className='root'>
            <input
                type='file'
                id='file'
                accept='image/jpeg, image/png'
                ref={fileInputElement}
                onChange={onSelect}
                style={{ display: 'none' }}
            />
            {!uploadInput ? (
                <Menu inverted borderless widths='5' fixed='bottom'>
                    <Menu.Item icon='home' active={homeActive} onClick={() => !homeActive && history.push('/home')} />
                    <Menu.Item active={activityActive} onClick={() => !activityActive && history.push('/activity')}>
                        <Icon name='chat' />
                        {activityCount.isSuccess && activityCount.data! > 0 ? (
                            <Label
                                content={activityCount.data!.toString()}
                                color='red'
                                size='small'
                                circular
                                floating
                            />
                        ) : null}
                        </Menu.Item>
                    <Menu.Item
                        icon='camera'
                        active={newActive}
                        onClick={() => !newActive && fileInputElement.current!.click()}
                    />
                    <Menu.Item active={followersActive} onClick={() => history.push('/followers')}>
                        <Icon name='users' />
                        {requestCount.isSuccess && requestCount.data! > 0 ? (
                            <Label
                                content={requestCount.data!.toString()}
                                color='red'
                                size='small'
                                circular
                                floating
                            />
                        ) : null}
                    </Menu.Item>
                    <Menu.Item
                        active={profileActive}
                        icon='user'
                        onClick={() => !profileActive && history.push(`/user/${CurrentUser.getId()}`)}
                    />
                </Menu>
            ) : null}
            <Switch>
                <Route path={['/followers', '/following']} component={FollowerPage} />
                <Route path='/home' component={HomePosts} />
                <Route path='/activity' component={Activity} />
                <Route path='/new'>
                    <NewPost uploadInput={uploadInput!} onCancel={cancelUpload} onSuccess={afterUpload} />
                </Route>
                <Route path='/post/:id' component={SinglePost} />
                <Route path='/user/:id'>
                    <UserPosts logout={logOutAndClear} />
                </Route>
            </Switch>
        </div>
    )
}
