
import express from 'express';
const app = express();


import data from '../data.js'

const port = process.env.PORT || 3000;

app.use(express.json());
app.listen(port, ()=>{
    console.log("Server running in port", port);
})
app.get('/users', async (req, res)=>{
    res.json(data.usersData);
})

app.get('/user/:id', async (req, res)=>{
    const id = parseInt(req.params.id);
    const index = data.usersData.findIndex(user => user.id === id);
    
    if (index === -1) {
        return res.status(404).send(`User with id ${id} not found.`);
    }
    res.json(data.usersData.find((user) => user.id == id));
})

app.put('/user/:id', async (req, res)=>{
    const id = parseInt(req.params.id);
    const {name, location} = req.body;
    const user = data.usersData.find(user=> user.id === id);

    if(user){
        user.name = name;
        user.location = location;
        res.send({"message" : "Succeswsfully updated "});
    }
    else{
        res.send({"message" : "User not found"});
    }

})
app.post('/user',(req, res)=>{
    const { name, location } = req.body;
    ++idCount;
    const user = {id: idCount, name: name, location: location};
    data.usersData.push(user);
    res.json({"message" : "Successfully Inserted." , "user": user});
})

app.delete('/user/:id', (req, res)=>{
    const id = parseInt(req.params.id);
    const index = data.usersData.findIndex(user => user.id === id);
    
    if (index === -1) {
        return res.status(404).send(`User with id ${id} not found.`);
    }
    const user = data.usersData[index];
    data.usersData.splice(index, 1); 
    res.json({"message" : "Successfully Deleted." , "user": user});
})