const meetingsRouter = require('express').Router();
const morgan = require('morgan');

const {
    createMeeting,
    addToDatabase,
    getAllFromDatabase,
    deleteAllFromDatabase,
} = require('./db');

meetingsRouter.use(morgan('dev'));

meetingsRouter.get('/', (req, res, next) => {
    const meetings = getAllFromDatabase('meetings');
    res.send(meetings);
});

meetingsRouter.post('/', (req, res, next) => {
    const newMeeting = addToDatabase('meetings', createMeeting());
    res.status(201).send(newMeeting);
});

meetingsRouter.delete('/', (req, res, next) => {
    const deletedMeetings = deleteAllFromDatabase('meetings');
    if (deletedMeetings) {
        res.status(204);
    } else {
        res.status(500);
    }
    res.send();
});

module.exports = meetingsRouter;
