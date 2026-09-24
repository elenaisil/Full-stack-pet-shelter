import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-shelters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shelters.component.html',
  styleUrls: ['./shelters.component.css']
})
export class SheltersComponent implements OnInit {
  shelters: any[] = [];
  loading: boolean = true;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('SheltersComponent constructor called');
  }
//runs auto when component loads
  ngOnInit(): void {
    console.log('SheltersComponent ngOnInit called');
    this.loadShelters();
  }
//fething data
  loadShelters(): void {
    console.log('loadShelters called, loading =', this.loading);
    this.loading = true;
    
    this.apiService.getShelters().subscribe({
      next: (shelters: any) => {
        console.log('API Response received, shelters count:', shelters?.length);
        this.shelters = shelters || [];
        this.loading = false;//hide spinnre(loading)
        this.cdr.detectChanges();
        console.log('After assign, shelters.length =', this.shelters.length);
      },
      error: (err) => {
        //when api falls
        console.error('API Error:', err);
        this.loading = false;
        this.shelters = [];
        this.cdr.detectChanges();
      }
    });
  }
}