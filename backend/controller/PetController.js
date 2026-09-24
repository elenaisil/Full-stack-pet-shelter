const Pet = require("../model/Pet")

// GET
// get all pet
const getAllPets = async (req, res) => {
    try {
        const pets = await Pet.findAll()
        res.json(pets)
        console.log(pets)

    } catch (e) {
        console.error("error fetching api/pets", e.message)
        res.status(500).json({e: 'internal server error'})
    }

}

// get pet by id
const getPetById = async (req, res) => {
    const {id} = req.params
    try {
        const pet = await Pet.findById(id)
        res.json(pet || {})

    } catch (error) {
        console.log((error.message))
        res.status(500).json({error: 'internal error'})
    }

}
// count pet
const countPet = async (req,res) => {
    try {
        const count = await Pet.count()
        res.json(count)

    } catch (e) {
        console.log((e.message))
        res.status(500).json({e: 'internal error'})
    }
}
// find pet by specices
const findPetBySpecies = async  (req, res) => {
    try {
        const pets = await Pet.findBySpecies(req.params.species)
        res.json(pets)
    } catch (e) {
        console.log((e.message))
        res.status(500).json({e: 'internal error'})
    }
}

const getAllSpecies = async (req, res) => {
    try {
        const species = await Pet.findSpecies()
        res.json(species)
    } catch (e) {
        console.log((e.message))
        res.status(500).json({e: 'internal error'})
    }
}
// POST
// add pet
const addPet = async (req, res) => {
    try {
        const newPet = await Pet.create(req.body)
        res.json(newPet || {})

        console.log(newPet)

    } catch (error) {
        console.log((error.message))
        res.status(500).json({error: 'internal error'})
    }
}
// PUT
// editpet
const editPet = async (req, res) => {
    try {
        const updatedPet = await Pet.update(req.params.id, req.body)
        res.json(updatedPet || {})
    } catch (e) {
        console.log((e.message))
        res.status(500).json({e: 'internal error'})
    }
}
// DELETE
// deletepet
const deletePet = async (req, res) => {
    try {
        await Pet.delete(req.params.id)
        res.status(204).send()
    }catch (e) {
        console.log((e.message))
        res.status(500).json({e: 'idk cannot delete'})

    }
}

module.exports = {
    getAllPets,
    getPetById,
    addPet,
    editPet,
    deletePet,
    countPet,
    findPetBySpecies,
    getAllSpecies
}