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
        const ordersCollection = database.collection('orders')

        //GET 6 PRODUCTS
        app.get('/products', async(req, res)=> {
            const cursor = productsCollection.find({});
            const products = await cursor.limit(6).toArray();
            res.send(products);
        });

        //GET 10 PRODUCTS
        app.get('/products/explore', async(req, res)=> {
            const cursor = productsCollection.find({});
            const products = await cursor.limit(10).toArray();
            res.send(products);
        });

        //GET SINGLE API
        app.get('/products/:id', async(req, res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productsCollection.findOne(query);
            res.json(product)
        });

        //GET ORDER
        app.get('/orders', async(req, res)=>{
            const email = req.query.email;
            const query = {email: email};
            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders)
        })

        //POST ORDER API
        app.post('/orders', async(req, res)=> {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            console.log(result)
            res.json(result)
        });

        // DELETE API
        app.delete('/orders/:id', async(req, res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await ordersCollection.deleteOne(query);
            console.log('deleting result id', result)
            res.json(result)
        });
    
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