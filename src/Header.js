import { Avatar, Button } from '@material-ui/core'
import React from 'react'
import { auth, provider } from './firebase'
import "./Header.css"
import { useStateProvider } from './StateProvider'

const Header = () => {

   const [{user}, dispatch] = useStateProvider();

    const handleSignIn = (e) => {
        e.preventDefault()
        auth.signInWithPopup(provider)
        .then((user) => {
            dispatch({
                type : "SET_USER",
                user : user.user
            })
        })
       .catch(error => alert(error.message))
       
    }

    const handleSignOut = (e) => {
        e.preventDefault()
        auth.signOut()
        .then(() => dispatch({
            type : "SET_LOGOUT",
            
        }))
        .catch(error => alert(error.message))
    }

    return (
        <div className="header">
            <div className="header__info">
            <div className="header__left">
                <h2> Meet App</h2>
            </div>
            <div className="header__right">
            
          
            {!user ? (
                <Button
                onClick={handleSignIn}
                variant="outlined"
                className="header__button">Sign In With Google</Button>
            ) : (
                <div className="header__rightInfo">
                <Avatar src={user?.photoURL} className="header__avatar"/>
                <Button 
                onClick={handleSignOut}
                className="header__button">Sign Out</Button>
                </div>
            )}
            </div>
            </div>
        </div>
    )
}

export default Header
