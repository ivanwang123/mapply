import React, {useState, useContext} from 'react';
import firebase from '../config/firebaseConfig';
import {Link, Redirect} from 'react-router-dom';
import {UserContext} from '../contexts/UserContext';
import {Form, FormGroup, Label, Input, Button} from 'reactstrap';
import Navbar from './Navbar';


function Login(props) {
    const userContext = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const {name, value} = e.currentTarget;

        switch(name) {
            case 'email': setEmail(value); break;
            case 'password': setPassword(value); break;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(cred => {
                userContext.setIsAuthenticated(true);
                userContext.setUser(cred.user);
                if (props.location.from)
                    props.history.push(props.location.from)
                else    
                    props.history.push('/home')
            }).catch(err => {
                setError('Incorrect username or password')
            })
    }

    return (
        <div>
            <Navbar />
        <div className="container navbar-padding">
            <h1>Login</h1>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" name="email" value={email} placeholder="Email" onChange={(e)=>handleChange(e)}/> 
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" name="password" value={password} placeholder="Password" onChange={(e)=>handleChange(e)}/> 
                </FormGroup>

                {error.length ? <div>{error}</div> : null}
                <Button color="primary">Login</Button>
                <p className="mt-3">
                    Don't have an account?
                    <Link to="/signup" className="ml-1">Sign up</Link>
                </p>
            </Form>
        </div>
        </div>
    )
}

export default Login
