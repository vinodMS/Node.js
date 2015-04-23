// app/models/translation.js

var mongoose          = require('mongoose');
var Schema            = mongoose.Schema;

var TranslationSchema   = new Schema({
	      id:                 	String,
				_id: 									false, // disables the object id in mongodb
				callbackURL: 					String,
        sourceLanguage:     	String,
				links: 								Object,
        targetLanguage:     	String,
        source:             	String,
				target: 							String,
				mt:                 	Boolean,
				crowd: 								Boolean,
        professional:       	Boolean,
				postedit:							Boolean,
				comment:							String,
				translator:         	String,
				owner:              	String,
        creationDateTime:   	Date,
				modificationDatetime: Date,
        updateCounter:     		Number,
        status:             	String
});

module.exports = mongoose.model('Translations', TranslationSchema);
