const express = require('express')
const app = express()
const hbs = require('hbs')
const path = require('path')
const { profileAnalyze, topicArray } = require('./utils/gfg')

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates')
const parttialsPath = path.join(__dirname, '../templates/partials')

const port = process.env.PORT || 3000

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(parttialsPath)

//Directory for serving public files
app.use(express.static(publicDirectoryPath));

//Home Page
app.get('', (req, res) => {
    res.render('index')
})

//About Page
app.get('/about', (req, res) => {
    res.render('about')
})

//Setting API call to receive data on basis of user profile
app.get('/profile', (req, res)=>{
    profileAnalyze(req.query.user, (error, {ans, problemLink, problemName}={})=>{
        if(error || ans==undefined){
            res.send({error})
        }
        else{
            res.send({undefined, ans, problemLink, problemName})
        }
    })
})

//Setting API call to receive topics array on basis of ques url
app.get('/topic', (req, res)=>{
    if(!req.query.link){
        return res.send({
            error: "You must provide url of question!!"
        })
    }
    topicArray( req.query.link , (err, data)=>{
        if(err){
            return res.send(err)
        }
        res.send(data)
    })
})

//404 Page -- redirect to index
app.get('*', (req, res) => {
    res.redirect('/')
})

//Listening on any port
app.listen(port, () => {
    console.log('App is running on sever port: 3000')
})