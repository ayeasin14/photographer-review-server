const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hnppbvd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const serviceCollection = client.db('shootGrapy').collection('services');

        app.get('/servicesSummery', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })



        app.post('/services/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            const reviews = service.reviews;
            console.log(reviews.length);

            console.log('POST API called');
            const newReviews = req.body;
            newReviews.id = reviews.length + 1;
            reviews.push(newReviews);
            console.log(newReviews);
            res.send(newReviews);

        })


        app.post('/addservice', async (req, res) => {

            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();

            console.log(req.body);
            const service = req.body;
            service.service_id = services.length + 1;
            services.push(service);
            console.log(service);
            res.send(service);


        })

    }
    finally {

    }
}

run().catch(err => console.error(err));




app.get('/', (req, res) => {
    res.send('Photographer-review server is running')
})


app.listen(port, () => {
    console.log(`Photographer review server running on ${port}`);
})