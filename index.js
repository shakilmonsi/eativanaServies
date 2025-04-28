const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
// middleware
// middleware
// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');

// MongoDB connection URI from .env file
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sddcozk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with the Stable API version
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

    const menuCollection = client.db("bistroDb").collection("menu");
    const reviewCollection = client.db("bistroDb").collection("reviews");
    const contributorsCollection = client.db("bistroDb").collection("contributors");  // New collection for the form data


    app.get('/menu', async(req, res) =>{
        const result = await menuCollection.find().toArray();
        res.send(result);
    })
    
    app.get('/reviews', async(req, res) =>{
        const result = await reviewCollection.find().toArray();
        res.send(result);
    })


 // POST endpoint to save contributor form data
    app.post('/add-contributor', async (req, res) => {
      const { name, email, position, performance, award_position, profileImage, rewardImage } = req.body;
      
      console.log("Received contributor data:", { name, email, position, performance, award_position, profileImage, rewardImage });

      try {
        const result = await contributorsCollection.insertOne({
          name,
          email,
          position,
          performance,
          award_position,
          profileImage,  // Image URL or base64 can be stored if image is uploaded
          rewardImage,   // Image URL or base64 can be stored if image is uploaded
          createdAt: new Date()  // To track when this record is created
        });
        console.log("Contributor added:", result);
        res.status(200).json({ message: 'Contributor added successfully!', result });
      } catch (error) {
        console.error("Error adding contributor:", error);
        res.status(500).json({ message: 'Failed to add contributor.', error });
      }
    });



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
    res.send('boss is sitting')
})

app.listen(port, () => {
    console.log(`Bistro boss is sitting on port ${port}`);
})