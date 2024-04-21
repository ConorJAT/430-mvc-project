const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

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

const SignupWindow = (props) => {
    return (
        <div>
            <form id="signupForm"
                name="signupForm"
                onSubmit={handleSignup}
                action="/signup"
                method="POST"
            >
                <label htmlFor="username">Username: </label>
                <input type="text" id="user" name="username" placeholder="Enter Username"/>
                <label htmlFor="password">Password: </label>
                <input type="password" id="pass" name="password" placeholder="Enter Password"/>
                <label htmlFor="password2">Password: </label>
                <input type="password" id="pass2" name="password2" placeholder="Retype Password"/>
                <input type="submit" value="Sign Up"/>
            </form>
        </div>
    );
};

const LoginWindow = (props) => {
    return (
        <div>
            <form id="loginForm"
                name="loginForm"
                onSubmit={handleLogin} 
                action="/login"
                method="POST"
            >
                <label htmlFor="username">Username: </label>
                <input type="text" id="user" name="username" placeholder="Enter Username"/>
                <label htmlFor="password">Password: </label>
                <input type="password" id="pass" name="password" placeholder="Enter Password"/>
                <input type="submit" value="Sign In"/>
            </form>
        </div>
    );
};

const init = () => {
    const loginButton = document.getElementById('loginBtn');
    const signupButton = docuement.getElementById('signupBtn');

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