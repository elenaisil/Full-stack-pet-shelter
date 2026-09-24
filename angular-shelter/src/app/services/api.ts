import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  //fetching all pets from database
  getPets(): Observable<any> {
    return this.http.get(`${this.API_URL}/pets`);
  }

  getShelters(): Observable<any> {
    return this.http.get(`${this.API_URL}/shelters`);
  }

  signup(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/adopter/signup`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/adopter/login`, data);
  }

  adoptPet(token: string, pet_id: number): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${this.API_URL}/adoption`, { pet_id }, { headers });
  }
}