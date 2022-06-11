const express = require("express");
const fs = require('fs')

const router = express.Router();

const Checklist = require('../models/checklist');


const logDadosRegistrados = async () =>{
    let checklists = await Checklist.find({});
    fs.writeFile('DadosRegistrados.txt', `${checklists}` , err=>{})
}

logDadosRegistrados();

router.get('/', async (req, res) => {
    try{
        let checklists = await Checklist.find({})
        res.status(200).render('checklists/index', { checklists: checklists })
    } catch (error) {
        res.status(420).render('pages/error', {error: 'erro ao exibir as listas'})
    }
})

router.get('/new', async (req, res) => {
    try{
        let checklist = await new Checklist();
        res.status(200).render('checklists/new', {checklist: checklist})
    } catch (error){
        res.status(500).render('pages/error', {error: 'Erro ao carregar o formulário'})
    }
})

router.post('/', async (req, res) => {
    let { name } = req.body.checklist;
    let checklist = new Checklist({ name })

    try {
        await checklist.save()
        res.redirect('/checklists')
        logDadosRegistrados();
    } catch (error) {
        res.status(500).render('pages/error', {error: 'Erro ao criar nova tarefa'})
    }
})

router.get('/:id', async (req, res) => {
    try {
        let checklist = await Checklist.findById(req.params.id).populate('tasks') //populate() injeta as tasks dentro checklist, é o agregate mongo
        res.status(200).render('checklists/show', { checklist: checklist })
    } catch (error) {
        res.status(500).render('pages/error', { error: 'Erro ao exibir a edição lista de tarefas' })
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        let checklist = await Checklist.findById(req.params.id)
        res.status(200).render('checklists/edit', { checklist: checklist })
    } catch (error) {
        res.status(500).render('pages/error', { error: 'Erro ao exibir a edição lista de tarefas' })
    }
})

router.put('/:id', async (req, res) => {
    let { name } = req.body.checklist;
    
    try {
        let checklist = await Checklist.findByIdAndUpdate(req.params.id, { name } )
        res.status(200).redirect('/checklists')

    } catch (error) {
        let { errors } = error;
        res.status(500).render('checklists/edit', { checklist: { ...checklist, errors } })
    }
})

router.delete('/:id', async (req, res) => {
    try{
        let checklist = await Checklist.findByIdAndRemove(req.params.id)
        logDadosRegistrados();
        res.redirect('/checklists')
    } catch (error) {
        res.status(422).render('pages/error', { error: 'Erro ao deletar tarefa' })
    }
})


module.exports = router;