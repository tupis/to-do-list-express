const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(
    'mongodb+srv://todolist:todolist@todo-list-express.2i7zai2.mongodb.net/?retryWrites=true&w=majority',
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.log(err));
