// Import our Gallery and Image models.
const models = require('../models');

const { Gallery, Image } = models;

const galleryPage = async (req, res) => { res.render('app'); };

const getGalleries = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Gallery.find(query).select('name description').lean().exec();

    return res.json({ galleries: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving gallery data.', galleries: [] });
  }
};

const createGallery = async (req, res) => {
  if (!req.body.galleryName) {
    return res.status(400).json({ error: 'Name is required to create gallery.' });
  }

  const galleryData = {
    name: req.body.galleryName,
    description: req.body.galleryDescription,
    owner: req.session.account._id,
  };

  try {
    const newGallery = new Gallery(galleryData);
    await newGallery.save();

    req.session.gallery = Gallery.toAPI(newGallery);
    return res.status(201).json({
      name: newGallery.name,
      description: newGallery.description,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Gallery with entered name already exists.' });
    }
    return res.status(500).json({ error: 'An error occured making gallery.' });
  }
};

const removeGallery = async (req, res) => {
  if (!req.body.galleryName) {
    return res.status(400).json({ error: 'Name is required to remove gallery.' });
  }

  console.log('Gallery removed! (NOT)');
};

const getImages = async (req, res) => {
  if (!req.session.gallery) {
    return res.status(400).json({ error: 'No galleries to retrieve images from.', images: [] })
  }
  
  try {
    const query = { gallery: req.session.gallery._id };
    const docs = await Image.find(query).select('name info url').lean().exec();

    return res.json({ images: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving image data.', images: [] });
  }
};

const addImage = async (req, res) => {
  if (!req.body.imageName || !req.body.imageURL) {
    return res.status(400).json({ error: 'Name and URL are required to add image.' });
  }

  if (!req.session.gallery) {
    return res.status(400).json({ error: 'No galleries created to add image.' })
  }

  const imgData = {
    name: req.body.imageName,
    info: req.body.imageInfo,
    url: req.body.imageURL,
    gallery: req.session.gallery._id,
  };

  try {
    const newImage = new Image(imgData);
    await newImage.save();

    return res.status(201).json({
      name: newImage.name,
      info: newImage.info,
      url: newImage.url,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured adding image.' });
  }
};

const removeImage = async (req, res) => {
  if (!req.body.imageName) {
    return res.status(400).json({ error: 'Name is required to remove image.' });
  }

  console.log('Image removed! (NOT)');
};

module.exports = {
  galleryPage,
  getGalleries,
  createGallery,
  removeGallery,
  getImages,
  addImage,
  removeImage,
};
