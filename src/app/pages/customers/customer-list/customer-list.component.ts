import { Component, OnInit } from '@angular/core';

import { Customer } from "../shared/customer.model";
import { CustomerService } from "../shared/customer.service";

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  customers: Customer[] = [];

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.customerService.getAll().subscribe(
      customers => this.customers = customers,
      error => alert('Erro ao carregar a lista de clientes')
    )
  }

  deleteCustomer(customer: Customer) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if (mustDelete) {
      this.customerService.delete(customer.clienteId).subscribe(
        () => this.customers = this.customers.filter(element => element != customer),
        () => alert('Erro ao tentar excluir o cliente')
      )
    }
  }

  changeStatusCustomer(customer: Customer) {
    if (customer.ativo) {
      const mustChange = confirm('Deseja realmente inativar este cliente?');

      if (mustChange) {
        this.customerService.inactivate(customer.clienteId).subscribe(
          () => customer.ativo = false,
          () => alert('Erro ao tentar inativar o cliente')
        )
      }
    }
    else {
      const mustChange = confirm('Deseja realmente ativar este cliente?');

      if (mustChange) {
        this.customerService.activate(customer.clienteId).subscribe(
          () => customer.ativo = true,
          () => alert('Erro ao tentar ativar o cliente')
        )
      }
    }
  }
}
