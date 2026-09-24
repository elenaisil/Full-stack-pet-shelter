const Shelter = require('../model/Shelter')
//GET
// get all shelter
const getAllShelter = async (req, res) => {
    try {
        const shelters = await Shelter.findAll()
        res.json(shelters)
        console.log(shelters)

    } catch (e) {
        console.error("error fetching api/pets", e.message)
        res.status(500).json({e: 'internal server error'})
    }

}

// get by id shelter
const getShelterById = async (req, res) => {
    const {id} = req.params
    try {
        const shelter = await Shelter.findById(id)
        res.json(shelter || {})

    } catch (error) {
        console.log((error.message))
        res.status(500).json({error: 'internal error'})
    }

}
// search shelter name
const searchShelter = async (req, res) => {
    const {keyword} = req.params
    try {
        const shelters = await Shelter.searchByName(keyword)
        res.json(shelters || {})
    } catch (error) {
        console.log((error.message))
        res.status(500).json({error: 'internal error'})
    }
}

const searchShelterLocation = async (req, res) => {
    try {
        const shelters = await Shelter.searchByLocation(req.params.location)
        res.json(shelters || {})
    } catch (error) {
        console.log((error.message))
        res.status(500).json({error: 'internal error'})
    }
}
// search by location

// POST
// create shelter
const createShelter = async (req, res) => {
    const data = req.body
    try {
        const newShelter = await Shelter.create(data)
        res.json(newShelter || {})

        // console.log(result.rows)

    } catch (error) {
        console.log((error.message))
        res.status(500).json({error: 'internal error'})
    }
}
// PUT
// update shelter
const updateShelter = async (req, res) => {
    try {
        const updatedShelter = await Shelter.update(req.params.id, req.body)
        res.json(updatedShelter)
    } catch (e) {
        console.log((e.message))
        res.status(500).json({e: 'internal error'})
    }
}
// DELETE
// delete
const deleteShelter = async (req, res) => {
    try {
        await Shelter.delete(req.params.id)
        res.status(200).send()
    }catch (e) {
        console.log((e.message))
        res.status(500).json({e: 'idk cannot delete'})

    }
}

module.exports = {
    getAllShelter,
    getShelterById,
    searchShelter,
    searchShelterLocation,
    createShelter,
    updateShelter,
    deleteShelter
}