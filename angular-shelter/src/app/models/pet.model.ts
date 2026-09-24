export interface Pet {
  id: number;
  name: string;
  species: string;
  age: number;
  gender: string;
  adopted: boolean;
  shelter_id: number;
}

export interface Shelter {
  id: number;
  name: string;
  location: string;
  capacity: number;
  phone: string;
  creation_day: string;
}

export interface Adoption {
  id: number;
  pet_id: number;
  adopter_id: number;
  adoption_date: string;
  status: string;
}