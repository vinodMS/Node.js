// BASE SETUP
// =============================================================================

var mongoose    = require('mongoose');

mongoose.connect('mongodb://vinod:vinod123@ds063769.mongolab.com:63769/concorde_api');

var Translations        = require('./app/models/translations');
// calling dependencies
var express     = require('express');
var app         = express();
module.exports = app;
var bodyParser  = require('body-parser');


//configure app to use bodyParser() to get the data from a POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8122;

// generate an unique id for new requests
/* function generateUUID()
{
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
};*/

// routes for API
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
      //do logging
      console.log('Concorde translations server is currently running.');
      next();  //make sure we go to the next routes and don't stop here
});

//test route
router.get('/', function(req, res) {
		res.json({ message: 'Concorde API!' });
});



router.route('/translation')

  	// create a translations
    .post(function(req, res) {

    	var translations = new Translations();		// create a new instance of the Translations model
    	//translations.name = req.body.name;  // set the translations name (comes from the request)
      //translations.id              = generateUUID();
      translations.sourceLanguage  = req.body.sourceLanguage;
      translations.targetLanguage  = req.body.targetLanguage;
      translations.source          = req.body.source;
      translations.professional    = req.body.professional;
      translations.mt              = req.body.mt;
      translations.updateCounter   = 0; // initializing updatecounter to 0
      translations.status          = req.body.status;
      //translations.translationRequests  = req.body.translationRequests;
      //translations.markModified('translationRequests');
      console.log(req.body.translationRequests);
      res.statusCode = 201;

    	translations.save(function(err) {
    		if (err)
    			res.send(err);

    		res.json({ message: 'Translations request succesfully created!' });
    	});


    })

    //get all the translations
    .get(function(req, res) {
        Translations.find(function(err, translation)  {
            if (err) {
              console.log(err);
              res.status(404).json({status: "Bad Request"});
            } else {
              res.status(200).json(translation);
            }
        });
    });

// on routes that end in /translation/:translations_id
// this methods will be used to get a specific translations with ID
// ----------------------------------------------------
router.route('/translation/:translations_id')

    	// get the translations with that id
    	.get(function(req, res) {
        		Translations.findById(req.params.translations_id, function(err, translations) {
        			if (err)
        				res.send(err);
              //res.json({ message: 'Request id found' });
        			res.json(translations);
              res.statusCode = 200; //returning ok code
        		});
    	})

    	// update the translations with this id
    	.put(function(req, res) {

    		// use our translations model to find the translations we want
    		Translations.findById(req.params.translations_id, function(err, translations) {

    			if (err)
    				res.send(err);

    			translations.sourceLanguage  = req.body.sourceLanguage; 	// update  source language code
          translations.targetLanguage  = req.body.targetLanguage;
          translations.source          = req.body.source;
          translations.professional    = req.body.professional;
          translations.mt              = req.body.mt;
          translations.status = req.body.status;
          translations.updateCounter += 1;
    			// save the translations
    			translations.save(function(err) {
    				if (err)
    					res.send(err);


            res.statusCode = 200; //returning ok code
    				res.json({ message: 'Translations request was succesfully changed' });
    			});

    		});
    	})

    	// delete the translations with this id
    	.delete(function(req, res) {
    		Translations.remove({
    			_id: req.params.translations_id
    		}, function(err, translations) {
    			if (err)
    				res.send(err);

    			res.json({ message: 'Successfully deleted' });
          res.statusCode = 204;
    		});
    	});


app.use('/v2.0', router);

app.listen(port);
module.export = app;
console.log('Listening to port number: ' + port);
