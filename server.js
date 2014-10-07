// BASE SETUP
// =============================================================================

var mongoose    = require('mongoose');

mongoose.connect('mongodb://vinod:vinod123@ds063769.mongolab.com:63769/concorde_api');

var Translations        = require('./app/models/translations');
// calling dependencies
var express     = require('express');
var app         = express();
module.exports  = app;
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var translationMethodName = '/v2.0/translation/';
var d = new Date().getTime();
//app.use(express.logger('dev'));



//configure app to use bodyParser() to get the data from a POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

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
      //console.log('Concorde translations server is currently running.');
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

      translations.id              = req.body.id;
      translations.sourceLanguage  = req.body.sourceLanguage;
      translations.targetLanguage  = req.body.targetLanguage;
      translations.source          = req.body.source;
      translations.professional    = req.body.professional;
      translations.mt              = req.body.mt;
      translations.updateCounter   = 0; // initializing updatecounter to 0
      translations.status          = req.body.status;
      //translations.translationRequests  = req.body.translationRequests;
      //translations.markModified('translationRequests');
      //console.log(req.body.translationRequests);
      //res.statusCode = 201;
      var url = "http://" + req.headers.host;
      var links =

    [
      {
        "rel": "translation",
        "href": url + translationMethodName + translations.id,
        "type": "application/json",
        "title": "Newly created translation request " + translations.id + " + created on " + " " + d,
        "verb": "GET"
      },
      {
        "rel": "translation.cancel",
        "href": url + translationMethodName +"cancel/" + translations.id,
        "type": "application/json",
        "verb": "PATCH"
      },
      {
        "rel": "translation.confirm",
        "href": url + translationMethodName +"reject/" + translations.id,
        "type": "application/json",
        "verb": "PATCH"
      },
      {
        "rel": "translation.reject",
        "href": url + translationMethodName + "confirm/" + translations.id,
        "type": "application/json",
        "verb": "PATCH"
      },
      {
        "rel": "translation.reject",
        "href": url + translationMethodName + "accept/" + translations.id,
        "type": "application/json",
        "verb": "PATCH"
      },
      {
        "rel": "translation.patch",
        "href": url + translationMethodName + translations.id,
        "type": "application/json",
        "verb": "PATCH"
      }
    ];
      translations.save(function(err) {
        if (err)  {
          concole.log(err);
          res.status(400).json({status: 'failure'});
        } else {
          res.status(201).json({ links: links });
        }
      });


    })

    //get all the translations
    .get(function(req, res) {
        Translations.find(function(err, translation)  {
            if (err) {
              //console.log(err);
              res.status(400).json({status: "Bad Request"});
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
              if (err) {
                res.status(404).json({status: "Request ID not found"});
              } else
                if (req.params.translations_id === undefined){
                res.status(404).json({status: "Request ID not found"});
              } else {
                res.status(200).json(translations);
              }
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


// on routes that end in /accept/:translations_id
// this methods will be used to accept a specific translations with ID
// ----------------------------------------------------
router.route('/accept/:translations_id')

// accept the translations with this id
.put(function(req, res) {

  // use our translations model to find the translations we want
  Translations.findById(req.params.translations_id, function(err, translations) {

    if (!err){
      translations.status = 'accepted';
      translations.updateCounter += 1;
      // save the translations
      translations.save(function(err) {
        if (err) {
          res.status(500).json({status: "Server Failure"});
        } else {
          res.status(200).json({message: "Translations request was succesfully changed"});
        }
      });
    } else {
      res.status(404).json({message: "Request ID not found"});
    }

  });
});


// on routes that end in /reject/:translations_id
// this methods will be used to rejects a specific translations with ID
// ----------------------------------------------------
router.route('/reject/:translations_id')

// reject the translations with this id
.put(function(req, res) {

  // use our translations model to find the translations we want
  Translations.findById(req.params.translations_id, function(err, translations) {

    if (!err){
      translations.status = 'rejected';
      translations.updateCounter += 1;
      // save the translations
      translations.save(function(err) {
        if (err) {
          res.status(500).json({status: "Server Failure"});
        } else {
          res.status(200).json({message: "Translations request was succesfully rejected"});
        }
      });
    } else {
      res.status(404).json({message: "Request ID not found"});
    }

  });
});

// on routes that end in /confirm/:translations_id
// this methods will be used to confirm a specific translations with ID
// ----------------------------------------------------
router.route('/confirm/:translations_id')

// confirm the translations with this id
.put(function(req, res) {

  // use our translations model to find the translations we want
  Translations.findById(req.params.translations_id, function(err, translations) {

    if (!err){
      translations.status = 'confirmed';
      translations.updateCounter += 1;
      // save the translations
      translations.save(function(err) {
        if (err) {
          res.status(500).json({status: "Server Failure"});
        } else {
          res.status(200).json({message: "Translations request was succesfully changed"});
        }
      });
    } else {
      res.status(404).json({message: "Request ID not found"});
    }

  });
});

// on routes that end in /cancel/:translations_id
// this methods will be used to cancel a specific translations with ID
// ----------------------------------------------------
router.route('/cancel/:translations_id')

// cancel the translations with this id
.put(function(req, res) {

  // use our translations model to find the translations we want
  Translations.findById(req.params.translations_id, function(err, translations) {

    if (!err){
      translations.status = 'cancelled';
      translations.updateCounter += 1;
      // save the translations
      translations.save(function(err) {
        if (err) {
          res.status(500).json({status: "Server Failure"});
        } else {
          res.status(200).json({message: "Translations request was succesfully changed"});
        }
      });
    } else {
      res.status(404).json({message: "Request ID not found"});
    }

  });
});

app.use('/v2.0', router);


app.listen(port);
//module.export = app;
//console.log('Listening to port number: ' + port);
