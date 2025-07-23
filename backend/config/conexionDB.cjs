const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function conectarDB() {
    try {
        await client.connect();
        console.log('Conectado a mongoDB');
        return client.db('viaGoApp');
    } catch (error) {
        console.error('Error al conectar con mongoDB:', error);
    }
}

module.exports = conectarDB ;