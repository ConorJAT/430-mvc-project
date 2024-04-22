const controllers = require('./controllers');

const router = (app) => {
    app.get('/getImages', controllers.Gallery.getImages);
    app.get('/getGalleries', controllers.Gallery.getGalleries);

    app.get('/login', controllers.Account.loginPage);
    app.post('/login', controllers.Account.login);

    app.post('/signup', controllers.Account.signup);

    app.get('/logout', controllers.Account.logout);

    app.post('/changePassword', controllers.Account.changePassword);

    app.get('/creator', controllers.Gallery.galleryPage);
    app.post('/createGallery', controllers.Gallery.createGallery);
    app.post('/removeGallery', controllers.Gallery.removeGallery);
    app.post('/addImage', controllers.Gallery.addImage);
    app.post('/removeImage', controllers.Gallery.removeImage);

    app.get('/', controllers.Account.login);
};

module.exports = router;