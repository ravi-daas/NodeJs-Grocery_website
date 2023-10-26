const exp = require('express');
const router = exp.Router();
let product;

// const winston = require('winston');

// const logger = winston.createLogger({
//     level: 'silly',
//     format: winston.format.json(),
//     transports: [
//         new winston.transports.File({ filename: './app.log' }),
//     ],
// });

const { isAuth } = require('../middleware/pvtMiddleware.js');

const { connectToDatabase, closeDatabaseConnection } = require('../middleware/db_connect.js');

const { errorHandler } = require('../middleware/errorMiddleware.js');

router.get('/', isAuth, showHome);

async function showHome(userData, req, res, next) {
    try {
        let collection = connectToDatabase('products');
        const productsData = await findProducts(collection);
        const isAuthenticated = userData.isAuth || false;
        // console.log('2:{showHome->try} => Rendering home');
        // logger.silly('Rendering Home');
        res.removeHeader('X-Powered-By');
        res.removeHeader('Etag');
        res.setHeader('Cache-Control', 'no-cache');
        // res.send("SAT SAHEB");
        res.render('home', { products: productsData, isAuthenticated });
    } catch (error) {
        console.log(`2:{showHome->catch} => Rendering Error:${error}`);
        next(error);
    } finally {
        await closeDatabaseConnection();
    }
}

// logger.on('error', (error) => {
//     console.error('Winston Error:', error);
// });



let productDocs;

async function findProducts(collection) {
    const productCursor = await collection.find({});
    // productDocs = await productCursor.toArray();
    // return productDocs;
    return await productCursor.toArray();
}

/* Taal krdi aiki error ki maari(Konya) */

// router.post('/showProduct', showProduct, findReviews, extractuserIds, findNames);

// async function findProduct(productName) {
//     try {
//         console.log('{findProduct->try} => Fidning Product');
//         let collection = connectToDatabase('products');
//         product = await collection.findOne({ name: productName });
//     } catch (error) {
//         router.use(errorHandler);
//     }
// }

// async function showProduct(req, res, next) {
//     console.log(`Url: ${req.route.path}`);
//     try {
//         await findProduct(req.body.productName);
//         if (product !== null) {
//             console.log('1:{showProduct->try->if} => Product Found');
//             next();
//         } else {
//             console.log('1:{showProduct->try->else} => No Product Found');
//             await closeDatabaseConnection();
//             return res.status(500).json({ msg: 'No Product Found, Sorry🥺' });
//         }
//     } catch (error) {
//         console.log(`1:{showProduct->try} => Rendering Error: ${error}`);
//         next(error);
//     }
// }


// router.get('/product', isAuth, renderProduct);

// async function renderProduct(userData, req, res, next) {
//     try {
//         const isAuthenticated = userData.isAuth || false;
//         console.log('2:{renderProduct->try} => Rendering Product');
//         res.render('product', { product: product, isAuthenticated, products: productDocs, reviews: reviewDocs, names: reviewsuserNames, index: 0 });
//     } catch (error) {
//         console.log(`2:{renderProduct->catch} => Error Handler => Error:${error}`);
//         next(error);
//     } finally {
//         await closeDatabaseConnection();
//     }
// }

// let reviewDocs;

// async function findReviews(req, res, next) {
//     try {
//         console.log('2:{findReviews->try} => Finding Reviews');
//         const collection = connectToDatabase('reviews');
//         const reviewCursor = await collection.find({ productId: product.productId }).limit(5);
//         reviewDocs = await reviewCursor.toArray();
//         next();
//     } catch (error) {
//         console.log(`2:{findReviews->catch} => Error Handler => Error:${error}`);
//         next(error);
//     }
// }


// let reviewsuserIds = [];

// async function extractuserIds(req, res, next) {
//     reviewsuserIds = [];

//     try {
//         console.log('3:{extractuserIds->try} => extracting userIds');
//         reviewDocs.forEach(element => {
//             reviewsuserIds.push(element.userId)
//         });

//         console.log(reviewsuserIds);
//         next();
//     } catch (error) {
//         console.log(`3:{extractuserIds->catch} => Error Handler => Error:${error}`);
//         next(error);
//     }
// }


// let reviewsuserNames = [];

// async function findNames(req, res, next) {
//     reviewsuserNames = [];
//     try {
//         console.log('3:{findNames->try} => Finding Names');

//         for (let index = 0; index < reviewsuserIds.length; index++) {
//             const collection = connectToDatabase('users');
//             const userDoc = await collection.findOne({ userId: reviewsuserIds[index] });
//             reviewsuserNames.push(userDoc.name);
//         }
//         return res.status(200).json({ msg: 'OK' });

//     } catch (error) {
//         console.log(`3:{findNames->catch} => Error Handler => Error:${error}`);
//         next(error);
//     }
// }

// router.post('/addReview', isAuth, isLogin, checkReview, addReview);

// async function checkReview(userData, req, res, next) {

//     try {

//         const rating = req.body.rating;
//         const description = req.body.description;

//         if (rating < 1 || rating > 5 || rating.length == 0) {
//             console.log(`3:{checkReview->try->if} => Rating Error`);
//             res.status(400).json({ msg: 'Rating is only from 1 to 5' });
//         } else if (description.length == 0) {
//             console.log(`3:{checkReview->try->elseif} => Description Error`);
//             res.status(400).json({ msg: 'Plz add something in description' });
//         } else {
//             console.log(`3:{checkReview->try->elseif} => Checked`);
//             next(userData);
//         }
//     } catch (error) {
//         console.log(`3:{checkReview->catch} => Error Handler => Error: ${error}`);
//         next(error);
//     }
// }

// async function addReview(userData, req, res, next) {

//     try {
//         const collection = connectToDatabase('reviews');

//         const reviewDoc = await collection.insertOne({ rating: req.body.rating, description: req.body.description, userId: userData.userId, productId: product.productId })

//         if (reviewDoc.acknowledged) {
//             console.log(`4:{addReview->try->if} => Review Added`);
//             res.status(200).json({ msg: "Added" });
//         } else {
//             console.log(`4:{addReview->try->else} => Review Not Added`);
//             res.status(200).json({ msg: "Error Adding Review" });
//         }
//     } catch (error) {
//         console.log(`4:{addReview->catch} => Error Handler => Error: ${error}`);
//         next(error);
//     } finally {
//         await closeDatabaseConnection();
//     }
// }

/* Taal krdi error maari */

// router.post('/addtoCart', isAuth, isLogin, addtoCart);

async function isLogin(userData, req, res, next) {
    try {
        if (userData.isAuth) {
            console.log('2:{isLogin->try->if} => LoggedIn User');
            next(userData);
        } else {
            console.log('2:{isLogin->try->else} => LoggedOut User');
            await closeDatabaseConnection();
            return res.status(401).json({ msg: 'unauthorized' });
        }
    } catch (error) {
        console.log(`2:{isLogin->catch} => Error Handler => Error:${error}`);
        next(error);
    }
}

async function addtoCart(userData, req, res, next) {
    try {
        await findProduct(req.body.productName);
        if (product !== null) {
            console.log('3:{addtoCart->try->if1}, => Product Found');
        } else {
            console.log('3:{addtoCart->try->else1}, => No Product Found');
            return res.status(500).json({ msg: 'No Product Found, Sorry🥺' });
        }
        const collection = connectToDatabase('carts');
        const cart = await collection.findOne({ owner: userData.userId });

        if (cart) {
            console.log('3:{addtoCart->try->if} => Cart Found');
            if (cart && cart.items && cart.items.hasOwnProperty(product.productId)) {
                // The key exists in the "items" object
                // const itemQuantity = cart.items[product.productId];
                // console.log(`Item with key "${product.productId}" has quantity: ${itemQuantity}`);
                console.log('3:{addtoCart->try->if->if} => Product already in cart');
                return res.status(200).json({ msg: 'Product Already In Cart, Go to cart to Update Quantity.' });
            } else {
                // console.log(`Item with key "${product.productId}" not found in the cart.`);
                await collection.updateOne({ owner: userData.userId }, { $set: { [`items.${product.productId}`]: '1' } });
                console.log('3:{addtoCart->try->if->else} => Product Added In Cart');
                return res.status(200).json({ msg: 'Product Added In Cart' });
            }
        } else {
            console.log('3:{addtoCart->try->else} => Cart Not Found');
            const cartDocument = {
                items: {
                    [product.productId]: '1'
                },
                owner: userData.userId,
            }
            await collection.insertOne(cartDocument);
            console.log('3:{addtoCart->try->else} => Cart created, product added.');
            return res.status(200).json({ msg: 'Product Added In Cart' });
        }

    } catch (error) {
        console.log(`3:{addProduct->catch} => Error Handler => Error:${error}`);
        next(error);
    } finally {
        await closeDatabaseConnection();
    }
}


router.use(errorHandler);

module.exports = router;