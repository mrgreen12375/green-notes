const home = require('express').Router();
const path = require('path');

//setup route to the notes.html
home.get('/notes', (req, res) =>{
    res.sendFile(path.join(__dirname, '../public/notes.html'));
  });
  
//setup wildcard route to the index.html
home.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../public/index.html'))
);

module.exports = home