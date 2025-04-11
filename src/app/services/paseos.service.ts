import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Mascota } from '../models/mascota';
import { Servicio } from '../models/servicio';
import { Paseo } from '../models/paseo';

@Injectable({
  providedIn: 'root'
})
export class PaseosService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getMascotas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.apiUrl}/mascotas`)
      .pipe(catchError(this.handleError));
  }

  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/servicios`)
      .pipe(catchError(this.handleError));
  }

  getPaseos(): Observable<Paseo[]> {
    return this.http.get<Paseo[]>(`${this.apiUrl}/paseos`)
      .pipe(catchError(this.handleError));
  }

  addMascota(mascota: Omit<Mascota, 'id'>): Observable<Mascota> {
    return this.http.post<Mascota>(`${this.apiUrl}/mascotas`, mascota)
      .pipe(catchError(this.handleError));
  }

  addPaseo(paseo: Paseo): Observable<Paseo> {
    return this.http.post<Paseo>(`${this.apiUrl}/paseos`, paseo)
      .pipe(catchError(this.handleError));
  }

  updateMascota(id: number, mascota: Mascota): Observable<Mascota> {
    return this.http.put<Mascota>(`${this.apiUrl}/mascotas/${id}`, mascota)
      .pipe(catchError(this.handleError));
  }

  createPaseo(paseo: Partial<Paseo>): Observable<Paseo> {
    return this.http.post<Paseo>(`${this.apiUrl}/paseos`, paseo)
      .pipe(catchError(this.handleError));
  }

  createPaseos(paseos: Partial<Paseo>[]): Observable<Paseo[]> {
    return this.http.post<Paseo[]>(`${this.apiUrl}/paseos/bulk`, paseos)
      .pipe(catchError(this.handleError));
  }

  deleteMascota(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/mascotas/${id}`)
      .pipe(catchError(this.handleError));
  }
}
