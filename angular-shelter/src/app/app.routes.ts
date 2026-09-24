import {Routes } from '@angular/router';
import {HomeComponent } from './components/home/home.component';
import {PetsComponent } from './components/pets/pets.component';
import {AboutComponent } from './components/about/about.component';
import {SheltersComponent } from './components/shelters/shelters.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', redirectTo: '', pathMatch: 'full' },
 { path: 'pets', component: PetsComponent },
  {path: 'about', component: AboutComponent },
  {path: 'shelters', component: SheltersComponent },
  {path: '**', redirectTo: '' }
];
