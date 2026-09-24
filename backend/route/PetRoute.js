const express = require('express')
const router = express.Router()
const PetController = require('../controller/PetController')
const {route} = require("express/lib/application");

// get
router.get('/', PetController.getAllPets)
router.get('/count', PetController.countPet)
router.get('/species/',PetController.getAllSpecies)
router.get('/species/:species', PetController.findPetBySpecies)
router.get('/:id', PetController.getPetById)

router.post('/', PetController.addPet)
router.delete('/:id', PetController.deletePet)
router.put('/:id', PetController.editPet)
module.exports = router