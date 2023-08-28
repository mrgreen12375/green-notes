const note = require('express').Router();
const fs = require('fs');
const util = require('util');
const readFromFile = util.promisify(fs.readFile);
const uuid = require('uuid');

//setup route to get all the notes
note.get('/notes', (req, res)=>{
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
note.post('/notes', (req, res) => {
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
note.delete("/notes/:id", function(req, res) {
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

  module.exports = note;