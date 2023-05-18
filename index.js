const express = require('express')
const app = express();
const cors = require ('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("TenJoy Server is running successfully")
})

app.listen(port, () => {
    console.log(`TenJoy Server is listening to the port, ${port}`);
})