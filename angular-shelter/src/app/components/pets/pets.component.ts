import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.css']
})
export class PetsComponent implements OnInit {
  //storing pets from db
  allPets: any[] = [];
  loading: boolean = true;
  showAdoptModal = false;
  selectedPet: any = null;

  //adopter form data
  adopter = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  };

  petImages: any = {
    Dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300',
    Cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300'
  };
  defaultImage = 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=300';

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef 
  ) {
    console.log('PetsComponent constructor called');
  }

  //runs when component loads
  ngOnInit(): void {
    console.log('PetsComponent ngOnInit called');
    this.loadAllPets();
  }

  //fetching all pets from backend api
  loadAllPets(): void {
    console.log('loadAllPets called, loading =', this.loading);
    this.loading = true;
    
    this.apiService.getPets().subscribe({
      next: (pets: any) => {
        console.log('API Response received, pets count:', pets?.length);
        this.allPets = pets || [];
        this.loading = false;
        this.cdr.detectChanges();  // ← BUNU EKLE (elle değişiklik algılat)
        console.log('After assign, allPets.length =', this.allPets.length);
      },
      error: (err) => {
        console.error('API Error:', err);
        this.loading = false;
        this.allPets = [];
        this.cdr.detectChanges();  // ← BUNU EKLE
      }
    });
  }
//adopt modal for the pet
  openAdoptModal(pet: any): void {
    this.selectedPet = pet;
    this.showAdoptModal = true;
  }

  closeAdoptModal(): void {
    this.showAdoptModal = false;
    this.adopter = { name: '', email: '', phone: '', address: '', city: '' };
  }

  confirmAdoption(): void {
    if (!this.adopter.name.trim() || !this.adopter.email.trim()) {
      alert('Please fill all required fields');
      return;
    }
    const password = 'default123';
    this.apiService.signup({ ...this.adopter, password }).subscribe({
      next: () => this.loginAndAdopt(password),
      error: () => this.loginAndAdopt(password)
    });
  }
//registration before adoption
  loginAndAdopt(password: string): void {
    this.apiService.login({ email: this.adopter.email, password }).subscribe({
      next: (loginData: any) => {
        this.apiService.adoptPet(loginData.token, this.selectedPet.id).subscribe({
          next: () => {
            alert(`🎉 ${this.selectedPet.name} adopted successfully!`);
            this.closeAdoptModal();
            this.loadAllPets();
          },
          error: (err) => console.error(err)
        });
      },
      error: (err) => console.error(err)
    });
  }
}