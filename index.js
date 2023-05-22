const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cgmlfql.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const toyCollection = client.db('seller').collection('toys')

    app.get('/shop', async (req, res) => {
      const cursor = toyCollection.find().limit(6)
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/shop/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.findOne(query)
      res.send(result)
    })

    //add toys

    app.get('/toys', async (req, res) => {
      const cursor = toyCollection.find().limit(20)
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.findOne(query)
      res.send(result)
    })

    //specific data load
    app.get('/toysbyuser', async (req, res) => {
      console.log(req.query.email);
      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await toyCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/toysbyuser/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.findOne(query)
      res.send(result)
    })

    app.post('/toys', async (req, res) => {
      const newToys = req.body;
      console.log(newToys);
      const result = await toyCollection.insertOne(newToys)
      res.send(result)
    })

    app.put('/toysbyuser/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedToyData = req.body;
      const toysData = {
        $set: {
          name: updatedToyData.name,
          seller: updatedToyData.seller,
          price: updatedToyData.price,
          quantity: updatedToyData.quantity,
        }
      }
      const result = await toyCollection.updateOne(filter, toysData, options)
      console.log(toysData);
      res.send(result)
    })

    app.delete('/toysbyuser/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.deleteOne(query)
      res.send(result)
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


app.get('/', (req, res) => {
  res.send('all toys are here')
})

app.listen(port, () => {
  console.log(`toys server is runing on port: ${port}`);
})