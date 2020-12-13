import React, { Component, createContext, useState, useEffect } from 'react';
import firebase from '../config/firebaseConfig';

export const UserContext = createContext();
// class UserProvider extends Component {
//     state = {
//         user: null,
//         isAuthenticated: false
//     }

//     handleUser = (user) => {
//         this.setState({
//             user: user
//         })
//     }

//     handleAuthenticate = (authenticate) => {
//         this.setState({
//             isAuthenticated: authenticate
//         })
//     }

//     componentDidMount() {
//         firebase.auth().onAuthStateChanged(u => {
//             console.log("USER CONTEXT", u);
//             this.handleUser(u);
//             this.handleAuthenticate(u ? true : false)
//         })
//     }

//     render() {
//         return (
//             <UserContext.Provider value={{...this.state, setUser: this.handleUser, setIsAuthenticated: this.handleAuthenticate}}>
//                 {this.props.children}
//             </UserContext.Provider>
//         )
//     }
// }

function UserProvider({children}) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(u => {
            console.log("USER CONTEXT", u);
            setUser(u);
            setIsAuthenticated(u ? true : false)
            setIsLoaded(true);
        })
    }, [])
    

    return (
        <div>
            {!isLoaded ? <h1>Loading...</h1> :
            <UserContext.Provider value={{user, isAuthenticated, setUser, setIsAuthenticated}}>
                {children}
            </UserContext.Provider>}
        </div>
    )
}

export default UserProvider
