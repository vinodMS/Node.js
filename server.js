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
var LanguageDetect = require('languagedetect');
var lngDetector = new LanguageDetect();
var BCP47 = require('./app/BCP47');

/*=========================================================================================
==========================Methods currently supported by Concorde API===================*/

var translationMethodName = '/translation/';
// var commentMethodName  = '/comment/';
// var scoreMethodName    = '/score/';
// var callbackMethodName = '/callback/'

/*=======================================================================================*/

var d = new Date().getTime();


// Use machine translation
var translate = require('node-google-translate/lib/translate');
var assert = require('assert');
var key = 'AIzaSyCU63MqmmwgQW7826dplPN8a0hoJibcdJQ';

/*=========================================================================================
=========================================================================================*/

var allowedAttributes =
{
	translationRequest:
		{
			id: "id",
			callbackURL: "url",
			links: "links",
			sourceLanguage: "language",
			targetLanguage: "language",
			source: "string",
			target: "string",
			mt: ["true", "false"],
			crowd: ["true", "false"],
			professional: ["true", "false"],
			postedit: ["true", "false"],
			comment: "string",
			translator: "string",
			owner: "string",
			creationDatetime: "date",
			modificationDatetime: "date",
			updateCounter: "int",
			status: ["initial", "translated", "reviewed", "final", "rejected", "accepted", "pending", "timeout"]
		},
	comment:
		{
			id: "id",
			referenceId: "id",
			links: "links",
			callbackURL: "url",
			language: "language",
			text: "string",
			creationDatetime: "date",
			modificationDatetime: "date",
		},
	score:
		{
			id: "id",
			requestId: "id",
			links: "links",
			callbackURL: "url",
			score: "int",
			mt: ["true", "false"],
			crowd: ["true", "false"],
			professional: ["true", "false"],
			text: "string",
			creationDatetime: "date",
			modificationDatetime: "date",
		},
	callbackRequest:
		{
			id: "id",
			requestId: "id",
			links: "links",
			callbackURL: "url",
			score: "int",
			mt: ["true", "false"],
			crowd: ["true", "false"],
			professional: ["true", "false"],
			callbackText: "string",
			callbackStatus: "string",
			callBackcreationDatetime: "date"
		}
};

function checkAttribute(method, attribute, value)
{
	var reqallowed = allowedAttributes[method];
	value = value + ""; // make a string anyway for the value
	// console.log("checkAttribute:\n" + reqallowed);
	for (var allowedprop in reqallowed)
	{
		// console.log(allowedprop);
		if (!reqallowed.hasOwnProperty(allowedprop))
		{
			//The current property is not a direct property of p
			continue;
		}
		if (allowedprop == attribute)
		{
			// check value - very explicit here
			var allowedvalue= reqallowed[allowedprop];
			if (allowedvalue instanceof Array)
			{
				for (var i = 0; i < allowedvalue.length; i++)
				{
					if (allowedvalue[i] == value)
						return true;
				}
				return false;
			}
			else
				return true;
		}
	}
	return false;
}

function checkAttributes(method, request)
{
	if (request === undefined)
	{
		return [false, 400, "Undefined request method", 1000];
	}
	// console.log("checkAttributes:\n" + method + "\nRequest:" + request);
	for (var prop in request)
	{
		if (!request.hasOwnProperty(prop))
		{
			//The current property is not a direct property of p
			continue;
		}
		var value = request[prop];
		var attok = checkAttribute(method, prop, value);
		if (attok === false)
		{
			return [false, 400, "\"" + prop + "\" with value \"" + value + "\" not allowed for request \"" + method + "\"", 1010];
		}
	}
	return [true, 200, "", 0]; // correct request
}



/*=========================================================================================
=========================================================================================*/


//configure app to use bodyParser() to get the data from a POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

var port = process.env.PORT || 8122;

// generate an unique id for new requests
 function generateUUID()
{
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
		//console.log(uuid);
    return uuid;
}

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {

      console.log('Concorde translations server is currently running.');
      next();  //make sure we go to the next routes and don't stop here
});


//test route
router.get('/', function(req, res) {
    res.json({ message: 'Concorde API!' });
});



router.route(translationMethodName)

    // create a translations
    .post(function(req, res) {
      var da = new Date();
	    var d = da.toISOString();
      var translations = new Translations();		// create a new instance of the Translations model

      translations.id              = generateUUID();
      translations.sourceLanguage  = req.body.sourceLanguage;
      translations.targetLanguage  = req.body.targetLanguage;
      translations.source          = req.body.source;
      translations.professional    = req.body.professional;
      translations.mt              = req.body.mt;
      translations.updateCounter   = 0; // initializing updatecounter to 0
      translations.status          = req.body.status;
      translations.comment         = '';


      translations.save(function(err) {
        if (err)  {
          console.log(err);
          res.status(400).json({status: 'failure'});
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
router.route(translationMethodName + ':translations_id')

      // get the translations with the specified id
      .get(function(req, res) {
            Translations.findById(req.params.translations_id, function(err, translations) {
              if (!translations) {
                res.status(404).json({message: "Request ID not found"});
              } else
                if (translations){
                  res.status(200).json(translations);
              } else {
                res.status(500).json({message: "Server Failure"});
              }
            });
      })

      // update the translations with this id
      .put(function(req, res) {

        // use our translations model to find the translations we want
        Translations.findById(req.params.translations_id, function(err, translations) {
          if (!translations){
            res.status(404).json({status: "Request ID not found"});
          } else {
            translations.sourceLanguage  = req.body.sourceLanguage; // update source language codeZ
            translations.targetLanguage  = req.body.targetLanguage;
            translations.source          = req.body.source;
            translations.professional    = req.body.professional;
            translations.mt              = req.body.mt;
            translations.status          = req.body.status;
            translations.updateCounter += 1;


            translations.save(function(err) {
              if (err){
                res.status(500).json({status: "Server Failure"});
              } else{
                res.status(200).json({ message: 'Translations request was succesfully changed' });
              }
            });
          }

        });
      })

      // delete the translations with this id
      .delete(function(req, res) {
        Translations.remove({
          _id: req.params.translations_id
        }, function(err, translations) {
          if (!translations){
            res.status(404).json({status: "Request ID not found"});
          } else
            if(err){
              res.status(500).json({status: "Server Failure"});
            } else{
            res.status(204).json({ status: 'Successfully deleted' });
          }
        });
      });

// on routes that end in /status/:translations_id
// this methods will be used to return the status of a specific translations with ID
// ----------------------------------------------------
router.route(translationMethodName +'status/:translations_id')

// status of the translations with this id
.get(function(req, res) {

  // use our translations model to find the translations we want
  Translations.findById(req.params.translations_id, function(err, translations) {

    if (!translations){
      res.status(404).json({message: "Request ID not found"});
    } else
        if (err) {
          res.status(500).json({message: "Server Failure"});
        } else {
          res.status(200).json({status: translations.status});
        }
    });
});

// on routes that end in /accept/:translations_id
// this methods will be used to accept a specific translations with ID
// ----------------------------------------------------
router.route(translationMethodName + 'accept/:translations_id')

// accept the translations with this id
.put(function(req, res) {

  // use our translations model to find the translations we want
  Translations.findById(req.params.translations_id, function(err, translations) {

    if (translations){
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
router.route(translationMethodName + 'reject/:translations_id')

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
          res.status(500).json({message: "Server Failure"});
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
router.route(translationMethodName + 'confirm/:translations_id')

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
router.route(translationMethodName + 'cancel/:translations_id')

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


/* METHODS TO PERFORM SUB-TASKS ------------------------------------------------
================================================================================*/

function getMT(translations) {
  if(translations.mt === true){
    // Translate source text
    translations.status = 'accepted';
    translations.updateCounter += 1;
    translate({key: key, q: translations.source, target: translations.targetLanguage}, function(result){
      console.log(result);
    });
  }
}

function CRSNotify(){
  console.log('reported');
}


function langAudit(translations,req, res){
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  var links =

[
  {
    "rel": "translation",
    "href": fullUrl + translations.id,
    "type": "application/json",
    "title": "Newly created translation request " + translations.id + " + created on " + " " + translations.creationDatetime,
    "verb": "GET"
  },
  {
    "rel": "translation.cancel",
    "href": fullUrl +"cancel/" + translations.id,
    "type": "application/json",
    "verb": "PATCH"
  },
  {
    "rel": "translation.confirm",
    "href": fullUrl +"reject/" + translations.id,
    "type": "application/json",
    "verb": "PATCH"
  },
  {
    "rel": "translation.reject",
    "href": fullUrl + "confirm/" + translations.id,
    "type": "application/json",
    "verb": "PATCH"
  },
  {
    "rel": "translation.reject",
    "href": fullUrl + "accept/" + translations.id,
    "type": "application/json",
    "verb": "PATCH"
  },
  {
    "rel": "translation.patch",
    "href": fullUrl + translations.id,
    "type": "application/json",
    "verb": "PATCH"
  }
];

  	var newQuote =
  	{
  		id                  : translations.id,
  		sourceLanguage      : translations.sourceLanguage,
  		targetLanguage      : translations.targetLanguage,
  		source              : translations.source,
  		target              : translations.target,
  		mt                  : translations.mt,
  		crowd               : translations.crowd,
  		professional        :	translations.professional,
  		postedit            :	translations.postedit,
  		comment             :	translations.comment,
  		translator          :	translations.translator,
  		owner               :	translations.owner,
  		status              :	translations.status,
  		creationDatetime    : translations.creationDatetime,
  		modificationDatetime: translations.modificationDatetime,
  		updateCounter       : 0,
  		links               : links
  	};

    var newTranslationRequest =
    {
  	   translationRequest: newQuote
    };

  var langDetected; // Receives the language detection results
  var sourceTLang;  // The LI results will be [ [ 'dutch', 0.2871568627450981 ]], get the object key, example dutch.
  var sourceLang;   // Source language sent as BCP47, match with language
  var langchecked; // set true/false for detected = source

  langDetected = lngDetector.detect(translations.source); //detect language
	console.log(translations.source);
  sourceTLang = langDetected[0][0]; // get the first language from the result
  sourceLang = BCP47.getLang(translations.sourceLanguage); // convert BCP47 to lang name

  if (sourceTLang == sourceLang)  {
    langchecked = true;
    res.status(201).json(newTranslationRequest);
		getMT(translations);
  }else
      if(sourceTLang != sourceLang) {
        langchecked = false;
        res.status(409).json({message: "Translations request was rejected: Source laguage and text do not match"});
        translations.status = 'rejected';
        translations.comment= 'Translations request was rejected: Source laguage and text do not match' + translations.id;
        return translations.status,translations.comment;
      }
      else {
        CRSNotify(translations.id);
      }
    }

//console.log(lngDetector.detect('vinod is het liefste vriendje',1));

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /v2.0
app.use('/v2.0', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Listening to port number: ' + port);
