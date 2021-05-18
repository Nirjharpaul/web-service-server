const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.phbqz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('clients'));
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db("webService").collection("services");
    const testimonialsCollection = client.db("webService").collection("testimonials");


});

app.post('/addReview', (req, res) => {
    const file = req.files.file;

    const name = req.body.name;
    const email = req.body.email;
    console.log(name, email, file);
    file.mv(`${__dirname}/clients/${file.name}`, err => {
        if (err) {
            console.log(err);
            return res.status(500).send({ msg: 'failed to upload Image' });
        }

        return res.send({ name: file.name, path: `/${file.name}` })
    })
    // const designation = req.body.designation;
    // const description = req.body.description;
    // const newImg = file.data;
    // const encImg = newImg.toString('base64');

})

//     var image = {
//         contentType: file.mimetype,
//         size: file.size,
//         img: Buffer.from(encImg, 'base64')
//     };

//     testimonialsCollection.insertOne({ name, designation, description, image })
//         .then(result => {
//             res.send(result.insertedCount > 0);
//         })
// })

app.listen(process.env.PORT || port)