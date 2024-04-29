const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

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
  data: {
    type: Buffer,
  },
  size: {
    type: Number,
  },
  mimetype: {
    type: String,
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
  data: doc.data,
  mimetype: doc.mimetype,
  _id: doc._id,
});

const ImageModel = mongoose.model('Image', ImageSchema);
module.exports = ImageModel;
