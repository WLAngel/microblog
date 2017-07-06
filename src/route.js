var MongoClient = require('mongodb').MongoClient
var assert = require('assert');

module.exports = {
  create: create,
  getArticle: getArticle,
  edit: edit,
  remove: remove,
}

var url = 'mongodb://mongod:27017/microblog';

function create(title, author, body) {
  var id
  return getArticle().then(item => item.length).then(x => {
    id = x
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection('blogs')
      collection.insertOne({
        _id: x,
        title: title || 'untitled',
        author: author,
        body: body,
        time: (new Date()).toString(),
        delete: false
      }, function(err, r) {
        assert.equal(null, err)
        db.close()
      })
    })
    return id
  })

}

function getArticle(query) {
  var posts = []
  return MongoClient.connect(url).then(function(db) {
      var collection = db.collection('blogs')
      if(query === undefined) {
        return collection.find().toArray()
      }
      else {
        return collection.find(query).toArray()
      }
    }).then(function(items) {
      posts = items
      return items
    })
}

function edit(query, body) {
  MongoClient.connect(url).then(function(db) {
    var collection = db.collection('blogs')
    collection.updateOne(query, { $set: { body: body } })
  })
}

function remove(query) {
  MongoClient.connect(url).then(function(db) {
    var collection = db.collection('blogs')
    collection.updateOne(query, { delete: true })
  })
}
