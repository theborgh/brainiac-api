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

let database = {
   users: [
      {
         id: 3,
         name: 'Jimmy',
         email: 'jimmy@gmail.com',
         password: 'gorbachev',
         facecount: 6,
         joined: new Date()
      },
      {
         id: 7,
         name: 'Geordie',
         email: 'geordie@gmail.com',
         password: 'jimmyfallon',
         facecount: 9,
         joined: new Date()
      }
   ],

   login: [
      {
         id: '3',
         hash: '',
         email: 'jimmy@gmail.com'
      }
   ]
};


app.get('/', (req, res) => {
   
   res.send(database.users);
});

app.post('/signin', (req, res) => {
   console.log(req.body.email);
   console.log(req.body.password);

   const userIndex = getUserIndex(req);

   if (userIndex !== -1) {
      console.log('returned user: ', database.users[userIndex])
      res.json(database.users[userIndex]);
   } else {
      res.status(400).json('Credentials are invalid!');
   }
});

app.post('/register', (req, res) => {
   const {email, name, password} = req.body;

   bcrypt.hash(password, null, null, function(err, hash) {
      console.log(hash);
   });

   db('users')
      .returning('*')
      .insert({
         email: email,
         name: name,
         joined: new Date()
      })
         .then(user => {
            console.log('user[0]: ', user[0]);
            res.json(user);
         })
         .catch(err => {
            console.log('error');
            res.status(400).json('Unable to register: is the email unique?')
         });

   database.users.push({
      id: 2345,
      name: name,
      email: email,
      facecount: 0,
      joined: new Date()
   })
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