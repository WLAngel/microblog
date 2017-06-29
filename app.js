var express = require('express')
var cookieParser = require('cookie-parser')
var path = require('path')
var route = require('./src/route.js')
var bodyparser = require('body-parser')

var app = express()


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(cookieParser())
app.use(function(req, res, next) {
  if(req.cookies.name === undefined) {
    res.cookie('name', 'Guest')
  }
  next()
})
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

app.get('/list', function (req, res) {
  var articles = []
  var name = req.cookies.name
  route.getArticle({ delete: false }).then(item => {
    for(var x = 0; x < item.length; x++) {
      articles.push({
        id: item[x]._id,
        title: item[x].title,
        author: item[x].author,
        time: item[x].time
      })
    }
    res.render('index', {
      articles: articles,
      name: req.cookies.name
    })
  })
})

app.get('/:id', function(req, res) {
  var id = req.params.id
  route.getArticle({ _id: Number(id) }).then(item => {
    res.render('article', item[0])
  })
})

app.post('/create', function(req, res) {
  route.create(req.body.title, req.cookies.name, req.body.body)
  .then(x => {
    res.redirect(302, '/' + x)
  })
})

app.post('/:id/edit', function(req, res) {
  var id = req.params.id
  route.edit({ _id: Number(id) }, req.body.body)
  res.redirect(302, '/' + id)
})

app.post('/:id/delete', function(req, res) {
  var id = req.params.id
  route.remove({ _id: Number(id) })
  res.redirect(302, '/list')
})



app.post('/enter', function(req, res) {
  res.cookie('name', req.body.name)
  res.redirect(302, '/list')
})

app.get('/', function (req, res) {
  res.render('home')
})


app.listen(8888)
