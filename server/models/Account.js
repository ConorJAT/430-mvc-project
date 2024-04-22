// Import bcrypt and mongoose.
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { max } = require('underscore');

// Define number of salt rounds for encryption.
const saltRounds = 10;

let AccountModel = {};

// Define schema of what account data will be stored.
const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  password: {
    type: String,
    required: true,
  },
  galleryCount: {
    type: Number,
    max: 10,
    default: 0,
  },
  isSubscribed: {
    type: Boolean,
    default: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Converts doc to be used later in Redis.
AccountSchema.statics.toAPI = (doc) => ({
  username: doc.username,
  galleryCount: doc.galleryCount,
  isSubscribed: doc.isSubscribed,
  _id: doc._id,
});

AccountSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);

AccountSchema.statics.authenticate = async (username, password, callback) => {
  try {
    const doc = await AccountModel.findOne({ username }).exec();
    if (!doc) {
      return callback();
    }

    const match = await bcrypt.compare(password, doc.password);
    if (match) {
      return callback(null, doc);
    }

    return callback();
  } catch (err) {
    return callback(err);
  }
};

// Define and export the data model.
AccountModel = mongoose.model('Account', AccountSchema);
module.exports = AccountModel;
