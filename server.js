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
   const userIndex = foundUser(id);

   if (userIndex !== -1) {
      res.json(database.users[userIndex]);
   } else {
      res.status(404).json('Profile: That user doesn\'t exist!');
   }
})

app.put('/image', (req, res) => {
   const {id, facesFound} = req.body;

   const user = database.users.filter(u => u.id === Number(id));
   console.log('put IMAGE: ', id, Number(id), user);

   if (user[0]) {
      console.log('faces found: ', facesFound);
      console.log('Before update, user.name = ', user[0].name, 'user.facecount', user[0].facecount);
      user[0].facecount += facesFound;
      console.log('After update, user.name = ', user[0].name, 'user.facecount', user[0].facecount);

      res.json(user[0].facecount);
   } else {
      debugger;
      res.status(404).json('That user doesn\'t exist! This should never happen, user is already logged in'); // Should never happen, because user's alread logged in
   }
})

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

const foundUser = id => {
   let i = -1;
   database.users.forEach((user, index) => {

      if(user.id === Number(id))
         i = index;
   });

   return i;
}