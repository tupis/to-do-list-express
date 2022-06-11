const express = require('express');
const fs = require('fs');
const { findById } = require('../models/checklist');

const Checklist = require('../models/checklist');
const Task = require('../models/task');

const checklistDependetRoute = express.Router();
const simpleRouter = express.Router();

const logTasksRegistradas = async () => {
    let tasks = await Task.find({});
    fs.writeFile('tasksRegistradas.txt', `${tasks}`, err=>{})
}

logTasksRegistradas();

checklistDependetRoute.get('/:id/tasks/new', async (req, res) => {
    try {
        let task = await new Task();
        res.status(200).render('tasks/new', { checklistId: req.params.id, task: task} )
        logTasksRegistradas();
    } catch (error) {
        res.status(422).render('pages/error', { error: 'Erro ao carregar uma subtarefa' } )
    }
});

simpleRouter.delete('/:id', async (req, res) => {
    try {
        let task = await Task.findByIdAndDelete(req.params.id);
        let checklist = await Checklist.findById(task.checklist);
        let taskToRemove = await checklist.tasks.indexOf(task._id);
        checklist.tasks.slice(taskToRemove, 1);
        checklist.save();
        res.redirect(`/checklists/${checklist._id}`);
    } catch (error) {
        res.status(422).render('pages/error', { error: 'Erro ao remover uma tarefa' } )
    }
})

checklistDependetRoute.post('/:id/tasks', async (req, res) => {
    let { name } = req.body.task
    let task = await new Task( { name, checklist: req.params.id } );
    logTasksRegistradas();
    
    try {
        await task.save(err=>console.log(err));
        let checklist = await Checklist.findById(req.params.id);
        checklist.tasks.push(task);
        await checklist.save();
        res.redirect(`/checklists/${req.params.id}`)
        
        logTasksRegistradas();
    } catch (error) {
        let { errors } = error;
        res.status(500).render('tasks/new', { task: {...task, errors}, checklistId: req.params.id } )
    }
})


simpleRouter.put('/:id', async (req, res) => {
    let task = await Task.findById(req.params.id);
    try {
        task.set(req.body.task); // poderia usar o new, poderia ter usado update
        await task.save();
        res.status(200).json({ task })
    } catch (error) {
        let { errors } = error
        res.status(422).json( { task: { ...errors } } )
    }
})

module.exports = 
{ 
    checklistDependet: checklistDependetRoute,
    simple: simpleRouter 
};