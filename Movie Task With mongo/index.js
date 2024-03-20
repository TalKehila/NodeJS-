const express = require('express');
const fs = require('fs').promises;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const movieRouter = require('./routes/movie') // to import all the set up 
const DBurl ="mongodb://127.0.0.1:27017/moviesDBTaskTwo"

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/movie',movieRouter) 

app.get('/' ,async (req,res) =>{
    const file = "./page/movie.html"
    let data =await fs.readFile(file,'utf-8')
    res.write(data);
    res.end();
} )


mongoose.connect(DBurl).then(() => {
    console.log("connected to DB")
    const server = app.listen(3000,() => {
        console.log("app in 3000 ") 
    })
}).catch(e => console.log(e))
