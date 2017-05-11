const mongoose = require('mongoose');

// this is our schema to represent a restaurant
const blogSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String},
  author: {
            firstName: String,
            lastName: String
          },
  created: {type: Date, default: Date.now}
});


// *virtuals* (http://mongoosejs.com/docs/guide.html#virtuals)
// allow us to define properties on our object that manipulate
// properties that are stored in the database. Here we use it
// to generate a human readable string based on the address object
// we're storing in Mongo.
// article metadata
blogSchema.virtual('articleMetadata').get(function() {
 return `${this.author.firstName} ${this.author.lastName} - ${this.created}`.trim()
});



// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
// collection of the type and their fields.. kinda like a class
blogSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    author: this.authorName,
    content: this.content,
    title: this.title,
    created: this.created
  };
}

//data model
// this is how you interact with the db
// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
//NOTE: Make sure collection name matches the data model
const post = mongoose.model('post', blogSchema);

/*
//New blog additions based on schema
const blog1 = new post(  {
  title: "blog1 title",
  content: "blog1 content",
  author: {
            firstName: "Charlotte",
            lastName: "Frates"
          }
});




const blog2 = new post(  {
  title: "blog2 title",
  content: "blog2 content",
  author: {
            firstName: "Charlotte",
            lastName: "Frates"
          }
});

*/

module.exports = {post};
