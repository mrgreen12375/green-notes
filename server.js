//setup required packages
const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const homeRoutes = require('./routes/homeRoutes');

//setup port
const PORT = process.env.PORT || 3001;

//setup connection to express
//setup parsing json and urlencoded form data
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//setup static files from tthe public folder
app.use(express.static('public'));

app.use('/api', apiRoutes);
app.use('/', homeRoutes);

//setup to listen on port 3001
app.listen(PORT, () =>
    console.log(`APP listening at http://localhost:${PORT}`)
);