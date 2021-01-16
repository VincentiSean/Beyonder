import React, { useState } from 'react';
import fire from '../config/Fire';

import TextField from '@material-ui/core/TextField';

function Login() {
    const [formHeader, setHeader] = useState("Welcome back!");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [loginBtn, setLoginBtn] = useState(true);
    const [fireErrors, setFireErrors] = useState("");
    const [samePass, setSame] = useState(false);

    let submitBtn = loginBtn
        ?   (<input id="standard-basic" className="onboard-submit" type="submit" onClick={login} value="Login" />)
        :   (<input className="onboard-submit" type="submit" onClick={register} value="Create Account" />);

        let loginRegister = loginBtn
        ?   (<div className="onboard-switch-wrapper">
                <p className="onboard-switch-text">Not a member? </p>
                <button className="onboard-switch-btn" onClick={() => getAction('reg')}>Signup Here!</button>
            </div>)
        :   (<div className="onboard-switch-wrapper">
                <p className="onboard-switch-text">Already a member? </p>
                <button className="onboard-switch-btn" onClick={() => getAction('log')}>Login Here!</button>
            </div>);
    
    let nameInputs = !loginBtn
        ?   (<div className="onboard-input-wrapper">
                <TextField 
                    id="outlined-required"
                    label="Name"
                    value={name}
                    onChange={handleChange}
                    name="name"
                />
            </div>)
        : (<></>);

    let confirmInputs = !loginBtn
        ?   (<div className="onboard-input-wrapper">
                <TextField 
                    id="outlined-password-input"
                    type="password"
                    label="Confirm Password"
                    value={confirmPass}
                    onChange={handleChange}
                    name="confirm-password"
                />
            </div>)
        : (<></>);


    function login(e) {
        e.preventDefault();
        return fire.auth().signInWithEmailAndPassword(email, password)
        .catch((error) => {
            setFireErrors(error.message);
        });
    }
    
    function register(e) {
        e.preventDefault();
        if (samePass) {
            fire.auth().createUserWithEmailAndPassword(email, password)
            .catch((error) => {
                setFireErrors(error.message);
            });
        }
    }

    function getAction(action) {
        if (action === 'reg') {
            setHeader("Let's get started!");
            setLoginBtn(false);
        } else {
            setHeader("Welcome back!");
            setLoginBtn(true);
        }
    }

    function handleChange(e) {
        if (e.target.name === "email") {
            setEmail(e.target.value);
        } else if (e.target.name === "password") {
            setPassword(e.target.value);
        } else if (e.target.name === "name") {
            setName(e.target.value);
        } else if (e.target.name === "confirm-password") {
            setConfirmPass(e.target.value);
            if (e.target.value !== password) {
                setSame(false);
            } else {
                setSame(true);
            }
        }
    }

    return (
        <div className="login-wrapper">
            <h3 className="onboard-title">
                {formHeader}
            </h3>
            {fireErrors}
            <form className="onboard-form">
                {nameInputs}
                <div className="onboard-input-wrapper">
                    <TextField 
                        id="outlined-required"
                        type="email"
                        label="Email"
                        value={email}
                        onChange={handleChange}
                        name="email"
                    />
                </div>
                <div className="onboard-input-wrapper">
                    <TextField 
                        id="outlined-password-input"
                        type="password"
                        value={password}
                        label="Password"
                        onChange={handleChange}
                        name="password"
                    />
                </div>
                {confirmInputs}
                {submitBtn}
            </form>
            {loginRegister}
        </div>
    )
} export default Login