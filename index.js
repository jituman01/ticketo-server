const express = require('express');
const dotenv = require("dotenv")
dotenv.config();
const cors=require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT;

app.use(cors());
app.use(express.json());


const uri =process.env.MONGODB_URI;

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
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    const db = client.db('ticketoDb');
    const organizationCollection = db.collection("organizations");
    const eventsCollection = db.collection('events');
    const usersCollection = db.collection('user');
    const bookingCollection = db.collection('bookings');
    const paymentCollection = db.collection('payments');

    app.get('/api/organization/:email', async (req, res) => {
      const { email } = req.params;
      const result = await organizationCollection.findOne({ organizerEmail: email });
      res.send(result);
    })
    

    app.patch('/api/organizations/:id', async (req, res) => {
      const { organizationName, logo, website, description, organizerEmail } = req.body;
      const { id } = req.params;

      const updateData = {
        organizationName,
        logo,
        website,
        description,
        organizerEmail,
      
      };

      const result = await organizationCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            ...updateData,
          }
        }
      );
      return res.send(result);
    });

    app.post('/api/organizations', async (req, res) => {
      const { organizationName, logo, website, description, organizerEmail } = req.body;

      const addData = {
        organizationName,
        logo,
        website,
        description,
        organizerEmail,
        createdAt: new Date(),
        status: "active"
      };

      const result = await organizationCollection.insertOne(addData);
      return res.send(result);
    });




    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})