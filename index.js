const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();

// middleware
app.use(express.json())
app.use(cors());

// database


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.BD_PASS}@cluster0.uuac6m8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const voluntrixCollection = client.db('voluntrixDB').collection('voluntrix');
    // add volunteer
    app.post('/add-volunteer', async(req, res) => {
        const voluntrixData = req.body;
        const result = await voluntrixCollection.insertOne(voluntrixData);
        res.send(result);
    })
    app.get('/volunteer', async(req, res) => {
      const result = await voluntrixCollection.find().toArray();
      res.send(result)
    })
    // get volunteer details
    app.get('/volunteer-details/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await voluntrixCollection.findOne(query);
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

app.get('/', async(req, res) => {
    res.send(
        'volumtrix server is running'
    )
})
app.listen(port, () => {
    console.log(`server running port ${port}`);
})