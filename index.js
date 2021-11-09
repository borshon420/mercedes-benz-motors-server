const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


// MIDDLEWARE
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pgkyz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
        const database = client.db('mercedes_benz');
        const productsCollection = database.collection('products');

        //GET API
        app.get('/products', async(req, res)=> {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
            console.log('hitting the servises')
        })

        //GET SINGLE API
        app.get('/products/:id', async(req, res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productsCollection.findOne(query);
            res.json(product)
        })
    
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res)=> {
    res.send('This is my Mercedes company');
});

app.listen(port, ()=>{
    console.log('listing the port', port)
})