const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const usersRoute = require('../routes/users.routes');
const crudsRoute = require('../routes/cruds.routes');
const searchRoute = require('../routes/search.routes');
app.use('/', usersRoute);
app.use('/', crudsRoute);
app.use('/', searchRoute);


app.get('/test', (req,res) => {
    return res.send("API working");
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}, http://localhost:${PORT}`));