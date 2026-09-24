const express = require('express')
const router = express.Router()
const ShelterController = require('../controller/ShelterController')
const {route} = require("express/lib/application");

// get
router.get('/', ShelterController.getAllShelter)
router.get('/search/name/:keyword',ShelterController.searchShelter)
router.get('/search/location/:location', ShelterController.searchShelterLocation)
router.get('/:id', ShelterController.getShelterById)

router.post('/', ShelterController.createShelter)
router.delete('/:id', ShelterController.deleteShelter)
router.put('/:id', ShelterController.updateShelter)
module.exports = router