import React, {useContext} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {UserContext} from '../contexts/UserContext';

function PrivateRoute({component: Component, ...rest}) {
    const {isAuthenticated} = useContext(UserContext);
    return (
        <Route {...rest} render={props => {
            if (!isAuthenticated) {
                return <Redirect to={{pathname:'/login'}} />
            }
            return <Component {...props} />
        }} />
    )
}

export default PrivateRoute
