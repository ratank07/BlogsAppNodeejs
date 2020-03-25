const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/articlemodel')
const articleRouter = require('./routes/article')
const methodOverride = require('method-override')
const app = express()

mongoose.connect('mongodb://localhost/blog', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  console.log('article',articles);
  
  res.render('index', { articles: articles })
})

app.use('/article', articleRouter)

app.listen(5000, ()=> {
    console.log('connected to port  5000');
})