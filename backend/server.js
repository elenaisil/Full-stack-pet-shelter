const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

// test route just to make sure the server works
app.get('/', (req, res) => {
    res.send('Welcome to the Pet API!');
});


// test
const petRoute = require('./route/PetRoute')
app.use('/api/pets',petRoute)

const shelterRoute = require('./route/ShelterRoute')
app.use('/api/shelters', shelterRoute)

const adopterRoute =require('./route/AdopterRoute')
app.use('/api/adopter', adopterRoute)

const adoptionRoute =require('./route/AdoptionRoute')
app.use('/api/adoption', adoptionRoute)

//swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
