import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from '../orders/order.service';
import { HomeService } from './home.service';
import {forceAutocomplete} from "@angular/cli/src/utilities/environment-options";
import {observeNotification} from "rxjs/internal/Notification";


interface MenuOption {
  id: number;
  name: string;
  type: number;
  price: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  toggleMe = false;
  isLocalhost = window.location.hostname === 'localhost'
  select = Array(100);
  tables = Array(25);
  reactiveForm: FormGroup;
  options: MenuOption[] = [];
  originalOptions: MenuOption[] = [];
  orders: any;
  myFinishedOrders: any;
  orderId = 0;
  mute = false;
  counter = 0;

  toggleOverview = false;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private homeService: HomeService,
    private orderService: OrderService,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef
  ) {
    this.reactiveForm = this.formBuilder.group({
      articles: this.formBuilder.array([]),
      total: new FormControl(0),
      username: new FormControl(localStorage.getItem('name') !== undefined ? localStorage.getItem('name') : ''),
      table: new FormControl(0)
    });
  }

  ngOnInit(): void {
    this.addQuantity();
    this.getMenu();

    if (localStorage.getItem('name') !== undefined) {
      this.reactiveForm.get('username')?.setValue(localStorage.getItem('name'));
    }
    this.observeMyOrder();
    this.cdRef.detectChanges();
  }

  playThankYouSound(){
    if(!this.mute) {
      let audio = new Audio();
      audio.src = "../../../assets/sound/thankyou.mp3";
      audio.load();
      audio.play();
    }
  }

  playFinishedSound(){
    if(!this.mute) {
      let audio = new Audio();
      audio.src = "../../../assets/sound/finished.mp3";
      audio.load();
      audio.play();
    }
  }


  initForm() {
    this.reactiveForm = this.formBuilder.group({
      articles: this.formBuilder.array([]),
      total: new FormControl(0),
      username: new FormControl(localStorage.getItem('name') !== undefined ? localStorage.getItem('name') : ''),
      table: new FormControl(0)
    });
  }

  getUsernameTyped(): string {
    return this.reactiveForm.value.username;
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

  getMenu() {
    this.homeService.getMenu().subscribe(
      response => {
        this.options = response.body;
        this.originalOptions = response.body;
      }
    );

  }

  setUsername(event: any) {
    localStorage.setItem('name', event.target.value);
  }

  getArticles(): FormArray {
    return this.reactiveForm.get("articles") as FormArray
  }

  newQuantity(): FormGroup {
    return this.formBuilder.group({
      quantity: 1,
      name: '',
      price: 0,
      type:0,
      noCream: false,
      lactoseFree: false,
      total: 0,
    })
  }

  setTable(table: number) {
    this.reactiveForm.get('table')?.setValue(table);
  }

  getTotalPrice(): number {
    let total = 0;
    for (const article of this.reactiveForm.get("articles")?.value) {
      total += article.quantity * article.price;
    }
    return total;
  }

  getTotalQuantity(): number {
    let total = 0;
    for (const article of this.reactiveForm.get("articles")?.value) {
      total += article.quantity;
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
      this.homeService.setMenu(article.name).subscribe(response => {
        this.getMenu();
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
    this.setTable((json.table !== undefined ? json.table : 0));
    this.toggleOverview = false;
  }

  reuseOrder(json: any): void {
    this.initForm();
    for (const article of json.articles) {
      this.getArticles().push(this.formBuilder.group(article));
    }
    this.setTable((json.table !== undefined ? json.table : 0));
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

  removeMenu(id: number) {
    this.homeService.removeMenu(id).subscribe(response => {
      this.getMenu();
    });
  }

  onSubmit() {
    this.reactiveForm.get('total')?.setValue(this.getTotalPrice());
    if (this.orderId > 0) {
      this.homeService.editOrder(this.reactiveForm.value, this.orderId).subscribe(response => {
        this.initForm();
        this.addQuantity();
        this.getMenu();
        this.setTable(0);
        this.orderId = 0;
      });
      for (const article of this.getArticles().value) {
        this.homeService.setMenu(article.name).subscribe(response => { });
      }
      this.snackBar.open('Bestellung wurde bearbeitet!', undefined, {
        duration: 2000,
        horizontalPosition: 'right'
      });
    } else {
      this.homeService.setOrder(this.reactiveForm.value).subscribe(response => {
        this.initForm();
        this.addQuantity();
        this.getMenu();
        this.setTable(0);
        this.orderId = 0;
      });
      for (const article of this.getArticles().value) {
        this.homeService.setMenu(article.name).subscribe(response => { });
      }
      this.snackBar.open('Bestellung wurde aufgegeben!', undefined, {
        duration: 2000,
        horizontalPosition: 'right'
      });
      this.playThankYouSound();
    }
  }

  observeMyOrder(){

    setInterval(() => {
      this.orderService.getOldOrders().subscribe(
        response => {
          let countNewOrders = 0;
          for (const order of response.body) {
            order.json = JSON.parse(order.json);
          }
          for (const order of response.body){
            if(this.getDurationInt(order.created) < 5 && this.getUsernameTyped() === order.json.username){
              this.myFinishedOrders.push(order);
              countNewOrders++;
            }
          }
          if(countNewOrders > this.counter){
            this.playFinishedSound();
          }
          this.counter = countNewOrders;
        }
      );
    }, 10000);
  }

  setOrder(index:number, option: any) {
    this.getArticles().at(index).get('name')?.setValue(option.name);
    this.getArticles().at(index).get('price')?.setValue(option.price );
    this.getArticles().at(index).get('type')?.setValue(option.type);
    this.setTotal(index, option.price);
  }

  filterOptions(i: number) {
    this.loading = true;
    this.options = Array();
    if(i === 0) return;
    for (const op  of this.originalOptions) {
      if(op.type === i) {
        this.options.push(op);
      }
    }
    this.loading = false;
    this.cdRef.detectChanges();
    this.cdRef.markForCheck();
  }

  getMyFinishedOrders() {
    this.orderService.getOldOrders().subscribe(
      response => {
        let newOrderlist = [];
        for (const order of response.body) {
          order.json = JSON.parse(order.json);
        }
        for (const order of response.body){
          if(this.getDurationInt(order.created) < 10 && this.getUsernameTyped() === order.json.username){
            newOrderlist.push(order)
          }
        }

        this.orders = newOrderlist;
      }
    );
    this.orders = this.myFinishedOrders;
  }
}
