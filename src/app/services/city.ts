import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';


export interface City {
  id: number;
  name: string;
}

export interface ApiResponse {
  key: string;
  msg: string;
  data: City[];
}

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private http = inject(HttpClient);
  private _cities = signal<City[]>([]);
  private _loading = signal<boolean>(false);
  public cities = computed(() => this._cities());
  public isLoading = computed(() => this._loading());

  // run api to get cities
  async getCities() {
    //  loading 
    this._loading.set(true);

    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse>('ListCities')
      );
      console.log('Cities fetched successfully:', response.data);

      if (response && response.key === 'success') {
        this._cities.set(response.data);
        console.log('Cities fetched successfully:', response.data);
      } else {
        console.error('Failed to fetch cities:', response?.msg || 'Unknown error');
      }
    } catch (error) {
      const err = error as HttpErrorResponse;
      console.error('An error occurred while fetching cities:', err.message);
    } finally {
      this._loading.set(false);
    }
  }

  reset() {
    this._cities.set([]);
    this._loading.set(false);
  }
}