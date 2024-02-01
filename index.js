require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());
// const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.asporxp.mongodb.net/?retryWrites=true&w=majority";
const uri = `mongodb+srv://taskTracker_user:egsZfP5R21Yg2EHS@cluster0.95tdnc9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("taskTracker");
    const tasksCollection = db.collection("tasks");

    app.get("/tasks", async (req, res) => {
      const cursor = tasksCollection.find({});
      const tasks = await cursor.toArray();

      res.send({ status: true, data: tasks });
    });

    app.post("/task", async (req, res) => {
      const task = req.body;
      const result = await tasksCollection.insertOne(task);
      res.send({ status: true, data: result });
    });

    app.patch("/task/:id", async (req, res) => {
      const id = req.params.id;
      const task = req.body;
      console.log("for update task", task);
      const filter = { _id: ObjectId(id) };

      console.log(filter);
      const updateDoc = {
        $set: {
          title: task.title,
          description: task.description,
          priority: task.priority,
          completed: task.completed,
        },
      };
      const updateProduct = await tasksCollection.updateOne(filter, updateDoc);
      res.send({ status: true, data: updateProduct });
    });

    app.put("/task/:id", async (req, res) => {
      const id = req.params.id;
      const task = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          title: task.title,
          imageUrl: task.imageUrl,
          tags: task.tags,
          description: task.description,
        },
      };
      const result = await tasksCollection.updateOne(filter, updateDoc);
      res.send({ status: true, data: result });
      console.log(result);
    });

    /// find single document
    app.get("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const content = await tasksCollection.findOne(query);
      // console.log('single content: ', content)
      res.send({ status: true, data: content });
    });

    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;

      const result = await tasksCollection.deleteOne({ _id: ObjectId(id) });
      res.send({ status: true, data: result });
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Yee! Task Tracker Server Running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
