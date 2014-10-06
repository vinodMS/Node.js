// app/models/translation.js

var mongoose          = require('mongoose');
var Schema            = mongoose.Schema;

var TranslationSchema   = new Schema({
	      id:                 String,
        sourceLanguage:     String,
        targetLanguage:     String,
        source:             String,
        professional:       Boolean,
        mt:                 Boolean,
        creationDateTime:   Date,
        updateCounter:      Number,
        status:             String
});

module.exports = mongoose.model('Translations', TranslationSchema);
