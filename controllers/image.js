const clarifai = require('clarifai');

// Instantiate a new Clarifai app by passing in your API key.
const app = new Clarifai.App({ apiKey: '7922370daa88442f9fc680ce97915902' });

const handleAPICall = (req, res) => {
   app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
      .then(data => res.json(data))
      .catch(err => res.status(400).json('API error'))
}

const handleImage = (db) => (req, res) => {
   const {id, facesFound} = req.body;

   db('users').where('id', '=', id)
      .increment('facecount', facesFound)
      .returning('facecount')
      .then(count => {
         res.json(count[0]);
      })
         .catch(err => res.status(400).json('Unable to get the facecount'))
   }

module.exports = {handleImage, handleAPICall}