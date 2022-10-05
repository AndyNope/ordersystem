import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HomeService } from './home.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isLocalhost = window.location.hostname === 'localhost'
  select = Array(100);
  reactiveForm: FormGroup;
  options: any;

  constructor(
    private formBuilder: FormBuilder,
    private homeService: HomeService,
    private snackBar: MatSnackBar
  ) {
    this.reactiveForm = this.formBuilder.group({
      articles: this.formBuilder.array([]),
      total: new FormControl(0)
    });
  }

  initForm() {
    this.reactiveForm = this.formBuilder.group({
      articles: this.formBuilder.array([]),
      total: new FormControl(0)
    });
  }

  ngOnInit(): void {
    this.addQuantity();
    this.getAutocomplete();
  }

  getAutocomplete() {
    this.homeService.getAutocomplete().subscribe(
      response => {
        this.options = response.body;
      }
    );

  }

  getArticles(): FormArray {
    return this.reactiveForm.get("articles") as FormArray
  }

  newQuantity(): FormGroup {
    return this.formBuilder.group({
      quantity: 0,
      name: '',
      price: 0,
      total: 0,
    })
  }

  getTotalPrice(): number {
    let total = 0;
    for (const article of this.reactiveForm.get("articles")?.value) {
      total += article.quantity * article.price;
    }
    return total;
  }

  addQuantity() {
    this.getArticles().push(this.newQuantity());
  }

  removeQuantity(i: number) {
    this.getArticles().removeAt(i);
  }

  setTotal(index: number, value: any) {
    this.getArticles().at(index).value.total = value;
  }

  textIsEmpty(): boolean {
    let isEmtpy = false;
    for (const article of this.reactiveForm.get("articles")?.value) {
      if (article.name === '') {
        isEmtpy = true;
      }
    }
    return isEmtpy;
  }

  onSubmit() {
    this.reactiveForm.get('total')?.setValue(this.getTotalPrice());

    this.homeService.setOrder(this.reactiveForm.value).subscribe(response => { });
    for (const article of this.getArticles().value) {
      this.homeService.setAutocomplete(article.name).subscribe(response => { });
    }
    this.snackBar.open('Bestellung wurde aufgegeben!', undefined, {
      duration: 2000,
      horizontalPosition: 'right'
    });
    this.initForm();
    this.addQuantity();
  }
}
