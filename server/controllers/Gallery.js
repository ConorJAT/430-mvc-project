// Import all our models.
const models = require('../models');

const { Account, Gallery, Image } = models;

// galleryPage() - Renders the entirety of the user app.
const galleryPage = async (req, res) => { res.render('app'); };

// getGalleries() - Retrieves all galleries created under the current session user.
const getGalleries = async (req, res) => {
  console.log(req.session.account.galleryCount);

  // If no galleries are created, return 200 status w/ empty array.
  if (req.session.account.galleryCount === 0) {
    return res.status(200).json({ galleries: [] });
  }

  try {
    // Attempt to retrieve all galleries under current user session _id.
    const query = { owner: req.session.account._id };
    const docs = await Gallery.find(query).select('name description').lean().exec();

    // If successful, return them to the user.
    return res.status(200).json({ galleries: docs });
  } catch (err) {
    // If not successful, log the error and return 500 error.
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving gallery data.' });
  }
};

// createGallery() - Creates a gallery object and adds it into the database.
const createGallery = async (req, res) => {
  // Name required; if no name provided, return 400 error.
  if (!req.body.galleryName) {
    return res.status(400).json({ error: 'Name is required to create gallery.' });
  }

  // Compile gallery data into JSON object.
  const galleryData = {
    name: req.body.galleryName,
    description: req.body.galleryDescription,
    owner: req.session.account._id,
  };

  try {
    // Attempt to create and store gallery to database.
    const newGallery = new Gallery(galleryData);
    await newGallery.save();

    // Update gallery count for current session account.
    const doc = await Account.findOneAndUpdate(
      { _id: req.session.account._id },
      { $inc: { galleryCount: 1 } },
      { returnDocument: 'after' },
    ).lean().exec();
    req.session.account = Account.toAPI(doc);

    // Return 201 status with new gallery's name and desc.
    return res.status(201).json({
      name: newGallery.name,
      description: newGallery.description,
    });
  } catch (err) {
    // If not successful, log the error and return 500 error.
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Gallery with entered name already exists.' });
    }
    return res.status(500).json({ error: 'An error occured making gallery.' });
  }
};

// removeGallery() - Removes a gallery and all images associated within the
//                   gallery from the database.
const removeGallery = async (req, res) => {
  // Name required; if no name provided, return 400 error.
  if (!req.body.galleryName) {
    return res.status(400).json({ error: 'Name is required to remove gallery.' });
  }

  try {
    // Search for requested gallery in the database.
    const query = { owner: req.session.account._id, name: req.body.galleryName };
    const galDoc = await Gallery.findOne(query).lean().exec();

    // Use found gallery's _id and remove all associated images.
    const selected = Gallery.toAPI(galDoc);
    await Image.deleteMany({ gallery: selected._id }).lean().exec();

    // Remove the gallery itself.
    await Gallery.deleteOne({ _id: selected._id }).lean().exec();

    // Update gallery count for current session account.
    const doc = await Account.findOneAndUpdate(
      { _id: req.session.account._id },
      { $inc: { galleryCount: -1 } },
      { returnDocument: 'after' },
    ).lean().exec();
    req.session.account = Account.toAPI(doc);

    // Return 200 status to denote removal success.
    console.log(`Galleries remaining after removal: ${req.session.account.galleryCount}`);
    console.log('Gallery successfully removed.');
    return res.status(200).json({});
  } catch (err) {
    // If not successful, log the error and return 500 error.
    console.log(err);
    return res.status(500).json({ error: 'An error occured removing gallery.' });
  }
};

// setGallery() - Sets the current session gallery (mainly to pull/add images from).
const setGallery = async (req, res) => {
  try {
    console.log(req.body.name);

    // Search for requested gallery in the database.
    const query = { owner: req.session.account._id, name: req.body.name };
    const doc = await Gallery.findOne(query).lean().exec();

    // Set the session gallery to found gallery and return with 200 status code.
    req.session.gallery = Gallery.toAPI(doc);
    console.log(req.session.gallery);
    return res.status(200).json({});
  } catch (err) {
    // If not successful, log the error and return 500 error.
    console.log(err);
    return res.status(500).json({ error: 'An error occured setting current gallery.' });
  }
};

const resetCurrentGallery = async (req, res) => {
  req.session.gallery = null;
  return res.status(200).json({});
};

// getImages() - Retrieves all images related to current session gallery from database.
const getImages = async (req, res) => {
  console.log(req.session.gallery);

  // If user has not created any galleries, return status code 200 with empty array.
  if (req.session.account.galleryCount === 0) {
    return res.status(200).json({ images: [] });
  }

  // If there is no current session gallery, return status code 400 with empty array.
  if (!req.session.gallery) {
    return res.status(400).json({ error: 'No galleries to retrieve images from.', images: [] });
  }

  try {
    // Attempt to retrieve all images with current session gallery's _id.
    const query = { gallery: req.session.gallery._id };
    const docs = await Image.find(query).select('_id').lean().exec();

    // Return list of image objects with 200 status code.
    return res.status(200).json({ images: docs });
  } catch (err) {
    // If not successful, log the error and return 500 error.
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving image data.', images: [] });
  }
};

const formatImage = async (req, res) => {
  if (!req.query._id) {
    return res.status(400).json({ error: 'Missing image id!' });
  }

  let img;
  try {
    img = await Image.findOne({ _id: req.query._id }).exec();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong retrieving image.' });
  }

  res.set({
    'Content-Type': img.mimetype,
    'Content-Length': img.size,
    'Content-Disposition': `filename="${img.name}"`,
  });

  return res.send(img.data);
};

// addImage() - Adds an image to the database.
const addImage = async (req, res) => {
  console.log(req.session.gallery);

  console.log(req.files.imgFile);
  console.log(req.body.imgName);

  if (!req.session.gallery) {
    return res.status(400).json({ error: 'No gallery selected to add image.' });
  }

  if (!req.files || !req.files.imgFile) {
    return res.status(400).json({ error: 'No files provided.' });
  }

  if (req.files.imgFile.mimetype !== 'image/jpeg'
      && req.files.imgFile.mimetype !== 'image/png'
      && req.files.imgFile.mimetype !== 'image/gif') {
    return res.status(400).json({ error: 'Unacceptable file type.' });
  }

  const { imgFile } = req.files;

  try {
    const imgData = {
      name: req.body.imgName,
      info: req.body.immInfo,
      data: imgFile.data,
      size: imgFile.size,
      mimetype: imgFile.mimetype,
      gallery: req.session.gallery._id,
    };

    const newImg = new Image(imgData);
    await newImg.save();

    const doc = await Gallery.findOneAndUpdate(
      { _id: req.session.gallery._id },
      { $inc: { imageCount: 1 } },
      { returnDocument: 'after' },
    ).lean().exec();
    req.session.gallery = Gallery.toAPI(doc);

    return res.status(201).json({
      name: newImg.name,
      info: newImg.info,
      type: newImg.mimetype,
      gallery: newImg.gallery,
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

  if (!req.session.gallery) {
    return res.status(400).json({ error: 'No gallery selected to remove image.' });
  }

  const query = {
    name: req.body.imageName,
    gallery: req.session.gallery._id,
  };

  try {
    await Image.deleteOne(query).lean().exec();

    // Update image count for current session gallery.
    const doc = await Gallery.findOneAndUpdate(
      { _id: req.session.gallery._id },
      { $inc: { imageCount: -1 } },
      { returnDocument: 'after' },
    ).lean().exec();
    req.session.gallery = Gallery.toAPI(doc);

    // Return 200 status to denote removal success.
    console.log('Image successfully removed.');
    return res.status(200).json({});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error removing image data.' });
  }
};

// Export all Gallery controller functions to be used in the router.
module.exports = {
  galleryPage,
  getGalleries,
  createGallery,
  setGallery,
  removeGallery,
  resetCurrentGallery,
  getImages,
  formatImage,
  addImage,
  removeImage,
};
