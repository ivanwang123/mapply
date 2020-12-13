import React, {useState} from 'react';
import firebase from '../config/firebaseConfig';
import {Link, Redirect} from 'react-router-dom';
import {Form, FormGroup, Button, Input, Label} from 'reactstrap';
import Navbar from './Navbar';


function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSignup, setIsSignup] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.currentTarget;

        switch(name) {
            case 'email': setEmail(value); break;
            case 'password': setPassword(value); break;
            case 'confirm-password': setConfirmPassword(value); break;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill in all fields');
        } else if (password.length < 6) {
            setError('Password must be 6 characters or longer');
        } else if (password !== confirmPassword) {
            setError('Passwords do not match');
        } else {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(cred => {
                    setError('');
                    setIsSignup(true);
                    console.log("REGISTER SUCCESS", email, password, confirmPassword)
                    
                }).catch(err => {
                    setError('Error registering user')
                })
        }
    }

    return (
        <div>
        <Navbar />
        <div className="container navbar-padding">

            <h1>Sign Up</h1>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" name="email" value={email} placeholder="Email" onChange={(e)=>handleChange(e)}/> 
                </FormGroup>
                
                <FormGroup>
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" name="password" value={password} placeholder="Password" onChange={(e)=>handleChange(e)}/> 
                </FormGroup>
                
                <FormGroup>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input type="password" name="confirm-password" value={confirmPassword} placeholder="Confirm Password" onChange={(e)=>handleChange(e)}/> 
                </FormGroup>
                
                {error.length ? <div>{error}</div> : null}
                <Button color="primary">Sign Up</Button>
                <p className="mt-3">
                    Already have an account? 
                    <Link to="/login" className="ml-1">Log in</Link>
                </p>
            </Form>
            {isSignup ? <Redirect to="/login"/> : null}
        </div>
        </div>
    )
}

export default Signup
