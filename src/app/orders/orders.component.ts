import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from './order.service';
import {count} from "rxjs";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: any = [];
  stornos: any;
  counter = 0;
  stornoCounter = 0;
  revenue = 0;
  loading = false;
  mute = false;
  constructor(
    private orderService: OrderService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getScreenLock();
    this.getOrders();
    this.getStornos();
    this.getNotCanceledOrders();
    setInterval(() => {
      this.getNotCanceledOrders();
      this.getOrders();
      this.getStornos();
    }, 30000);
  }

  playNotificationSound(){
      let audio = new Audio();
      audio.src = "../../../assets/sound/notification.mp3";
      audio.load();
      audio.play();
  }

  playErrorSound(){
      let audio = new Audio();
      audio.src = "../../../assets/sound/error.mp3";
      audio.load();
      audio.play();
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

  getNotCanceledOrders() {
    this.revenue = 0;
    this.orderService.getNotCanceledOrders().subscribe(
      response => {
        for (const order of response.body) {
          order.json = JSON.parse(order.json);
        }
        const orders = JSON.parse(JSON.stringify(response.body));
        for (const order of orders) {
          for (const article of order.json.articles) {
            this.revenue += (article.quantity * article.price);
          }
        }
        this.cdRef.detectChanges();
      }
    );
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

  getOrders() {
    this.loading = true;
    this.orderService.getOrders().subscribe(
      response => {

        this.loading = false;
        for (const order of response.body) {
          order.json = JSON.parse(order.json);
        }

        let newOrders = [];
        newOrders = JSON.parse(JSON.stringify(response.body));

        if (newOrders.length > this.counter) {
          this.snackBar.open('Neue Bestellung ist angekommen!', undefined, {
            duration: 2000,
            horizontalPosition: 'right'
          });
          this.playNotificationSound();
          this.counter = newOrders.length;
        }

        this.orders = JSON.parse(JSON.stringify(response.body));
        let countOrders = this.orders.length;
        for (countOrders -= 2; countOrders > -1; countOrders -= 1)
        {
          this.orders.push(this.orders[countOrders]);
          this.orders.splice(countOrders, 1);
        }
        if (this.counter === 0) {
          this.counter = this.orders.length;
        }
        this.cdRef.detectChanges();
      }
    );
  }

  getStornos() {
    this.orderService.getCanceledOrders().subscribe(
      response => {
        let countStornos = 0;

        for (const order of response.body) {
          order.json = JSON.parse(order.json);
        }
        let newStornos = [];
        newStornos = JSON.parse(JSON.stringify(response.body));
        for (let storno of newStornos){
          if(this.getDurationInt(storno.created) <= 5){
            countStornos++;
          }
        }
        if (countStornos > this.stornoCounter) {
          this.snackBar.open('Bestellung wurde storniert!', undefined, {
            duration: 2000,
            horizontalPosition: 'right'
          });
          this.playErrorSound();
        }
        this.stornoCounter = countStornos;
        this.stornos = JSON.parse(JSON.stringify(response.body));
        this.cdRef.detectChanges();
      }
    );
  }

  getTotalPrice(articles: any): number {
    let total = 0;
    for (const article of articles) {
      total += article.quantity * article.price;
    }
    return total;
  }

  cancelOrder(id: number) {
    this.orderService.cancelOrder(id).subscribe(
      res => {
        this.getOrders();
        this.getStornos();
        this.getNotCanceledOrders();
        this.snackBar.open('Bestellung wurde storniert!', undefined, {
          duration: 2000,
          horizontalPosition: 'right'
        });
        this.counter--;
      }
    );
  }

  async getScreenLock() {
    let screenLock;
    try {
      screenLock = await navigator.wakeLock.request('screen');
    } catch (err: any) {
      console.log(err.name, err.message);
    }
    return screenLock;
  }

  terminateOrder(id: number) {
    this.orderService.terminateOrder(id).subscribe(
      res => {
        this.getOrders();
        this.snackBar.open('Bestellung wurde abgehakt!', undefined, {
          duration: 2000,
          horizontalPosition: 'right'
        });
        this.counter--;
      }
    );
  }

}
