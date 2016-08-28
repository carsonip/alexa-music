import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';
import "isomorphic-fetch";
// var MusicXML = require("musicxml-interfaces/lib/index");
// require("whatwg-fetch");
var DOMParser = require('xmldom').DOMParser;




// fetch('/canon_in_D.xml')
//   .then(function(response) {
//     return response.text()
//   }).then(function(xml) {
//     let document = MusicXML.parseScore(score);
//     console.log('Converted XML to ', doc);
//   });

let app = express();
// var router = express.Router();

app.server = http.createServer(app);

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));



// connect to db
initializeDb( db => {

	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db }));
	// router.get('/convert', api.convert);

	app.server.listen(process.env.PORT || config.port);

	console.log(`Started on port ${app.server.address().port}`);
});

export default app;
