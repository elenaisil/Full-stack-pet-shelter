import {Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule } from '@angular/forms';
import {RouterLink } from '@angular/router';
import {ApiService} from '../../services/api';

@Component({
  selector: 'app-home',
  standalone: true,
imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

 //data from backend
export class HomeComponent implements OnInit {
  pets: any[] = [];
  shelters: any[] = [];
  totalPets = 0;
  availablePets = 0;
  adoptionsCount = 0;
  sheltersCount = 0;
  loading = true;
  selectedPet: any = null;
  showAdoptModal = false;
  showDonateModal = false;
  donationAmount = 0;
  donorName = '';

  petImages: any = {
    Dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300',
    Cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300'
  };
  defaultImage = 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=300';

  adopter = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  };

  constructor(
    private api: ApiService, //http requests to backend
    private cdr: ChangeDetectorRef
  ) {
    console.log('HomeComponent constructor called');
  }

  ngOnInit(): void {
    console.log('HomeComponent ngOnInit called');
    this.loadAllData();
  }

  // loads all data all tgth
  loadAllData(): void {
    this.loadPets();
    this.loadShelters();
    this.loadStats();
  }

  loadStats(): void {
    this.api.getPets().subscribe({
      next: (data: any) => {
        console.log('Stats loaded:', data.length);
        this.totalPets = data.length;
        this.availablePets = data.filter((p: any) => !p.adopted).length;
        this.adoptionsCount = data.filter((p: any) => p.adopted).length;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading stats:', err);
      }
    });
    
    this.api.getShelters().subscribe({
      next: (data: any) => {
        this.sheltersCount = data.length;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading shelter count:', err)
    });
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }

  //only 6 available pets for homepage
  loadPets(): void {
    this.api.getPets().subscribe({
      next: (data: any) => {
        console.log('Pets loaded:', data.length);
        const availablePets = data.filter((p: any) => !p.adopted);
        this.pets = availablePets.slice(0, 6);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading pets:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
//loading the shelters to hm page
  loadShelters(): void {
    this.api.getShelters().subscribe({
      next: (data: any) => {
        console.log('Shelters loaded:', data.length);
        this.shelters = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading shelters:', err)
    });
  }

  getPetImage(species: string): string {
    return this.petImages[species] || this.defaultImage;
  }

  //adoption popup for the selectedPet
  openAdoptModal(pet: any): void {
    this.selectedPet = pet;
    this.showAdoptModal = true;
    this.cdr.detectChanges();
  }

  closeAdoptModal(): void {
    this.showAdoptModal = false;
    this.adopter = { name: '', email: '', phone: '', address: '', city: '' };
    this.selectedPet = null;
    this.cdr.detectChanges();
  }

  confirmAdoption(): void {
    if (!this.adopter.name.trim() || !this.adopter.email.trim()) {
      alert('Please fill all required fields');
      return;
    }
    
    const password = 'default123';
    
    this.api.signup({ ...this.adopter, password }).subscribe({
      next: (response: any) => {
        console.log('Signup successful:', response);
        this.loginAndAdopt(password);
      },
      error: (err: any) => {
        console.log('User may already exist, trying login:', err);
        this.loginAndAdopt(password);
      }
    });
  }

  loginAndAdopt(password: string): void {
    this.api.login({ email: this.adopter.email, password }).subscribe({
      next: (loginData: any) => {
        console.log('Login successful, token received');
        const token = loginData.token;
        
        this.api.adoptPet(token, this.selectedPet.id).subscribe({
          next: () => {
            alert(`🎉 Successfully adopted ${this.selectedPet.name}!`);
            this.closeAdoptModal();
            this.loadPets();
            this.loadStats();
            this.cdr.detectChanges();
          },
          error: (err: any) => {
            console.error('Adoption error:', err);
            alert('Adoption failed: ' + (err.error?.error || 'Unknown error'));
          }
        });
      },
      error: (err: any) => {
        console.error('Login error:', err);
        alert('Login failed: ' + (err.error?.error || 'Please try again'));
      }
    });
  }
//donate popup
  openDonateModal(): void {
    this.showDonateModal = true;
    this.cdr.detectChanges();
  }

  closeDonateModal(): void {
    this.showDonateModal = false;
    this.donationAmount = 0;
    this.donorName = '';
    this.cdr.detectChanges();
  }

  processDonation(): void {
    if (this.donationAmount <= 0 || !this.donorName.trim()) {
      alert('Please fill donation form');
      return;
    }
    alert(`Thank you ${this.donorName} for donating $${this.donationAmount}!`);
    this.closeDonateModal();
  }
}