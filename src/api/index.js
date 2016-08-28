import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
var DOMParser = require('xmldom').DOMParser;
const fs = require('fs');


export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({
			mp3: 'https://s3.amazonaws.com/alexa-music/score.mp3'
		});
	});

	api.get('/convert', (req, res) => {
		fs.readFile( __dirname + '/lg-118157446.xml', 'utf-8', function (err, data) {
		  if (err) {
		    throw err;
		  }
		  var beats,
		      measure,
		      tempo,
		      doc;
		  doc = new DOMParser().parseFromString(data, 'application/xml');
		  beats = doc.getElementsByTagName('beats')[0]['firstChild']['data'];
		  measure = doc.getElementsByTagName('measure')['$$length'];
		  tempo = doc.getElementsByTagName('sound')[0];
			tempo = tempo.getAttributeNode("tempo")['nodeValue'];
			res.json({
				beats: beats,
				measureNumber: measure,
				tempo: tempo
			})
		});
	});

	return api;
}



// exports convert = function(req, res) {
// 	res.send("respond with a resource");
// };
