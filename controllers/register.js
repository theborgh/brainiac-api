const handleRegister = (db, bcrypt) => (req, res) => {
   const {email, name, password} = req.body;
   const hash = bcrypt.hashSync(password);

   db.transaction(trx => {
      trx.insert({
         hash: hash,
         email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
         return trx('users')
         .returning('*')
         .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
         })
         .then(user => {
            console.log('user[0]: ', user[0]);
            res.json(user[0]);
         })
      })
      .then(trx.commit)
      .catch(trx.rollback)
   })
   .catch(err => {
      console.log('error');
      res.status(400).json('Unable to register. Is the email unique?')
   });
}

module.exports = {
   handleRegister: handleRegister
};