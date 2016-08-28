import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import chop from '../process/chop.js'

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

	api.get('/process', (req, res) => {
		
		chop('canon.mp3', 64.9998, 4, 41);
		
		res.json({
			
		});

	});

	return api;
}
