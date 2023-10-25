// errorMiddleware.js
const path = require('path');
const htmlPath = path.join(__dirname, '../../public');

function errorHandler(err, req, res, next) {
    console.error(err); // Log the error for debugging purposes

    // Determine the status code for the error response
    const statusCode = err.statusCode || 500;

    // Send an error response to the client
    // res.status(statusCode).json({msg: 'Internal Server ErroR'});
    res.status(500).sendFile('500.html', { root: htmlPath });
    return;
}

module.exports = { errorHandler };
