const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

// handleSignup() - Sends a post request to create a new user account.
const handleSignup = (e) => {
    e.preventDefault();

    const username = e.target.querySelector('#user').value;
    const password = e.target.querySelector('#pass').value;
    const password2 = e.target.querySelector('#pass2').value;

    if(!username || !password || !password2) {
        helper.handleError('All fields are required for sign up.');
        return false;
    }

    if(password !== password2) {
        helper.handleError('Passwords do not match.');
        return false;
    }

    helper.sendPost(e.target.action, {username, password, password2});
    return false;
};

// handleLogin() - Sends a post request to validate a user and allow/deny
//                 access into the app.
const handleLogin = (e) => {
    e.preventDefault();

    const username = e.target.querySelector('#user').value;
    const password = e.target.querySelector('#pass').value;

    if(!username || !password) {
        helper.handleError('All fields are required for login.');
        return false;
    }

    helper.sendPost(e.target.action, {username, password});
    return false;
};

// REACT COMPONENTS - LOGIN FORMS
const SignupWindow = (props) => {
    return (
        <div className='infoForm'>
            <form id="signupForm"
                name="signupForm"
                onSubmit={handleSignup}
                action="/signup"
                method="POST"
            >
                <label htmlFor="username">Username: </label>
                <input type="text" id="user" name="username" placeholder="Enter Username"/><br/>
                <label htmlFor="password">Password: </label>
                <input type="password" id="pass" name="password" placeholder="Enter Password"/><br/>
                <label htmlFor="password2">Password: </label>
                <input type="password" id="pass2" name="password2" placeholder="Retype Password"/><br/><br/>
                <input type="submit" value="Sign Up"/>
            </form>
        </div>
    );
};

const LoginWindow = (props) => {
    return (
        <div className='infoForm'>
            <form id="loginForm"
                name="loginForm"
                onSubmit={handleLogin} 
                action="/login"
                method="POST"
            >
                <label htmlFor="username">Username: </label>
                <input type="text" id="user" name="username" placeholder="Enter Username"/><br/>
                <label htmlFor="password">Password: </label>
                <input type="password" id="pass" name="password" placeholder="Enter Password"/><br/><br/>
                <input type="submit" value="Sign In"/>
            </form>
        </div>
    );
};

// init() - Set up navlinks and React root.
const init = () => {
    const loginButton = document.getElementById('loginBtn');
    const signupButton = document.getElementById('signupBtn');

    const root = createRoot(document.getElementById('content'));

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <LoginWindow/> );
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <SignupWindow/> );
        return false;
    });

    root.render( <LoginWindow/> );
};

window.onload = init;