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

  const cfg = config.dev;

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  app.get( "/filteredimage", async ( req, res ) => {
    let { image_url } = req.query;

    let apiKey = req.header("X-API-Key");

    if(!apiKey || apiKey != cfg.api_key ){
      return res.status(401).send({ auth: false, message: 'Invalid api key.' });
    }

    if (!image_url) {
      return res.status(400).send({ auth: true, message: 'image_url is required.' });
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