require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT

app.use(express.json())
app.use(cors())

//for mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
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
    const db = client.db('quiet-study')
    const allRooms = db.collection('all-rooms')

    app.get('/', (req, res) =>{
    res.send('<h1> This is Server Home page </h1>')
    })

    app.get('/all-rooms', async(req, res)=>{
        const result = await allRooms.find().limit(6).toArray()
        console.log(result)
        res.send(result)

    })
    app.get('/all-rooms/:id', async(req, res)=>{
        const {id} = req.params
       const query = {
        _id : new ObjectId(id)
       }
        const result = await allRooms.findOne(query)
        console.log(result)
        res.send(result)

    })
    app.post('/add-rooms', async(req,res)=>{
      const doc = req.body
      const result = await allRooms.insertOne(doc)
      res.send(result)
      console.log(`result owith insertedid: ${result.insertedId}`)

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

app.listen(port, ()=>{
    console.log(`running on port ${port}`)
})