const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("TenJoy Server is running successfully")
}) 


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wy87kp4.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();

        const toysCollection = client.db("tenJoyDB").collection("toysCollection");


        app.get('/allToys', async (req, res) => {
            const result = await toysCollection.find().limit(20).toArray();
            res.send(result);
        })


        app.post('/allToys', async (req, res) => {
            const toys = req.body;
            const result = await toysCollection.insertOne(toys);
            res.send(result)
        })

        app.get('/allToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.findOne(query);
            res.send(result)
        })

        //searching
        // const indexKeys = { name: 1 };
        // const indexOptions = { name: "name" };
        // const result = toysCollection.createIndex(indexKeys, indexOptions);

        app.get('/allToySearchByName/:text', async (req, res) => {
            const searchtext = req.params.text;
            const result = await toysCollection.find({ name: searchtext }).toArray();
            res.send(result)
        })


        app.get('/myToys', async (req, res) => {

            let query = {};
            if (req.query?.email) {
                const query = { sellerEmail: req.query.email };
                const sort = req?.query?.sort === 'true' ? 1 : -1;
                const result = await toysCollection.find(query).sort({ price: sort }).toArray();
                res.send(result);
            }
            else {
                res.status(404).send({ error: true, message: "Email not found" })
            }
        })


        app.get('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.findOne(query);
            res.send(result)
        })


        app.put('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const toy = req.body;
            const updateDoc = {
                $set: {
                    price: toy.price,
                    quantity: toy.quantity,
                    descriptions: toy.descriptions,
                }
            }
            const result = await toysCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })



        app.delete('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            query = { _id: new ObjectId(id) }
            const result = await toysCollection.deleteOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log(`TenJoy Server is listening to the port, ${port}`);
})

