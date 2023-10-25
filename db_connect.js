const { MongoClient } = require("mongodb");

const uri = process.env.DB_URI || "mongodb://127.0.0.1:27017";

let client;

function connectToDatabase(collection_name) {
    try {
        client = new MongoClient(uri);
        const database = client.db('sabji');
        const collection = database.collection(collection_name);
        console.log(`Connected to Server, Collection: ${collection_name} {connectToDatabase->try}`);
        return collection;
    } catch (error) {
        console.log("Error, Connecting to Server, {connectToDatabase->catch}");
        throw error;
    }
}

async function closeDatabaseConnection() {
    try {
        if (client) {
            await client.close();
            console.log("Database connection closed, {closeDatabaseConnection->try}\n");
        }else{
            console.log("Already closed, {closeDatabaseConnection->try}\n");
        }
    } catch (error) {
        console.log("Error closing the database connection, {closeDatabaseConnection->catch}\n");
        throw error;
    }
}

module.exports = { connectToDatabase, closeDatabaseConnection};