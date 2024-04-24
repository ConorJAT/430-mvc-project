// Sends post request to server via fetch.
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (result.redirect) {
        window.location = result.redirect;
    };

    if (result.error) {
        handleError(result.error);
    }

    if (handler) {
        handler(result);
    }
};

const handleError = (err) =>{
    alert(err);
};

const setGallery = async (e) => {
    const gals = document.getElementsByClassName('gallery');
    console.log(gals);

    for (const gallery of gals) {
        gallery.setAttribute('current', 'false');
        gallery.style.backgroundColor = '#B4D0C5';
    }

    sendPost('/setGallery', { name: e.target.name });
    e.target.setAttribute('current', 'true');
    e.target.style.backgroundColor = '#8EB8A7';
};

module.exports = {
    sendPost,
    handleError,
    setGallery,
};