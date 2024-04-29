const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const handleCreateGallery = (e, onGalleryCreate) => {
    e.preventDefault();

    const galleryName = e.target.querySelector('#galName').value;
    const galleryDescription = e.target.querySelector('#galDesc').value;

    if (!galleryName) {
        helper.handleError('Name required to create gallery.');
        return false;
    }

    helper.sendPost(e.target.action, {galleryName, galleryDescription}, onGalleryCreate);
    return false;
};

const handleRemoveGallery = (e, onGalleryRemove) => {
    e.preventDefault();

    const galleryName = e.target.querySelector('#galName').value;

    if (!galleryName) {
        helper.handleError('Name required to remove gallery.');
        return false;
    }

    helper.sendPost(e.target.action, {galleryName}, onGalleryRemove);
    return false;
};

const handleAddImage = (e, onImageAdd) => {
    e.preventDefault();

    const imageName = e.target.querySelector('#imgName').value;
    const imageInfo = e.target.querySelector('#imgInfo').value;
    const imageURL = e.target.querySelector('#imgURL').value;

    if (!imageName || !imageURL) {
        helper.handleError('Name and URL required to add image.');
        return false;
    }

    helper.sendPost(e.target.action, {imageName, imageInfo, imageURL}, onImageAdd);
    return false;
};

const handleRemoveImage = (e, onImageRemove) => {
    e.preventDefault();

    const imageName = e.target.querySelector('#imgName').value;

    if (!imageName) {
        helper.handleError('Name required to remove image.');
        return false;
    }

    helper.sendPost(e.target.action, {imageName}, onImageRemove);
    return false;
};

const handlePasswordChange = (e) => {
    e.preventDefault();

    const oldPassword = e.target.querySelector('#oldPass').value;
    const newPassword = e.target.querySelector('#newPass').value;
    const newPassword2 = e.target.querySelector('#newPass2').value;

    if(!oldPassword || !newPassword || !newPassword2) {
        helper.handleError('All fields are required for password change.');
        return false;
    }

    if(newPassword !== newPassword2) {
        helper.handleError('New passwords do not match.');
        return false;
    }

    helper.sendPost(e.target.action, {oldPassword, newPassword, newPassword2});
    return false;
};

const CreateGalleryForm = (props) => {
    return (
        <div>
            <form id="createGalleryForm"
                name="createGalleryForm"
                onSubmit={(e) => handleCreateGallery(e, props.triggerReload)}
                action="/createGallery" 
                method="POST"
            >
                <label htmlFor="galName">Gallery Name: </label>
                <input type="text" id="galName" name="galName" placeholder="Enter Gallery Name"/><br/>
                <label htmlFor="galDesc">Gallery Desc: </label>
                <input type="text" id="galDesc" name="galDesc" placeholder="Enter Gallery Desc."/><br/><br/>
                <input type="submit" value="Create Gallery"/>
            </form>
        </div>
    );
};

const RemoveGalleryForm = (props) => {
    return (
        <div>
            <form id="removeGalleryForm"
                name="removeGalleryForm"
                onSubmit={(e) => handleRemoveGallery(e, props.triggerReload)}
                action="/removeGallery" 
                method="POST"
            >
                <label htmlFor="galName">Gallery Name: </label>
                <input type="text" id="galName" name="galName" placeholder="Enter Gallery Name"/><br/><br/>
                <input type="submit" value="Remove Gallery"/>
            </form>
        </div>
    );
};

const AddImageForm = (props) => {
    return (
        <div>
            <form id="addImageForm"
                name="addImageForm"
                onSubmit={(e) => handleAddImage(e, props.triggerReload)}
                action="/addImage" 
                method="POST"
            >
                <label htmlFor="imgName">Image Name: </label>
                <input type="text" id="imgName" name="imgName" placeholder="Enter Image Name"/><br/>
                <label htmlFor="imgInfo">Image Info: </label>
                <input type="text" id="imgInfo" name="imgInfo" placeholder="Enter Image Info"/><br/>
                <label htmlFor="imgURL">Image URL: </label>
                <input type="text" id="imgURL" name="imgURL" placeholder="Enter Image URL"/><br/><br/>
                <input type="submit" value="Add Image"/>
            </form>
        </div>
    );
};

const RemoveImageForm = (props) => {
    return (
        <div>
            <form id="removeImageForm"
                name="removeImageForm"
                onSubmit={(e) => handleRemoveImage(e, props.triggerReload)}
                action="/removeImage" 
                method="POST"
            >
                <label htmlFor="imgName">Image Name: </label>
                <input type="text" id="imgName" name="imgName" placeholder="Enter Image Name"/><br/><br/>
                <input type="submit" value="Remove Image"/>
            </form>
        </div>
    );
};

const PasswordChangeForm = (props) => {
    return (
        <div>
            <form id="passwordChangeForm"
                name="passwordChangeForm"
                onSubmit={handlePasswordChange}
                action="/changePassword" 
                method="POST"
            >
                <label htmlFor="oldPass">Old Password: </label>
                <input type="text" id="oldPass" name="oldPass" placeholder="Enter Old Password"/><br/>
                <label htmlFor="newPass">New Password: </label>
                <input type="password" id="newPass" name="newPass" placeholder="Enter New Password"/><br/>
                <label htmlFor="newPass2">Retype New Password: </label>
                <input type="password" id="newPass2" name="newPass2" placeholder="Retype New Password"/><br/><br/>
                <input type="submit" value="Change Password"/>
            </form>
        </div>
    );
};

const ImageDisplay = (props) => {
    const [images, setImages] = useState(props.images);

    useEffect(() => {
        const loadImagesFromServer = async () => {
            const response = await fetch('/getImages');
            const data = await response.json();
            setImages(data.images);
        };

        loadImagesFromServer();
    }, [props.reloadImages]);

    if(images.length === 0) {
        return (
            <div className="images">
                <h3>No images to display.</h3>
            </div>
        );
    }

    const imgElements = images.map(img => {
        return (
            <img src={img.url} className="galImage"/>
        );
    });

    return (
        <div className="images">
            {imgElements}
        </div>
    );
};

const GalleryList = (props) => {
    const [galleries, setGalleries] = useState(props.galleries);

    useEffect(() => {
        const loadGalleriesFromServer = async () => {
            const response = await fetch('/getGalleries');
            const data = await response.json();
            setGalleries(data.galleries);
        };

        loadGalleriesFromServer();
    }, [props.reloadGalleries]);

    if(galleries.length === 0) {
        console.log('No galleries!');
        return (
            <div className="galleries">
                <h3>No galleries to display.</h3>
            </div>
        );
    }

    const galleryDivs = galleries.map(gal => {
        return (
            <div className="gallery" name={gal.name} current="false" onClick={(e) => helper.setGallery(e, props.triggerReload)}>{gal.name}</div>
        );
    });

    return (
        <div className="galleries">
            {galleryDivs}
        </div>
    );
};

const Creator = (props) => {
    const [userForm, setUserForm] = useState('createGal');
    const [reloadImages, setReloadImages] = useState(false);
    const [reloadGalleries, setReloadGalleries] = useState(false);

    const creatorNav = (
        <nav className='navbar'>
            <div className='navBtn' onClick={() => setUserForm('createGal')}>Create Gallery</div>
            <div className='navBtn' onClick={() => setUserForm('addImg')}>Add Image to Gallery</div>
            <div className='navBtn' onClick={() => setUserForm('removeGal')}>Remove Gallery</div>
            <div className='navBtn' onClick={() => setUserForm('removeImg')}>Remove Image from Gallery</div>
        </nav>
    );

    switch (userForm) {
        case 'createGal':
            return (
                <div id="creator">
                    {creatorNav}

                    <section className="userInput">
                        <h3>Create Gallery</h3>
                        <CreateGalleryForm triggerReload={() => setReloadGalleries(!reloadGalleries)}/>
                    </section>

                    <section className="imgDisplay">
                        <ImageDisplay images={[]} reloadImages={reloadImages}/>
                    </section>

                    <section className="galList">
                        <h3>List of Galleries</h3>
                        <GalleryList galleries={[]} reloadGalleries={reloadGalleries} triggerReload={() => setReloadImages(!reloadImages)}/>
                    </section>
                </div>
            );

        case 'addImg':
            return (
                <div id="creator">
                    {creatorNav}

                    <section className="userInput">
                        <h3>Add Image to Gallery</h3>
                        <AddImageForm triggerReload={() => setReloadImages(!reloadImages)}/>
                    </section>

                    <section className="imgDisplay">
                        <ImageDisplay images={[]} reloadImages={reloadImages}/>
                    </section>

                    <section className="galList">
                        <h3>List of Galleries</h3>
                        <GalleryList galleries={[]} reloadGalleries={reloadGalleries} triggerReload={() => setReloadImages(!reloadImages)}/>
                    </section>
                </div>
            );

        case 'removeGal':
            return (
                <div id="creator">
                    {creatorNav}

                    <section className="userInput">
                        <h3>Remove Gallery</h3>
                        <RemoveGalleryForm triggerReload={() => setReloadGalleries(!reloadGalleries)}/>
                    </section>

                    <section className="imgDisplay">
                        <ImageDisplay images={[]} reloadImages={reloadImages}/>
                    </section>

                    <section className="galList">
                        <h3>List of Galleries</h3>
                        <GalleryList galleries={[]} reloadGalleries={reloadGalleries} triggerReload={() => setReloadImages(!reloadImages)}/>
                    </section>
                </div>
            );

        case 'removeImg':
            return (
                <div id="creator">
                    {creatorNav}

                    <section className="userInput">
                        <h3>Remove Image from Gallery</h3>
                        <RemoveImageForm triggerReload={() => setReloadImages(!reloadImages)}/>
                    </section>

                    <section className="imgDisplay">
                        <ImageDisplay images={[]} reloadImages={reloadImages}/>
                    </section>

                    <section className="galList">
                        <h3>List of Galleries</h3>
                        <GalleryList galleries={[]} reloadGalleries={reloadGalleries} triggerReload={() => setReloadImages(!reloadImages)}/>
                    </section>
                </div>
            );

        default:
            return (
                <div id="creator">
                    {creatorNav}

                    <section className="userInput">
                        <h3>Create Gallery</h3>
                        <CreateGalleryForm triggerReload={() => setReloadGalleries(!reloadGalleries)}/>
                    </section>

                    <section className="imgDisplay">
                        <ImageDisplay images={[]} reloadImages={reloadImages}/>
                    </section>

                    <section className="galList">
                        <h3>List of Galleries</h3>
                        <GalleryList galleries={[]} reloadGalleries={reloadGalleries} triggerReload={() => setReloadImages(!reloadImages)}/>
                    </section>
                </div>
            );
    }
};

const init = async () => {
    const displayCreator = document.getElementById('galleryBtn');
    const displayAccount = document.getElementById('accountBtn');

    const root = createRoot(document.getElementById('app'));
    displayCreator.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <Creator/> );
        return false;
    });

    displayAccount.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <PasswordChangeForm/> );
        helper.sendPost('/resetGallery', {});
        return false;
    });

    await helper.sendPost('/resetGallery', {});

    root.render( <Creator/> );
};

window.onload = init;