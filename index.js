const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.meftkqt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // collections
    const userCollection = client.db("GitFormedMinderDB").collection("users");
    const repoCollection = client
      .db("GitFormedMinderDB")
      .collection("repositories");
    const pullReqListCollection = client
      .db("GitFormedMinderDB")
      .collection("pullReqList");
    const watchListCollection = client
      .db("GitFormedMinderDB")
      .collection("watchList");

    // users api's
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    });
    app.post("/users", async (req, res) => {
      const user = req.body;
      //console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // repositories api's
    app.get("/repositories", async (req, res) => {
      const cursor = repoCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/repositories", async (req, res) => {
      const repositories = req.body;
      const result = await repoCollection.insertOne(repositories);
      res.send(result);
    });
    app.get("/repositories/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await repoCollection.findOne(query);
      res.send(result);
    });
    app.put("/repositories/:id", async (req, res) => {
      const item = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          Code: item.Code,
          language: item.language,
        },
      };
      const result = await repoCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });
    app.patch("/repositories/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $inc: { watching: +1 },
      };
      const result = await repoCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });
    app.delete("/repositories/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await repoCollection.deleteOne(query);
      res.send(result);
    });

    // WatchList Api's
    app.get("/watchList", async (req, res) => {
      const cursor = watchListCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/watchList", async (req, res) => {
      const watchList = req.body;
      const result = await watchListCollection.insertOne(watchList);
      res.send(result);
    });
    app.get("/watchList/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await watchListCollection.findOne(query);
      res.send(result);
    });
    app.delete("/watchList/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await watchListCollection.deleteOne(query);
      res.send(result);
    });

    // pullReqList api's
    app.get("/pullRequest", async (req, res) => {
      const cursor = pullReqListCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/pullRequest", async (req, res) => {
      const repositories = req.body;
      const result = await pullReqListCollection.insertOne(repositories);
      res.send(result);
    });
    app.get("/pullRequest/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await pullReqListCollection.findOne(query);
      res.send(result);
    });
    app.delete("/pullRequest/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await pullReqListCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("GitFormed Server is Running...");
});

app.listen(port, () => {
  console.log(`GitFormed Server is Running on port ${port}`);
});
