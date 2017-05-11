//strict mode prevents undeclared variables
//allows for better handling becuase it catches bad syntax as well
'use strict';

//'require' used to import third party libraries

// this variable imports express
const express = require('express');

//new express router instance
const router = express.Router();

//middleware additions
const bodyParser = require('body-parser');

//
const jsonParser = bodyParser.json();

//imports blogSchema model from different module
//interface that captures current state of the application's current Blog Posts
const {Blog} = require('./model');



// GET requests to /posts
router.get('/posts', (req, res) => {

  Blog
  .find()
  .exec()
  .then(posts => {
    res.json({
      posts:posts.map(
        (post) => post.apiRepr())});
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Internal server error'});
  });
});

// can also request by ID
router.get('/posts/:id', (req, res) => {
  Blog
    // this is a convenience method Mongoose provides for searching
    // by the object _id property
    .findById(req.params.id)
   .exec()
   .then(post => res.json(post.apiRepr()))
   .catch(err => {
     console.error(err);
     res.status(500).json({error: 'Internal server error'});
   });
});

// POST reqeust - create new blog entry
router.post('/posts', (req, res) => {

  const requiredFields = ['title', 'content', 'author'];
 for (let i=0; i<requiredFields.length; i++) {
   const field = requiredFields[i];
   if (!(field in req.body)) {
     const message = `Missing \`${field}\` in request body`
     console.error(message);
     return res.status(400).send(message);
   }
 }

  Blog
  .create({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  })
  .then(blogPost => res.status(201).json(blogPost.apiRepr()))
  .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Internal server error'});
  });

});

// PUT request - Edit blog entry
router.put('/posts/:id', (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
   res.status(400).json({
     error: 'path id and request body id has to be the same'
   });
 }

  // we only support a subset of fields being updateable.
  // if the user sent over any of the updatableFields, we udpate those values
  // in document
  const updated = {};
 const updateableFields = ['title', 'content', 'author'];
 updateableFields.forEach(field => {
   if (field in req.body) {
     updated[field] = req.body[field];
   }
 });

  Blog
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
  .exec()
  .then(updatedPost => res.status(201).json(updatedPost.apiRepr()))
  .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//DELETE Request - delete blogs
router.delete('/posts/:id', (req, res) => {
  Blog
  .findByIdAndRemove(req.params.id)
 .exec()
 .then(() => {
   console.log(`Deleted blog post with id \`${req.params.ID}\``);
   res.status(204).end();
 });
});

// catch-all endpoint if client makes request to non-existent endpoint
router.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

//exports router instantce so that it can be imported in main file server.js
module.exports = router;
