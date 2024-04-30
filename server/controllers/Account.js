// Import our Account model.
const models = require('../models');

const { Account } = models;

// loginPage() - Renders the entirety of the login page.
const loginPage = (req, res) => { res.render('login'); };

// signup() - Creates a user account and stores the data into the database.
const signup = async (req, res) => {
  // Retrieve account details.
  const user = `${req.body.username}`;
  const pass = `${req.body.password}`;
  const pass2 = `${req.body.password2}`;

  // All fields required; if one or more missing, return with 400 error.
  if (!user || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Passwords must match; if not matching, return with 400 error.
  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  try {
    // Hash the account password and attempt to create new account record in database.
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username: user, password: hash });
    await newAccount.save();

    // Set current session account to newly created account.
    req.session.account = Account.toAPI(newAccount);

    // Redirect the user to the app.
    return res.json({ redirect: '/creator' });
  } catch (err) {
    // If not successful, log the error and return 500 error.
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use.' });
    }
    return res.status(500).json({ error: 'An error ocurred.' });
  }
};

// login() - Verify if the user exists, and if so, grant them entry into the app.
const login = (req, res) => {
  // Retrieve account details.
  const user = `${req.body.username}`;
  const pass = `${req.body.password}`;

  // All fields required; if one or more missing, return with 400 error.
  if (!user || !pass) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Authenticate the user's username and password.
  return Account.authenticate(user, pass, async (err, account) => {
    // If account doesn't exist or the password is invalid, return with 401 error.
    if (err || !account) {
      return res.status(401).json({ error: 'Invalid username and/or password.' });
    }

    // If successful, set current session account the user and redirect to the app.
    req.session.account = Account.toAPI(account);
    return res.json({ redirect: '/creator' });
  });
};

// logout() - Destroys the current session and redirects user to login page.
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// changePassword() - Allows the user to change their account's password.
const changePassword = async (req, res) => {
  // Retrieve account details.
  const oldPass = `${req.body.oldPassword}`;
  const newPass = `${req.body.newPassword}`;
  const newPass2 = `${req.body.newPassword2}`;

  // All fields required; if one or more missing, return with 400 error.
  if (!oldPass || !newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Old password must not match the new; if they match, return with 400 error.
  if (oldPass === newPass) {
    return res.status(400).json({ error: 'New and current passwords must not match.' });
  }

  // New passwords must match; if they do not match, return with 400 error.
  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'New passwords do not match.' });
  }

  // Authenticate to ensure the old password really old password.
  return Account.authenticate(req.session.account.username, oldPass, async (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Invalid old password.' });
    }

    // If the old password is true...
    try {
      // Generate hash for new password and update it in the database.
      const hash = await Account.generateHash(newPass);
      await Account.findByIdAndUpdate(req.session.account._id, { password: hash });

      // Log out password success and redirect to the app.
      console.log('Password change successful.');
      return res.json({ redirect: '/creator' });
    } catch (error) {
      // If not successful, log the error and return 500 error.
      console.log(error);
      return res.status(500).json({ error: 'Error changing password.' });
    }
  });
};

// subscribe() - Allows the user to become subscribe for the app's premium plan.
const subscribe = async (res, req) => {
  try {
    // Attempt to update the user's subscriber value to true.
    const doc = await Account.findByIdAndUpdate(req.session.account._id, { isSubscribed: true });
    req.session.account = Account.toAPI(doc);

    // Return with successful 200 status.
    return res.status(200).json({});
  } catch (err) {
    // If not successful, log the error and return 500 error.
    console.log(err);
    return res.status(500).json({ error: 'Error changing password.' });
  }
};

// Export all Account controller functions to be used in the router.
module.exports = {
  loginPage,
  signup,
  login,
  logout,
  changePassword,
  subscribe,
};
