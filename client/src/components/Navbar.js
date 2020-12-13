import React, {useContext} from 'react';
import firebase from '../config/firebaseConfig';
import {UserContext} from '../contexts/UserContext';
import {useHistory} from 'react-router'
import {withRouter} from 'react-router-dom'

function Navbar(props) {
    const {isAuthenticated} = useContext(UserContext);
    const history = useHistory();

    return (
        <div className="app-navbar navbar">
            <div class="logo" onClick={()=>props.history.push('/home')}>MAPPLY</div>
            <div className="navbar-button-container">
            {isAuthenticated ? (
                <button className="btn btn-outline-primary" onClick={()=>firebase.auth().signOut()}>Logout</button>
            ) : (
                <div>
                    <button className="btn btn-outline-primary mr-3" onClick={()=>props.history.push('/login')}>Login</button>
                    <button className="btn btn-outline-primary" onClick={()=>props.history.push('/signup')}>Signup</button>
                </div>
            )}
            </div>
        </div>
    )
}

export default withRouter(Navbar)
