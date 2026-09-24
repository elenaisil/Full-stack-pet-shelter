const express = require('express');
const router = express.Router();
const AdoptionController = require('../controller/AdoptionController');
const verify = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// for user
router.post('/', verify, AdoptionController.createAdoption)
router.get('/me', verify, AdoptionController.getMyAdoptions)
router.delete('/:id', verify, AdoptionController.cancelAdoption)

// for admin
router.get('/', verify, isAdmin, AdoptionController.getAllAdoptions)
router.put('/:id/status', verify, isAdmin, AdoptionController.updateAdoptionStatus)

module.exports = router;