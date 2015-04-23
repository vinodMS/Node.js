var translate = require('node-google-translate/lib/translate');
var assert = require('assert');

var key = 'AIzaSyCU63MqmmwgQW7826dplPN8a0hoJibcdJQ';

// Translate ones string
translate({key: key, q: 'my', target: 'fr'}, function(result){
	console.log(result); // prints {"my test": "mon test"}
});
