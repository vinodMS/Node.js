// app/models/translation.js

var mongoose          = require('mongoose');
var Schema            = mongoose.Schema;

var TranslationSchema = new Schema({
/*    translationRequests:  {
        id:                 String,
        sourceLanguage:     String,
        targetLanguage:     String,
        source:             String,
        professional:       Boolean,
        mt:                 Boolean,
        creationDateTime:   Date,
        updateCounter:      Number,
        status:             String
    }*/
    translationRequests: Object
},
{ _id: false });

module.exports        = mongoose.model('Translations', TranslationSchema);
