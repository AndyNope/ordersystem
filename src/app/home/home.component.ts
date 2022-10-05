import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from '../orders/order.service';
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
  orders: any;
  orderId = 0;

  toggleOverview = false;

  constructor(
    private formBuilder: FormBuilder,
    private homeService: HomeService,
    private orderService: OrderService,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef
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

  getDuration(date: Date): string {
    const eventStartTime = new Date(date);
    const eventEndTime = new Date();
    return this.millisToMinutes(eventEndTime.valueOf() - eventStartTime.valueOf());
  }

  getDurationInt(date: Date): number {
    const eventStartTime = new Date(date);
    const eventEndTime = new Date();
    return this.millisToMinutesInt(eventEndTime.valueOf() - eventStartTime.valueOf());
  }

  millisToMinutesAndSeconds(millis: number) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}min ${+seconds < 10 ? '0' : ''}${seconds}sek`;
  }
  millisToMinutes(millis: number) {
    const minutes = Math.floor(millis / 60000);
    return `${minutes}min`;
  }
  millisToMinutesInt(millis: number) {
    return Math.floor(millis / 60000);
  }
  ngOnInit(): void {
    this.addQuantity();
    this.getAutocomplete();
    this.cdRef.detectChanges();
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

  getTotalPriceByArticles(articles: any): number {
    let total = 0;
    for (const article of articles) {
      total += article.quantity * article.price;
    }
    return total;
  }

  addQuantity() {
    this.getArticles().push(this.newQuantity());
    for (const article of this.getArticles().value) {
      console.log(article);

      this.homeService.setAutocomplete(article.name).subscribe(response => {
        this.getAutocomplete();
      });
    }
  }

  removeQuantity(i: number) {
    this.getArticles().removeAt(i);
  }

  setTotal(index: number, value: any) {
    this.getArticles().at(index).value.total = value;
  }


  editOrder(id: number, json: any): void {
    this.orderId = id;
    this.initForm();
    for (const article of json.articles) {
      this.getArticles().push(this.formBuilder.group(article));
    }
    this.toggleOverview = false;
  }

  reuseOrder(json: any): void {
    this.initForm();
    for (const article of json.articles) {
      this.getArticles().push(this.formBuilder.group(article));
    }
    this.toggleOverview = false;
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

  getOrders() {
    this.orderService.getOrders().subscribe(
      response => {
        for (const order of response.body) {
          order.json = JSON.parse(order.json);
        }
        this.orders = JSON.parse(JSON.stringify(response.body));

      }
    );
  }

  getOldOrders() {
    this.orderService.getOldOrders().subscribe(
      response => {
        for (const order of response.body) {
          order.json = JSON.parse(order.json);
        }
        this.orders = JSON.parse(JSON.stringify(response.body));

      }
    );
  }

  getCanceledOrders() {
    this.orderService.getCanceledOrders().subscribe(
      response => {
        for (const order of response.body) {
          order.json = JSON.parse(order.json);
        }
        this.orders = JSON.parse(JSON.stringify(response.body));

      }
    );
  }

  cancelOrder(id: number) {
    this.orderService.cancelOrder(id).subscribe(
      res => {
        this.getOrders();
        this.snackBar.open('Bestellung wurde storniert!', undefined, {
          duration: 2000,
          horizontalPosition: 'right'
        });
      }
    );
  }

  terminateOrder(id: number) {
    this.orderService.terminateOrder(id).subscribe(
      res => {
        this.getOrders();
        this.snackBar.open('Bestellung wurde abgehakt!', undefined, {
          duration: 2000,
          horizontalPosition: 'right'
        });
      }
    );
  }

  removeAutocomplete(id: number) {
    this.homeService.removeAutocomplete(id).subscribe(response => {
      this.getAutocomplete();
    });
  }

  onSubmit() {
    this.reactiveForm.get('total')?.setValue(this.getTotalPrice());
    if (this.orderId > 0) {
      this.homeService.editOrder(this.reactiveForm.value, this.orderId).subscribe(response => { });
      for (const article of this.getArticles().value) {
        this.homeService.setAutocomplete(article.name).subscribe(response => { });
      }
      this.snackBar.open('Bestellung wurde aufgegeben!', undefined, {
        duration: 2000,
        horizontalPosition: 'right'
      });
    } else {
      this.homeService.setOrder(this.reactiveForm.value).subscribe(response => { });
      for (const article of this.getArticles().value) {
        this.homeService.setAutocomplete(article.name).subscribe(response => { });
      }
      this.snackBar.open('Bestellung wurde aufgegeben!', undefined, {
        duration: 2000,
        horizontalPosition: 'right'
      });
    }
    this.initForm();
    this.addQuantity();
    this.getAutocomplete();
    this.orderId = 0;
  }
}
