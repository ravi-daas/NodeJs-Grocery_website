const exp = require('express');
const router = exp.Router();

const { connectToDatabase, closeDatabaseConnection } = require('../middleware/db_connect.js');

const { errorHandler } = require('../middleware/errorMiddleware.js');

router.post('/addtoCart', addtoCart);

// 816a79ed29d390f92fc254ee483523cf3f10c78c0e2bb99a434b162ec792077d
const userId = '816a79ed29d390f92fc254ee483523cf3f10c78c0e2bb99a434b162ec792077d';

async function findProduct(productName) {
    try {
        console.log('{findProduct->try} => Fidning Product');
        let collection = connectToDatabase('products');
        product = await collection.findOne({ name: productName });
    } catch (error) {
        router.use(errorHandler);
    }
}

async function addtoCart(req, res, next) {
    try {
        await findProduct(req.body.productName);
        if (product !== null) {
            console.log('3:{addtoCart->try->if1}, => Product Found');
        } else {
            console.log('3:{addtoCart->try->else1}, => No Product Found');
            return res.status(500).json({ msg: 'No Product Found, Sorry🥺' });
        }
        const collection = connectToDatabase('carts');
        const cart = await collection.findOne({ owner: userId });

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
                await collection.updateOne({ owner: userId }, { $set: { [`items.${product.productId}`]: '1' } });
                console.log('3:{addtoCart->try->if->else} => Product Added In Cart');
                return res.status(200).json({ msg: 'Product Added In Cart' });
            }
        } else {
            console.log('3:{addtoCart->try->else} => Cart Not Found');
            const cartDocument = {
                items: {
                    [product.productId]: '1'
                },
                owner: userId,
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


router.get('/cart', findCart, showCart);

// async function isLogin(userData, req, res, next) {
//     try {
//         if (userData.isAuth) {
//             console.log('2:{isLogin->try->if} => LoggedIn User');
//             next(userData);
//         } else {
//             console.log('2:{isLogin->try->else} => LoggedOut User => Login Form');
//             await closeDatabaseConnection();
//             res.status(401).redirect('/login');
//         }
//     } catch (error) {
//         console.log(`2:{isLogin->catch} => Error Handler => Error: ${error}`);
//         next(error);
//     }
// }

const userData = {};

async function findCart(req, res, next) {
    try {
        const collection = connectToDatabase('carts');
        const cart = await collection.findOne({ owner: userId });

        console.log('lane34');
        console.log(cart);
        console.log('lane36');

        userData.cart = cart;
        console.log("3:{findCart->try} Done");
        next(userData);
    } catch (error) {
        console.log(`3:{findCart->catch} => Error Handler => Error: ${error}`);
        next(error);
    }
}

async function showCart(userData, req, res, next) {
    try {
        let cart = userData.cart;
        if (!cart) {
            console.log("4:{showCart->try->else} => Rendering Empty cart, No Cart Found");
            res.render('cart', { msg: 'Your cart is Empty', iscart: false });
        } else {

            const itemsLength = Object.keys(cart.items).length;

            if (itemsLength > 0) {
                let items = [];

                Object.keys(cart.items).forEach((key) => {
                    // to add key in array 
                    items.push(key);
                });

                let values = [];

                Object.keys(cart.items).forEach((item) => {
                    // to add value of key in array
                    values.push(cart.items[item]);
                });

                let products = await findProducts(items, values);

                let address = await findAddress();

                console.log("4:{showCart->try->if} => Rendering cart with items.");

                res.render('cart', { Address: address, products: products, values: values, iscart: true, totalPrice: totalPrice, index: 0 });
            } else {
                console.log("4:{showCart->try->else} => Rendering Empty cart.");
                res.render('cart', { msg: 'Your cart is Empty', iscart: false });
            }
        }
    } catch (error) {
        console.log(`4:{showCart->catch} => Error Handler => Error: ${error}`);
        next(error);
    } finally {
        await closeDatabaseConnection();
    }
}


async function findAddress() {
    try {
        const collection = connectToDatabase('users');
        const user = await collection.findOne({ userId: userId });
        return user.address;
    } catch (error) {
        throw error;
    }
}


let totalPrice;

async function findProducts(items, values) {
    totalPrice = 0;

    const collection = connectToDatabase('products');

    let products = [];

    let index = 0;

    for (const item of items) {

        const product = await collection.findOne({ productId: item });

        let total_price = product.price * values[index];

        totalPrice += total_price;

        products.push({
            name: product.name,
            image: product.image,
            price: product.price,
            unit: product.unit,
            totalPrice: total_price
        });

        index++;
    }
    return products;
}

router.post('/deleteCart', deleteItem);

async function deleteItem(req, res, next) {

    try {
        const collection = connectToDatabase('carts');

        const cart = await collection.findOne({ owner: userId });

        const productsCollection = connectToDatabase('products');

        const product = await productsCollection.findOne({ name: req.body.productName });

        if (cart) {
            if (cart && cart.items && cart.items.hasOwnProperty(product.productId)) {
                console.log('3:{deleteItem->try->if} Product Found');

                const cartDoc = await collection.updateOne({ owner: userId }, { $unset: { [`items.${product.productId}`]: '' } });

                if (cartDoc.acknowledged && cartDoc.modifiedCount === 1) {
                    console.log('3:{deleteItem->try->if} Product Deleted');
                    res.status(200).json({ msg: 'Deleted' });
                } else {
                    console.log('3:{deleteItem->try->if} Product Not Deleted');
                    res.status(400).json({ msg: 'Error' });
                }
            } else {
                console.log('3:{deleteItem->try->else} Not Deleted');
                res.status(400).json({ msg: 'Internal Server Error' });
            }
        }
    } catch (error) {
        console.log(`3:{deleteItem->catch} => Error Handler => Error: ${error}`);
        next(error);
    } finally {
        await closeDatabaseConnection();
    }
}

router.post('/updateCart', updateItem);

async function updateItem(req, res, next) {
    try {

        const collection = connectToDatabase('carts');

        const cart = await collection.findOne({ owner: userId });

        const productsCollection = connectToDatabase('products');

        const product = await productsCollection.findOne({ name: req.body.name });

        if (cart) {
            if (cart && cart.items && cart.items.hasOwnProperty(product.productId)) {


                const cartDoc = await collection.updateOne({ owner: userId }, { $set: { [`items.${product.productId}`]: req.body.value } });

                if (cartDoc.acknowledged && cartDoc.modifiedCount === 1) {
                    console.log('3:{updateItem->try->if} Product Updated');
                    res.status(200).json({ msg: 'Updated' });
                } else {
                    console.log('3:{updateItem->try->if} Product Not Updated');
                    res.status(400).json({ msg: 'Error' });
                }
            } else {
                console.log('3:{updateItem->try->else} Product Not Updated');
                res.status(400).json({ msg: 'Internal Server Error' });
            }
        }
    } catch (error) {
        console.log(`3:{updateItem->catch} => Error Handler => Error: ${error}`);
        next(error);
    } finally {
        await closeDatabaseConnection();
    }
}




router.use(errorHandler);

module.exports = router;