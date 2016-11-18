var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var urlSchema = require('./model/schema');
var index = require('./routes/index');
var newurls = require('./routes/newurls');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// logger setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/new', newurls);
app.get('/:id', function (req, res) {
    var id = req.params.id;
    if (id.length < 32) {
        res.status(404).send("Invalid Short URL");
    } else {
        urlSchema.findOne({id: id}, function (err, doc) {
            if (err) {
                res.status(404).json(err);
            } else if (doc) {
                res.redirect(doc.url);
            } else {
                res.status(404).json("Invalid Short URL");
            }
        });
    }
});

module.exports = app;
