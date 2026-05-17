const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is working');
});


let users = [
    { id: 1, name: 'Alice', email: 'alice@gmail.com' },
    { id: 2, name: 'Marc', email: 'marc@gmail.com' }
];

app.get('/users', (req, res) => {
    res.json(users);
});

app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).send('user not found');
    }
    res.json(user);
});

app.post('/user', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email
    };
    users.push(newUser);
    res.status(201).json(newUser);
});



app.put('/user/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).send('user not found');
    }

    user.name = req.body.name;
    user.email = req.body.email;
    res.json(user);
});

app.delete('/user/:id', (req, res) => {
    users = users.filter(u => u.id !== parseInt(req.params.id));
    res.status(204).send({message:`User deleted with id: ${req.params.id}`});
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});