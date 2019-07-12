import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { config } from './config/config';

import Jimp = require('jimp');

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  const cfg = config;
  
  // Image filtering Endpoint
  // Returns a filtered image to the user
  app.get( "/filteredimage", async ( req, res ) => {
    let { image_url } = req.query;

    let apiKey = req.header("X-API-Key");

    if(!apiKey || apiKey != cfg.api_key ){
      return res.status(401).send({ auth: false, message: 'Invalid api key.' });
    }

    if (!image_url) {
      return res.status(422).send({ auth: true, message: 'image_url is required.' });
    }

    let filteredPath = await filterImageFromURL(image_url);
    res.status(200).sendFile(filteredPath, () => { deleteLocalFiles([filteredPath]); });
  } );


  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();