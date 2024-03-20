const express = require('express')
const fs = require('fs').promises;
const router = express.Router();

module.exports = router;
const Movie = require('../model/Movie');


// get method
router.get('/', async (req, res) => {
    let movies = await Movie.find()
    res.send(movies);
    res.end();
})


//post method 
router.post('/', async (req, res) => {
    const movie = new Movie({
        name: req.body.name,
        year: req.body.year,
        description: req.body.description,
        image: req.body.image,
        watched: (req.body.watched ==='true')
    })
    try {
        await movie.save();
        res.redirect('/')
        res.end();
    }
    catch (e) {
        res.status(400);
        res.send(e);
        res.end();
    }
})


//delete method 
router.delete('/:id', async (req, res) => {
    try {
        await Movie.deleteOne({
            _id: req.params.id
        })
        res.end();
    }
    catch (e) {
        console.log(e)
        res.end()
    }
})

module.exports=router;