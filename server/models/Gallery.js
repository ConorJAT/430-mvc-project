const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const GallerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    set: setName,
  },
  description: {
    type: String,
    trime: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  imageCount: {
    type: Number,
    max: 20,
    default: 0,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  lastEditDate: {
    type: Date,
    default: Date.now,
  },
});

GallerySchema.statics.toAPI = (doc) => ({
  name: doc.name,
  description: doc.description,
  imageCount: doc.imageCount,
  _id: doc._id,
});

const GalleryModel = mongoose.model('Gallery', GallerySchema);
module.exports = GalleryModel;
