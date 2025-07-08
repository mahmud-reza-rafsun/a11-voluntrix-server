const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();

// middleware
app.use(express.json())
app.use(cors());

// database


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cookieParser = require('cookie-parser');
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
    // await client.connect();

    const voluntrixCollection = client.db('voluntrixDB').collection('voluntrix');
    const beAVolunteerCollection = client.db('voluntrixDB').collection('beAVolunteer')

  
    // add volunteer
    app.post('/add-volunteer', async (req, res) => {
      const voluntrixData = req.body;
      const result = await voluntrixCollection.insertOne(voluntrixData);
      res.send(result);
    })
    app.get('/volunteer', async (req, res) => {
      const result = await voluntrixCollection.find().toArray();
      res.send(result)
    })
    // get volunteer details
    app.get('/volunteer-details/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await voluntrixCollection.findOne(query);
      res.send(result);
    })
    // be a volunteer post
    app.post('/be-a-volunteer', async (req, res) => {
      const beAVolunteerData = req.body;
      const result = await beAVolunteerCollection.insertOne(beAVolunteerData);
      res.send(result);
    })
    // specific user email volunteer
    app.get('/volunteer/:email', async (req, res) => {
      const email = req.params.email;
      const decodedEmail = req.user.email;
      if (decodedEmail !== email) {
        return res.status(401).send({ message: 'unAuthorize access' })
      }
      const query = { 'admin.email': email };
      const result = await voluntrixCollection.find(query).toArray();
      res.send(result);
    })
    app.get('/update-volunteer/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await voluntrixCollection.findOne(query);
      res.send(result);
    })
    app.put('/update-volunteer/:id', async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body
      const filter = { upsert: true };
      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: updatedData,
      }
      const result = await voluntrixCollection.updateOne(query, updatedDoc, filter)
      res.send(result);
    })
    // delete volunteer
    app.delete('/delete-volunteer/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await voluntrixCollection.deleteOne(query);
      res.send(result);
    })
    // be a volunteer get
    app.get('/be-a-volunteer', async (req, res) => {
      const result = await beAVolunteerCollection.find().toArray();
      res.send(result)
    })
    // delete my volunteer request
    app.delete('/delete-my-volunteer/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await beAVolunteerCollection.deleteOne(query);
      res.send(result);
    })
    // all volunteer 
    app.get('/all-volunteer', async (req, res) => {
      let search = req.query.search;
      let filter = {
        title: {
          $regex: search,
          $options: 'i',
        }
      }
      const result = await voluntrixCollection.find(filter).toArray();
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

app.get('/', async (req, res) => {
  res.send(
    'volumtrix server is running'
  )
})
app.listen(port, () => {
  console.log(`server running port ${port}`);
})