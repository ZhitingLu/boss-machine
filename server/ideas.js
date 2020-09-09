const ideasRouter = require('express').Router(); 
const morgan = require('morgan');

const {
    getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    updateInstanceInDatabase,
    deleteFromDatabaseById,
} = require('./db');

ideasRouter.use(morgan('dev'));

const checkMillionDollarIdea = require('./checkMillionDollarIdea');


ideasRouter.param('id', (req, res, next, id) => {
    const idea = getFromDatabaseById('ideas', id);
    if (idea) {
        req.idea = idea;
        next();
    } else {
        res.status(404).send();
    }
});

ideasRouter.get('/', (req, res, next) => {
    res.send(getAllFromDatabase('ideas'));
});

ideasRouter.post('/', checkMillionDollarIdea, (req, res, next) => {
    const newIdea = addToDatabase('ideas', req.body);
    res.status(201).send(newIdea);
});

ideasRouter.get('/:id', (req, res, next) => {
    res.send(req.idea);
});

ideasRouter.put('/:id', checkMillionDollarIdea, (req, res, next) => {
    let updatedInstance = updateInstanceInDatabase('ideas', req.body);
    res.send(updatedInstance);
});

ideasRouter.delete('/:id', (req, res, next) => {
    const deletedIdea = deleteFromDatabaseById('ideas', req.params.id);
    if (deletedIdea) {
        res.status(204);
   } else {
       res.status(500);
   }
   res.send();
});

module.exports = ideasRouter;