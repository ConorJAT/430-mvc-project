const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getImages', mid.requiresLogin, controllers.Gallery.getImages);
  app.get('/formatImage', mid.requiresLogin, controllers.Gallery.formatImage);
  app.get('/getGalleries', mid.requiresLogin, controllers.Gallery.getGalleries);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.post('/changePassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassword);

  app.get('/creator', mid.requiresLogin, controllers.Gallery.galleryPage);
  app.post('/createGallery', mid.requiresLogin, controllers.Gallery.createGallery);
  app.post('/removeGallery', mid.requiresLogin, controllers.Gallery.removeGallery);
  app.post('/setGallery', mid.requiresLogin, controllers.Gallery.setGallery);
  app.post('/resetGallery', mid.requiresLogin, controllers.Gallery.resetCurrentGallery);
  app.post('/addImage', mid.requiresLogin, controllers.Gallery.addImage);
  app.post('/removeImage', mid.requiresLogin, controllers.Gallery.removeImage);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
