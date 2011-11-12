
/**
 * Module dependencies.
 */

var express = require('express');
var cradle  = require('cradle');
var db      = new (cradle.Connection)().database('shr');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
    res.render('create', { title: 'create new share' });
});

app.get('/create', function(req, res) {
    res.render('create', { title: 'create new share' });
});

app.post('/create', function(req, res) {
    hash = require('crypto').createHash('sha1').update("" + (new Date())).digest();
    id   = new Buffer(hash).toString('base64').substr(0, 10);
    db.save(id, req.body, function(err, doc) {
        if(!err) { 
            res.redirect('/s/' + id);
        }
        if(err) console.log(err);
        res.end();
    });
});
app.get('/tmpl/:name', function(req, res) {
    res.render('tmpl/' + req.params.name, { layout: false });
});

app.get('/tmpl/:sub/:name', function(req, res) {
    res.render('tmpl/' + req.params.name + '/' + req.params.sub, { layout: false });
});

app.get('/s/:id', function(req, res) {
    db.get(req.params.id, function(err, doc) {
        if(!err) {
            res.render('show', {
                title: 'bla', 
                docs: doc
            });       
        }
    });

});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
