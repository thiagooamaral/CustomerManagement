import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { Customer } from "./customer.model";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiPath: string = `${environment.baseUrl}v1/clientes`;

  constructor(private http: HttpClient) { }

  //Public methods
  getAll(): Observable<Customer[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCustomers)
    )
  }

  getById(id: number): Observable<Customer> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCustomer)
    )
  }

  create(customer: Customer): Observable<Customer> {
    return this.http.post(this.apiPath, customer).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCustomer)
    )
  }

  update(customer: Customer): Observable<Customer> {
    const url = `${this.apiPath}/${customer.clienteId}`;

    return this.http.put(url, customer).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCustomer)
    )
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }

  activate(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}/ativar`;

    return this.http.post(url, null).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }

  inactivate(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}/Inativar`;

    return this.http.post(url, null).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }

  //Private methods
  private jsonDataToCustomers(jsonData: any[]): Customer[] {
    const customers: Customer[] = [];
    jsonData.forEach(element => {
      const customer = Object.assign(new Customer(), element);
      customers.push(customer);
    });
    return customers;
  }

  private jsonDataToCustomer(jsonData: any): Customer {
    return Object.assign(new Customer(), jsonData);
  }

  private handleError(error: any): Observable<any> {
    console.log("Erro na requisição => ", error);
    return throwError(error);
  }
}