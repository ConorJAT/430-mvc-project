// Import our Account model.
const models = require('../models');
const { Account } = models;

const loginPage = (req, res) => { res.render('login'); };

const signup = async (req, res) => {
    const user = `${req.body.username}`;
    const pass = `${req.body.password}`;
    const pass2 = `${req.body.password2}`;

    if (!user || !pass || !pass2) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    
    if (pass !== pass2) {
        return res.status(400).json({ error: 'Passwords do not match.' });
    }

    try {
        const hash = await Account.generateHash(pass);
        const newAccount = new Account({ username: user, password: hash });
        await newAccount.save();
        req.session.account = Account.toAPI(newAccount);
        return res.json({ redirect: '/creator' });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Username already in use.' });
            }
        return res.status(500).json({ error: 'An error ocurred.' });
    }
};

const login = (req, res) => {
    const user = `${req.body.username}`;
    const pass = `${req.body.password}`;

    if (!user || !pass) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    return Account.authenticate(user, pass, (err, account) => {
        if (err || !account) {
            return res.status(401).json({ error: 'Invalid username and/or password.' });
        }

        req.session.account = Account.toAPI(account);

        return res.json({ redirect: '/creator' });
    });
};

const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};

const changePassword = async (req, res) => {
    const oldPass = `${req.body.oldPassword}`;
    const newPass = `${req.body.newPassword}`;
    const newPass2 = `${req.body.newPassword2}`;

    if (!oldPass || !newPass || !newPass2) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    if (oldPass === newPass) {
        return res.status(400).json({ error: 'New and current passwords must not match.' });
    }

    if (newPass !== newPass2) {
        return res.status(400).json({ error: 'New passwords do not match.' });
    }

    Account.authenticate(req.session.account.username, newPass, (err, account) => {
        if (err || !account) {
            return res.status(401).json({ error: 'Invalid old password.' });
        }
    });

    try {
        const hash = await Account.generateHash(newPass);
    
        await Account.findByIdAndUpdate(req.session.account._id, { password: hash });
        console.log('Password change successful.');
        return res.json({ redirect: '/creator' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error changing password.' });
    }
};

module.exports = {
    loginPage,
    signup,
    login,
    logout,
    changePassword,
};