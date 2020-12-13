import React, {useContext} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {UserContext} from '../contexts/UserContext';

function UnPrivateRoute({component: Component, ...rest}) {
    const {isAuthenticated} = useContext(UserContext);
    return (
        <Route {...rest} render={props => {
            if (isAuthenticated)
                return <Redirect to={{pathname:'/home'}} />
            return <Component {...props} />
        }} />
    )
}

export default UnPrivateRoute
