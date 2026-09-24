const Adoption = require('../model/Adoption')
const Pet = require('../model/Pet')
// POST
// for user to apply or create a form
const createAdoption = async (req, res) => {
    const { pet_id } = req.body
    const adopter_id = req.user.id

    try {
        //check if the pet is already adopted
        const petCheck = await Pet.findById(pet_id);
        if (!petCheck) return res.status(404).json({ error: "Pet not found" });
        // if true -> already adopt
        if (petCheck.adopted) return res.status(400).json({ error: "This pet is already adopted!" });
        
        //mark as adopted after
        await Pet.markAsAdopted(pet_id);
        
        // create the adoption record
        const adoption = await Adoption.create(pet_id,adopter_id)
        res.status(200).json(adoption);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// GET
// for admin
const getAllAdoptions = async (req, res) => {
    try {
        //  join with pet and adopter tables to show names instead of just IDs
        const adoptions = await Adoption.findAllWithDetails()
        res.json(adoptions);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// adopter sees only THEIR OWN applications
const getMyAdoptions = async (req, res) => {
    try {
        const adoptions = await Adoption.findByAdopterId(req.user.id);
        res.json(adoptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// admin approve/reject application
const updateAdoptionStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // approve or no

    try {
        // update the adoption status
        const adoption = await Adoption.updateStatus(id,status)

        if (!adoption) return res.status(404).json({ error: "Adoption record not found" });

        //if approved, automatically mark the pet as adopted
        if (status === 'Approved') {
            const petId = adoption.pet_id;
            await Pet.markAsAdopted(petId);
        }

        res.json({ message: `Application ${status}`, data: adoption });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//adopter cancels their application
const cancelAdoption = async (req, res) => {
    try {
        // check the id and the adopter_id so users can't delete other people's apps
        const canceled = await Adoption.deletePending(req.params.id, req.user.id);

        if (!canceled) {
            return res.status(400).json({ error: "Cannot cancel. Application is not found or already processed." });
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createAdoption,
    getAllAdoptions,
    getMyAdoptions,
    updateAdoptionStatus,
    cancelAdoption
};