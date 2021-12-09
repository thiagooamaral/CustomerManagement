import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Customer } from "../shared/customer.model";
import { CustomerService } from "../shared/customer.service";

import { switchMap } from "rxjs/operators";

import toastr from "toastr";

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  customerForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  customer: Customer = new Customer();

  constructor(
    private customerService: CustomerService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildCustomerForm();
    this.loadCustomer();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction == 'new')
      this.createCustomer();
    else
      this.updateCustomer();
  }

  get genderTypes(): Array<any> {
    return Object.entries(Customer.genderList).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    )
  }

  get civilStatusTypes(): Array<any> {
    return Object.entries(Customer.civilStatusList).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    )
  }

  //Private methods
  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == 'new')
      this.currentAction = 'new'
    else
      this.currentAction = 'edit'
  }

  private buildCustomerForm() {
    this.customerForm = this.formBuilder.group({
      clienteId: [null],
      nome: [null, [Validators.required, Validators.minLength(2)]],
      nascimento: [null, [Validators.required]],
      sexo: [null, [Validators.required]],
      estadoCivil: [null, [Validators.required]]
    })
  }

  private loadCustomer() {
    if (this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.customerService.getById(+params.get('id')))
      )
      .subscribe(
        (customer) => {
          this.customer = customer;
          this.customerForm.patchValue(customer)
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde')
      )
    }
  }

  private setPageTitle() {
    if (this.currentAction == 'new')
      this.pageTitle = 'Cadastro de Cliente'
    else
      this.pageTitle = 'Edição de Cliente'
  }

  private createCustomer() {
    const customer: Customer = Object.assign(new Customer(), this.customerForm.value);
    customer.sexo = +customer.sexo;
    customer.estadoCivil = +customer.estadoCivil;

    this.customerService.create(customer).subscribe(
      customer => this.actionsForSuccess(customer),
      error => this.actionsForError(error)
    )
  }

  private updateCustomer() {
    const customer: Customer = Object.assign(new Customer(), this.customerForm.value);
    customer.sexo = +customer.sexo;
    customer.estadoCivil = +customer.estadoCivil;

    this.customerService.update(customer).subscribe(
      customer => this.actionsForSuccess(customer),
      error => this.actionsForError(error)
    )
  }

  private actionsForSuccess(customer: Customer) {
    toastr.success('Solicitação processada com sucesso!');
    this.router.navigate(['customers']);
  }

  private actionsForError(error: any) {
    toastr.error('Ocorreu um erro ao processar a sua solicitação');

    this.submittingForm = false;

    if (error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde'];
  }
}
