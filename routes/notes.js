const express = require('express')
const router = express.Router()
const notes = require('../Models/Notes')
const fetchuser = require('../middlewares/fetchuser')
const {body, validationResult} = require('express-validator')

router.get('/fetchallnotes', fetchuser,async(req, res)=>{
    const allnotes = await notes.find({user: id})
    res.json(allnotes)
})

router.post('/addnote', fetchuser, 
[
    body('title', 'Enter a valid title').isLength({min:5}),
    body('description', 'Please enter a valid description').isLength({min:5})
],
async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try {
        const {title, description, tag} = req.body
        console.log(title, description, tag)
        const newNote = new notes({
        title : title, 
        description : description, 
        tag : tag, 
        user:id
    })  
    const saveNote = await newNote.save()
    res.send(saveNote)
    } catch (error) {
        console.log(error)
    }
})

router.put('/updatenote/:id', fetchuser, async (req,res)=>{
    const {title, description,tag} = req.body

    const newNote = {}
    if(title){newNote.title = title}
    if(description){newNote.description = description}
    if(tag){newNote.tag = tag}

    let note = await notes.findById(req.params.id)
    if(!note){return res.status(404).send('Not Found')}

    if(note.user.toString() != id){return res.status(401).send('Not Allowed')}

    note = await notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
    res.json({note})
})

router.delete('/deletenote/:id', fetchuser, async (req,res)=>{

    let note = await notes.findById(req.params.id)
    if(!note){return res.status(404).send('Not Found')}

    if(note.user.toString() != id){return res.status(401).send('Not Allowed')}

    note = await notes.findByIdAndDelete(req.params.id)
    res.json({"Sucess": "The note has been deleted succesfully", note:note})
})

module.exports = router