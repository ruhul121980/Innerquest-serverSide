const { ObjectId } = require('bson');
const { MongoClient, ServerApiVersion, Admin } = require('mongodb');
// const { ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app=express();
const port=process.env.PORT || 5000;


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://innerquest-counseling-services.web.app",
      "https://innerquest-counseling-services.firebaseapp.com",
    ],
    credentials: true,
  })
);
app.use(express.json());








const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v1zto12.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    app.get('/serviceInfo2', async (req, res) => {
      try {
        const searchText = req.query.search || ''; // Get the search text from query parameter
        const query = {}; // Initialize an empty query object
    
        // If search text is provided, add a regex condition to match service names from the beginning
        if (searchText) {
          query.service_name = { $regex: `^${searchText}`, $options: 'i' }; // Case-insensitive search
        }
    
        const cursor = services.find(query); // Use the query object to filter services
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).send('Internal Server Error');
      }
    });
    
    
    

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
        // console.log("Email:", email);
        
        const query = { 'email': email };
        const result = await services.find(query).toArray(); // Use await to wait for the result
        
        res.send(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.get('/bookedService/:email', async (req, res) => {
  try {
      const email = req.params.email;
      // console.log("Email:", email);
      
      const query = { 'currentUserEmail': email };
      const result = await booking.find(query).toArray(); 
      
      res.send(result);
  } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
  }
});


app.get('/providerBookedService/:providerEmail', async (req, res) => {
  try {
      const providerEmail = req.params.providerEmail;
     
      
      const query = { 'email': providerEmail };
      const result = await booking.find(query).toArray(); 
      
      res.send(result);
  } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
  }
});


app.delete('/serviceInfo/:id',async(req,res)=>{
  const id=req.params.id;
  
  const query={_id:new ObjectId(id)}
  const result=await services.deleteOne(query)
  res.send(result)
}
)

app.put('/serviceInfo/:id',async(req,res)=>{
  const id=req.params.id;
  const user=req.body;
  console.log(user)
  const filter={_id:new ObjectId(id)}
  const options={upsert:true}
  const updatedUser={
    
    $set:{
      image_url:user.image_url,
      service_name:user.service_name,
      price:user.price,
      service_area:user.service_area,
      description:user.description
      
     
    }
  }
  const result=await services.updateOne(filter,updatedUser,options)
  res.send(result)
})



app.patch('/providerBookedService2/:id', async (req, res) => {
  const id = req.params.id;
  const newData = req.body;
  console.log(newData.newStatus);
  console.log(id);
  const filter = { _id: id };
  const options = { upsert: true };
  const updatedUser = {
      $set: {
          serviceStatus: newData.newStatus
      }
  };
  try {
      const result = await booking.updateOne(filter, updatedUser, options);
      res.send(result);
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

    
    








    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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