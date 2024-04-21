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

module.exports = {
    sendPost,
    handleError,
};