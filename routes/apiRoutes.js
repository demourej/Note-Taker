// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
const path = require('path');
const fs = require("fs")
const { v4: uuidv4 } = require("uuid")

// ROUTING

module.exports = (app) => {
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "../public/notes.html"))
)

// // Displays all characters
app.get("/api/notes", (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, "../db/db.json"), "utf8")
    res.send(data)
  } catch (err) {
    console.error(err)
  }
})

// // Create New Note - takes in JSON input
app.post("/api/notes", (req, res) => {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  const newNote = req.body
  newNote.id=uuidv4()

  try {
    let rawdata = fs.readFileSync(path.join(__dirname, "../db/db.json"), "utf8")
    let noteArray = JSON.parse(rawdata)
    let uuid=uuidv4()
    noteArray.push(newNote)

    const fileDb = path.join(__dirname, "../db/db.json")
    fs.writeFileSync(fileDb, JSON.stringify(noteArray))
    res.json(newNote)
  } catch (err) {
    console.error(err)
  }

})

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  let rawdata = fs.readFileSync(path.join(__dirname, "../db/db.json"), "utf8")
  let noteArray = JSON.parse(rawdata)
  if (noteArray.length>0){
    const found =noteArray.some(note=>note.id===id)
    if (found){
      newNoteArray=noteArray.filter(note=>note.id!==id)
      const fileDb = path.join(__dirname, "../db/db.json")
      fs.writeFileSync(fileDb, JSON.stringify(newNoteArray))
      console.log(`Delete it`)
      res.json(newNoteArray)
    }
    else
    {
      console.log(`Not Found`)
      res.json(`Not Found`)
    }
  }
  else
  {
    console.log(`Data Base Empty`)
    res.json(`Data Base Empty`)
  }

});
};
