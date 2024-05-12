const { ObjectId } = require('bson');

// const { ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app=express();
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, Admin } = require('mongodb');

app.use(cors());
app.use(express.json());

// InnerQuestCounselingServices
// VWCO2ZIFW9s3JX6D






const uri = "mongodb+srv://InnerQuestCounselingServices:VWCO2ZIFW9s3JX6D@cluster0.v1zto12.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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


    const database = client.db("counselling");
    const services = database.collection("services");
    const booking=database.collection("booking");
    


    app.post('/serviceInfo',async(req,res)=>{
        const serviceInfo=req.body;
        const result = await services.insertOne(serviceInfo);
        res.send(result)
    })

    app.post('/booking',async(req,res)=>{
      const bookingInfo=req.body;
      const result=await booking.insertOne(bookingInfo);
      res.send(result);
    })

    app.get('/serviceInfo',async(req,res)=>{
      const cursor=services.find();
      const result=await cursor.toArray();
      res.send(result);
    })

    // app.get('/serviceInfo/:id',async(req,res)=>{
    //   const id=req.params.id;
    //   const query = {_id: new ObjectId(id) };
    //   const result = await services.findOne(query);
    //   res.send(result);
    // })  
    

    app.get('/serviceInfo/:id', async (req, res) => {
      try {
          const id = req.params.id;
          
          // Validate if 'id' is a valid ObjectId
          if (!ObjectId.isValid(id)) {
              return res.status(400).send('Invalid ID format');
          }
  
          const query = { _id: new ObjectId(id) };
          const result = await services.findOne(query);
  
          if (!result) {
              return res.status(404).send('Service not found');
          }
  
          res.send(result);
      } catch (error) {
          console.error('Error in fetching service information:', error);
          res.status(500).send('Internal Server Error');
      }
  });
  
  app.get('/matchServiceInfo',async(req,res)=>{
    const cursor=services.find();
    const result=await cursor.toArray();
    res.send(result);
  })

  app.get('/matchServiceInfo/:email', async (req, res) => {
    try {
        const email = req.params.email;
        console.log("Email:", email);
        
        const query = { 'email': email };
        const result = await services.find(query).toArray(); // Use await to wait for the result
        
        res.send(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
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






app.get('/',(req,res)=>{
    res.send("server is running")
})

app.listen(port,()=>{
    console.log(`port is running on ${port}`)
})