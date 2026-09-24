const API_URL = 'http://localhost:3000/api';
let currentPetId = null;
let currentPetName = null;
let authToken = null;

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

async function loadStats() {
    try{
        const [petsRes, adoptionsRes, sheltersRes] = await Promise.all([
            fetch(`${API_URL}/pets`),
            fetch(`${API_URL}/adoption`),
            fetch(`${API_URL}/shelters`)
        ]);
        
    const pets = await petsRes.json();
     const adoptions = await adoptionsRes.json();
    const shelters = await sheltersRes.json();
        
        document.getElementById('totalPets').textContent = pets.length || 0;
        document.getElementById('availablePets').textContent = pets.filter(p => !p.adopted).length || 0;
        document.getElementById('adoptionsCount').textContent = adoptions.length || 0;
        document.getElementById('sheltersCount').textContent = shelters.length || 0;
    }catch(error){
        console.error('Error loading stats:', error);
    }
}

// index page 
async function loadPets() {
    try {
        const response = await fetch(`${API_URL}/pets`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const pets = await response.json();
        const availablePets = pets.filter(p => !p.adopted);
        //shows only 6 pets
        const displayPets = availablePets.slice(0, 6);
        
        //we should change with the image repo
        const petImages = {
            'Dog': 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300',
            'Cat': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300',
            'Bird': 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=300',
            'Rabbit': 'https://images.unsplash.com/photo-1535241749838-299277b6305f?w=300'
        };
        
        if (displayPets.length === 0) {
            document.getElementById('petsList').innerHTML = '<div style="text-align: center; grid-column: 1/-1; padding: 40px;">🐾 No pets available for adoption at the moment. Check back soon! 🐾</div>';
        } else {
            document.getElementById('petsList').innerHTML = displayPets.map(pet => `
                <div class="pet-card">
                    <img src="${petImages[pet.species] || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=300'}" alt="${pet.name}">
                    <div class="pet-info">
                        <h3>${pet.name}</h3>
                        <p>🐾 Species: ${pet.species || 'Unknown'}</p>
                        <p>📅 Age: ${pet.age || 'Unknown'} years</p>
                        <p>⚥ Gender: ${pet.gender || 'Unknown'}</p>
                        <button class="adopt-btn" onclick="openAdoptModal(${pet.id}, '${pet.name}')">Adopt ${pet.name}</button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading pets:', error);
        document.getElementById('petsList').innerHTML = `<div class="error-message">❌ Error loading pets: ${error.message}. Make sure backend is running on port 3000.</div>`;
    }
}

//pets page -all pets
async function loadAllPets() {
    try {
        const response = await fetch(`${API_URL}/pets`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const pets = await response.json();
        
        //change with img repo
        const petImages = {
            'Dog': 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300',
            'Cat': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300',
            'Bird': 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=300',
            'Rabbit': 'https://images.unsplash.com/photo-1535241749838-299277b6305f?w=300'
        };
        
        const allPetsList = document.getElementById('allPetsList');
        if (allPetsList) {
            if (pets.length === 0) {
                allPetsList.innerHTML = '<div style="text-align: center; grid-column: 1/-1; padding: 40px;">🐾 No pets available at the moment. Check back soon! 🐾</div>';
            } else {
                allPetsList.innerHTML = pets.map(pet => `
                    <div class="pet-card">
                        <img src="${petImages[pet.species] || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=300'}" alt="${pet.name}">
                        <div class="pet-info">
                            <h3>${pet.name}</h3>
                            <p>🐾 Species: ${pet.species || 'Unknown'}</p>
                            <p>📅 Age: ${pet.age || 'Unknown'} years</p>
                            <p>⚥ Gender: ${pet.gender || 'Unknown'}</p>
                            <p>🏠 Status: ${pet.adopted ? '✓ Adopted' : '❤️ Available'}</p>
                            ${!pet.adopted ? `<button class="adopt-btn" onclick="openAdoptModal(${pet.id}, '${pet.name}')">Adopt ${pet.name}</button>` : '<button class="adopt-btn" disabled style="background: #ccc; cursor: not-allowed;">Already Adopted</button>'}
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error loading all pets:', error);
        const allPetsList = document.getElementById('allPetsList');
        if (allPetsList) {
            allPetsList.innerHTML = `<div class="error-message">❌ Error loading pets: ${error.message}</div>`;
        }
    }
}

async function loadShelters() {
    try{
        const response = await fetch(`${API_URL}/shelters`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const shelters = await response.json();
        
        const sheltersList = document.getElementById('sheltersList');

if (!sheltersList) return;

if (shelters.length === 0) {
    sheltersList.innerHTML =
        '<div style="text-align: center; grid-column: 1/-1;">No shelters registered yet.</div>';
} else {
    sheltersList.innerHTML = shelters.map(shelter => `
                <div class="shelter-card">
                    <h3>🏢 ${shelter.name}</h3>
                    <p>📍 ${shelter.location || 'Location not specified'}</p>
                    <p>📞 ${shelter.phone || 'Phone not specified'}</p>
                    <p>🐾 Capacity: ${shelter.capacity || 'N/A'}
                    <p>📅 Since: ${shelter.creation_day ? new Date(shelter.creation_day).toLocaleDateString() : 'N/A'}</p>
                </div>
            `).join('');
        }
    }catch(error){
        console.error('Error loading shelters:', error);
        const sheltersList = document.getElementById('sheltersList');

if (sheltersList) {
    sheltersList.innerHTML =
        `<div class="error-message">❌ Error loading shelters: ${error.message}</div>`;
}}
}

function openAdoptModal(petId, petName) {
    currentPetId = petId;
    currentPetName = petName;
    document.getElementById('adoptModalTitle').textContent = `Adopt ${petName}`;
    document.getElementById('adoptModal').style.display = 'flex';
}

function closeAdoptModal() {
    document.getElementById('adoptModal').style.display = 'none';
    document.getElementById('adopterName').value = '';
    document.getElementById('adopterEmail').value = '';
    document.getElementById('adopterPhone').value = '';
    document.getElementById('adopterAddress').value = '';
    document.getElementById('adopterCity').value = '';
}

async function confirmAdoption() {
    const name = document.getElementById('adopterName').value;
    const email = document.getElementById('adopterEmail').value;
    const phone = document.getElementById('adopterPhone').value;
      const address = document.getElementById('adopterAddress').value;
    const city = document.getElementById('adopterCity').value;
    const password = 'default123';
    
    if(!name || !email){
        alert('Please enter your name and email');
        return;}
    
    try{
        //adopter registration
        const registerRes = await fetch(`${API_URL}/adopter/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name, 
                email, 
                phone, 
                address, 
                city,
                password: password
            })
        });
        
        if (!registerRes.ok) {
    const errorData = await registerRes.json();
    console.log('User already exists, continuing to login...');
    } else {
            const adopter = await registerRes.json();
            console.log('Adopter registered:', adopter);
        }
        
        //login to get token
        const loginRes = await fetch(`${API_URL}/adopter/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (!loginRes.ok) {
            const errorText = await loginRes.text();
            alert('Login failed: ' + errorText);
            return;
        }
        
        const loginData = await loginRes.json();
        const token = loginData.token;
        const adopterId = loginData.adopterId;
        
        console.log('Login successful, token received');
        
        //record the adoption
        const adoptionRes = await fetch(`${API_URL}/adoption`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                pet_id: currentPetId
                
            })
        });
        
        if (adoptionRes.ok) {
            alert(`🎉 Congratulations ${name}! You have successfully adopted ${currentPetName}!`);
            closeAdoptModal();
            
            //waiting for database to update
            await new Promise(resolve => setTimeout(resolve, 500));
            
            //refresh
            await loadStats();
            
            if (document.getElementById('allPetsList')) {
                await loadAllPets();
            } else if (document.getElementById('petsList')) {
                await loadPets();
            }
            await loadShelters();
        } else {
            const errorText = await adoptionRes.text();
            console.error('Adoption error:', errorText);
            alert('Error processing adoption: ' + errorText);
        }
    } catch(error){
        console.error('Error:', error);
        alert('An error occurred: '+ error.message);
    }
}

function openDonateModal() {
    document.getElementById('donateModal').style.display = 'flex';
}

function closeDonateModal() {
    document.getElementById('donateModal').style.display = 'none';
    document.getElementById('donationAmount').value = '';
    document.getElementById('donorName').value = '';
    document.getElementById('donorEmail').value = '';
}

function processDonation() {
    const amount = document.getElementById('donationAmount').value;
    const name = document.getElementById('donorName').value;
    
    if (!amount || amount <= 0) {
        alert('Please enter a valid donation amount');
        return;
    }
    alert(`Thank you ${name || 'kind stranger'} for your donation of $${amount}! Your support helps pets in need.`);
    closeDonateModal();
}

window.onclick = function(event) {
    if (event.target === document.getElementById('donateModal')) closeDonateModal();
    if (event.target === document.getElementById('adoptModal')) closeAdoptModal();
}

if (document.getElementById('allPetsList')) {
    //pets.html
    loadAllPets();
    loadStats();
    loadShelters();
    
    //refresh every 30 seconds for pets page
    setInterval(() => {
        loadStats();
        loadAllPets();
        loadShelters();
    }, 30000);
} else if (document.getElementById('petsList')) {
    //index.html
    loadStats();
 loadPets();
 loadShelters();
    
    //refresh every 30 seconds for index.html
    setInterval(() => {
     loadStats();
     loadPets();
    loadShelters();
    }, 30000);
}