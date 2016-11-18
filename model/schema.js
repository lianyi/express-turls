var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    md5 = require('md5');

// Connect to database
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGODB_URI);
mongoose.connection.on('error', function (err) {
        console.error('MongoDB connection error: ' + err);
        process.exit(-1);
    }
);

// URL Schema
var URLSchema = new Schema({id: String, url: String});

// Increment the id of the URL for each new URL before save it
URLSchema.pre('save', function (next) {
    var doc = this;
    if (doc.url) {
        doc.id = md5(doc.url);
    }
    next();
});

module.exports = mongoose.model('URLSchema', URLSchema);