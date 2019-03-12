const handleRegister = (db, bcrypt) => (req, res) => {
   const {email, name, password} = req.body;
   const hash = bcrypt.hashSync(password);

   if (name === '' || email === '' || password === '') {
      return res.status(400).json('Registration fields cannot be blank');
   }

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
            res.json(user[0]);
         })
      })
      .then(trx.commit)
      .catch(trx.rollback)
   })
   .catch(err => {
      res.status(400).json('Unable to register. Is the email unique?')
   });
}

module.exports = {
   handleRegister: handleRegister
};