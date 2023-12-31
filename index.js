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

    // users
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
    // repositories
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
