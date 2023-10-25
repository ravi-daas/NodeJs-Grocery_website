const exp = require('express');
const router = exp.Router();

const { connectToDatabase, closeDatabaseConnection } = require('../middleware/db_connect.js');

const { errorHandler } = require('../middleware/errorMiddleware.js');

router.get('/', showHome);

async function showHome(req, res, next) {
    try {
        let collection = connectToDatabase('products');
        const productsData = await findProducts(collection);
        const isAuthenticated = false;
        res.render('home', { products: productsData, isAuthenticated });
    } catch (error) {
        console.log(`2:{showHome->catch} => Rendering Error:${error}`);
        next(error);
    } finally {
        await closeDatabaseConnection();
    }
}

let productDocs;

async function findProducts(collection) {
    const productCursor = await collection.find({});
    return await productCursor.toArray();
}

router.use(errorHandler);

module.exports = router;
