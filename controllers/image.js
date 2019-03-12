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

module.exports = {handleImage}