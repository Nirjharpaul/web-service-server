const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.phbqz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("clients"));
app.use(fileUpload());

const port = 5000;

app.get("/", (req, res) => {
  res.send("hello from db it's working working");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const serviceCollection = client.db("webService").collection("services");
  const testimonialsCollection = client
    .db("webService")
    .collection("testimonials");

  // post function for service 
  app.post("/addService", (req, res) => {
    serviceCollection.insertOne({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
    })
      .then((result) => {
        res.send(result);
      });
  });
  // get function for service

  app.get("/getService", (req, res) => {
    serviceCollection.find({}).toArray((err, data) => {
      res.send(data);
    });
  });

  // post function for Review
  app.post("/addReview", (req, res) => {
    testimonialsCollection.insertOne({
      name: req.body.name,
      designation: req.body.designation,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
    })
      .then((result) => {
        res.send(result);
      });
  });
  // get function for review

  app.get("/getReview", (req, res) => {
    testimonialsCollection.find({}).toArray((err, data) => {
      res.send(data);
    });
  });

  app.get("/getOrder/:id", (req, res) => {
    serviceCollection.find({ _id: ObjectId(req.params.id) }).toArray((err, data) => {
      res.send(data[0]);
    });
  });

  // getValue();
  // delete function
  app.delete("/deleteService/:id", (req, res) => {
    serviceCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then(() => {
        getValue();
      });
  });
  // admin order list function
  app.post("/addOrder", (req, res) => {
    //   const {}
  })
});

app.listen(process.env.PORT || port)
// app.listen(port, () => console.log(`Sever is running on port ${port}`));
