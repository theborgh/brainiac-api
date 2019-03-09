const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3000;

let database = {
   users: [
      {
         id: 3,
         name: 'Jimmy',
         email: 'jimmy@gmail.com',
         password: 'gorbachev',
         entries: 6,
         joined: new Date()
      },
      {
         id: 5,
         name: 'Geordie',
         email: 'geordie@gmail.com',
         password: 'jimmyfallon',
         entries: 9,
         joined: new Date()
      }
   ]
};


app.get('/', (req, res) => {
   
   res.send(database.users);
});

app.post('/signin', (req, res) => {
   console.log(req.body.email);
   console.log(req.body.password);
   if (reqCredentialsAreValid(req)) {
      res.json('success');
   } else {
      res.status(400).json('Credentials are invalid!');
   }
});

app.post('/register', (req, res) => {
   const {email, name, password} = req.body;

   database.users.push({
      id: 2345,
      name: name,
      email: email,
      password: password,
      entries: 0,
      joined: new Date()
   })
   res.json(database.users[database.users.length-1]);
});

app.get('/profile/:id', (req, res) => {
   const {id} = req.params;
   const userIndex = foundUser(id);

   if (userIndex !== -1) {
      res.json(database.users[userIndex]);
   } else {
      res.status(404).json('That user doesn\'t exist!');
   }
})

app.post('/image', (req, res) => {
   const {id} = req.body;

   const user = database.users.filter(u => u.id === Number(id));
   console.log(id, Number(id), user);

   if (user) {
      console.log(user[0].name);
      user[0].entries++;
      res.json(user);
   } else {
      res.status(404).json('That user doesn\'t exist!');
   }
})

app.listen(PORT, () => {
   console.log(`App is running on port ${PORT}`);
});

const reqCredentialsAreValid = req => {
   for(let i = 0; i < database.users.length; i++) {
      if (req.body.email === database.users[i].email &&
          req.body.password === database.users[i].password) {
             return true;
          }
   return false;
   }
}

const foundUser = id => {
   let i = -1;
   database.users.forEach((user, index) => {

      if(user.id === Number(id))
         i = index;
   });

   return i;
}