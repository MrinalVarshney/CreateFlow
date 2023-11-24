const express = require('express');
const router = express.Router();
const canvasController = require('../controllers/Canvas/canvasController')
const protect = require('../middlewares/auth')

router.post('/addCollaborator',protect, canvasController.addCollaborator);
router.post('/addNewCanvas',protect, canvasController.addNewCanvas);
router.post('/resaveCanvas',protect, canvasController.resaveCanvas);
router.get('/getAllCanvas',protect,canvasController.getAllCanvas)

module.exports = router;