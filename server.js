//setup required packages
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const readFromFile = util.promisify(fs.readFile);
const uuid = require('uuid');

//setup port
const PORT = process.env.PORT || 3001;

//setup connection to express
//setup parsing json and urlencoded form data
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//setup static files from tthe public folder
app.use(express.static('public'));

//setup route to the notes.html
app.get('/notes', (req, res) =>{
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//setup route to get all the notes
app.get('/api/notes', (req, res)=>{
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

//setup function to write data to json and give a destination
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
//setup function to read data from file and appent some content
const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content)
        writeToFile(file, parsedData);
      }
    });
};

//setup post request to let client know their post request was received
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note ${req.body}`);
    
    const { title, text } = req.body;
    
    if (req.body) {
      const newNote = {
        title,
        text,
        id: uuid.v4(),
      };
      readAndAppend(newNote, './db/db.json');
      res.json(newNote);
    } else {
      res.error('Error in adding note');
    }
});

//setup function to delete notes
app.delete("/api/notes/:id", function(req, res) {
    console.log("params", req.params.id)
    fs.readFile('./db/db.json', 'utf-8',(err,data)=>{
      if(err){
        console.error(err)
      }else{
        let parsedData = JSON.parse(data)
        parsedData = parsedData.filter(({ id }) => id !== req.params.id);
        fs.writeFile('./db/db.json', JSON.stringify(parsedData, null, 4), (err) =>
        err ? console.error(err) : res.json('writeFile'))
      }
    })
  });

//setup wildcard route to the index.html
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//setup to listen on port 3001
app.listen(PORT, () =>
    console.log(`APP listening at http://localhost:${PORT}`)
);