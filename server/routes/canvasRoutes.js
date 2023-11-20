const express = require('express');
const router = express.Router();
const canvasController = require('../controllers/Canvas/canvasController')

router.post('/addCollaborator', canvasController.addCollaborator);
router.post('/addNewCanvas', canvasController.addNewCanvas);
router.post('/resaveCanvas', canvasController.resaveCanvas);

module.exports = router;