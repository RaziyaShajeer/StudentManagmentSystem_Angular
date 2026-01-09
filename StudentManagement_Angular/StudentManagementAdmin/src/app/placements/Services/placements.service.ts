import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacementsService {

  private baseUrl = 'https://localhost:7183/api/v1';

  constructor(private http: HttpClient) {}

  getPlacements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/placements`);
  }
}
