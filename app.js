const express = require('express');
const app = express();

// require('dotenv').config({ path: '../.env' });

const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const htmlPath = path.join(__dirname, '../public');

app.use(express.static('public'));

const port = process.env.PORT || 3000;

// const authenticate = require('./routes/authenticate');

const loadHome = require('./routes/home');

// const product = require('./routes/product');

// const user = require('./routes/user');

const cart = require('./routes/cart');

// app.use(authenticate);
app.use(loadHome);
// app.use(product);
// app.use(user);
app.use(cart);

app.use((req, res) => {
    try {
        res.sendFile('404.html', { root: htmlPath });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});