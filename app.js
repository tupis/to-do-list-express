const express = require('express');
const app = express();
const path = require('path');
var methodOverride = require('method-override')

const port = process.env.PORT || 3000;


const checklistsRouter = require('./src/routes/checklist');
const taskRouter = require('./src/routes/task');
const rootRouter = require('./src/routes/index');
require('./config/database');

app.use(express.json());                          //middleware transpor req do json pro req do body
app.use(express.urlencoded({extended: true}))     //middleware req via formulário
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));  //objeto methods: indica quais verbos sobrescrever

app.use('/', rootRouter);
app.use('/checklists', checklistsRouter);
app.use('/checklists', taskRouter.checklistDependet);
app.use('/task', taskRouter.simple)

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'ejs')

app.listen(port, () => {
    console.log("servidor foi iniciado");
});