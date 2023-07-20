const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');

// server setting 
const app = express();
const port = 8080;

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


//connecting to the database
const dbURI = "mongodb+srv://manishraz32:1234@cluster0.bltk4al.mongodb.net/todo";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to the database');

        //Start the server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        })
    })
    .catch((error) => {
        console.log(`Error connecting to database: `, error);
    })
//create schema
const taskSchema = new mongoose.Schema({
    task: String,
    done: {
        type: Boolean,
        default: false
    }
})

const TaskModel = mongoose.model('Task', taskSchema);



// CRUD operation

// get method
app.get('/tasks', async (req, res) => {

    try {
        const tasks = await TaskModel.find({});
        res.status(200).send({
            success: "true",
            tasks,
        })
    } catch (error) {
        console.log("error: ", error);
        res.status(500).send({
            success: false,
            message: 'Error while getting tasks',
            error
        })
    }

})


//post method
app.post('/task', async (req, res) => {
    try {
        console.log("reqbody", req.body);
        const newTask = new TaskModel({
            task: req.body.task
        })
        const savedTask = await newTask.save();
        res.status(200).send({
            success: true,
            savedTask
        })
    } catch (error) {
        console.log('error', error);
        res.status(500).send({
            success: false,
            message: 'Error while posting data',
            error
        })
    }
})

//update task on based of id
app.put('/task/:id', async (req, res) => {
    try {
        const updatedTask = await TaskModel.findByIdAndUpdate(req.params.id,
            { done: req.body.done },
            { new: true }
        );
        if (!updatedTask) {
            return res.status(404).send({
                success: false,
                error: 'Task not found'
            })
        }

        res.status(200).send({
            success: true,
            updatedTask
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error while updating Task",
            error,
        })
    }
})


//delete task based on id
app.delete('/task/:id', async(req, res) => {
    try {
        const deletedTask = await TaskModel.findByIdAndRemove(req.params.id);
        if(!deletedTask) {
            return res.status(404).send({
                success: false,
                error: 'Task not found'
            })
        }
        res.status(200).send({
            success: true,
            deletedTask
        });

    } catch(error) {
        console.log(error);
        res.status(200).send({ 
            success: false,
            message: 'Error while deleting task',
            error
        })
    }
})


