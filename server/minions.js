const express = require('express');
const minionsRouter = express.Router();
const morgan = require('morgan');


const {
    getAllFromDatabase, 
    getFromDatabaseById, 
    addToDatabase, 
    updateInstanceInDatabase, 
    deleteFromDatabaseById
} = require('./db');

minionsRouter.use(morgan('dev'));

minionsRouter.param('minionId', (req, res, next, id) => {
    const minion = getFromDatabaseById('minions', id);
    if (minion) {
        req.minion = minion;
        next();
    } else {
        res.status(404).send();
    }
});


minionsRouter.get('/', (req, res, next) => {
    res.send(getAllFromDatabase('minions'));
});

minionsRouter.post('/', (req, res, next) => {
    const newMinion = addToDatabase('minions', req.body);
    res.status(201).send(newMinion);
});

minionsRouter.get('/:minionId', (req, res, next) => {
    res.send(req.minion);
});

minionsRouter.put('/:minionId', (req, res, next) => {
    const updatedMinion = updateInstanceInDatabase('minions', req.body);
    res.send(updatedMinion);
});

minionsRouter.delete('/:minionId', (req, res, next) => {
    const deletedMinion = deleteFromDatabaseById('minions', req.params.minionId);
    if (deletedMinion) {
        res.status(204);
    } else {
        res.status(500);
    }
    res.send();
});


minionsRouter.get('/:minionId/work', (req, res, next) => {
    const work = getAllFromDatabase('work').filter((singleWork) => {
        return singleWork.minionId === req.params.minionId;
    })
    res.send(work);
});

minionsRouter.post('/:minionId/work', (req, res, next) => {
    const workToAdd = req.body;
    workToAdd.minionId = req.params.minionId; 
    const newWork = addToDatabase('work', workToAdd);
    res.status(201).send(newWork);
});

minionsRouter.param('workId', (req, res, next, id) => {
    const work = getFromDatabaseById('work', id);
    if (work) {
        req.work = work;
        next();
    } else {
        res.status(404).send();
    }
});


minionsRouter.put('/:minionId/work/:workId', (req, res, next) => {
    if (req.params.minionId !== req.body.minionId) {
        res.status(400).send();
    } else {
        const updatedWork = updateInstanceInDatabase('work', req.body);
        res.send(updatedWork);
    }
});

minionsRouter.delete('/:minionId/work/:workId', (req, res, next) => {
    const deletedWork = deleteFromDatabaseById('work', req.params.workId);
    if (deletedWork) {
        res.status(204);
    } else {
        res.status(500);
    }
    res.send();
});

module.exports = minionsRouter;