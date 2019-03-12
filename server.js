const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
   client: 'pg',
   connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'postgres',
      database: 'brainiac'
   }
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const PORT = 3000;

app.get('/', (req, res) => {
   
   res.send(database.users);
});

app.post('/signin', (req, res) => {
   const {email, password} = req.body;
   console.log(email, password);
   db.select('email', 'hash')
   .from('login')
   .where('email', '=', email)
   .then(data => {
      if (bcrypt.compareSync(password, data[0].hash)) {
         return db.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
               res.json(user[0]);
            })
            .catch(err => res.status(400).json('Unable to get user'))
      } else {
         res.status(400).json('Wrong credentials!');
      }
   })
   .catch(err => res.status(400).json('Wrong credentials'))
});

app.post('/register', (req, res) => {
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
});

app.get('/profile/:id', (req, res) => {
   const {id} = req.params;

   db.select('*').from('users')
      .where({
         id: id
      })
      .then(user => {
         if(user.length) {
            res.json(user[0]);
         } else {
            res.status(400).json("User not found")
         }
      })
      .catch(err => {
         res.status(400).json("Error fetching user");
      });
})

app.put('/image', (req, res) => {
   const {id, facesFound} = req.body;

   db('users').where('id', '=', id)
      .increment('facecount', facesFound)
      .returning('facecount')
      .then(count => {
         res.json(count[0]);
      })
         .catch(err => res.status(400).json('Unable to get the facecount'))
   });

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});

const getUserIndex = req => {
   for(let i = 0; i < database.users.length; i++) {
      if (req.body.email === database.users[i].email &&
          req.body.password === database.users[i].password) {
             return i;
          }
   }
   return -1;
}