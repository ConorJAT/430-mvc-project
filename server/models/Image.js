const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();
const setURL = (url) => _.escape(url).trim();

const ImageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  info: {
    type: String,
    trime: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
    set: setURL,
  },
  gallery: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Gallery',
  },
  addedDate: {
    type: Date,
    default: Date.now,
  },
});

ImageSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  info: doc.info,
  url: doc.url,
  _id: doc._id,
});

const ImageModel = mongoose.model('Image', ImageSchema);
module.exports = ImageModel;
