import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from './order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: any;
  counter = 0;
  revenue = 0;
  constructor(
    private orderService: OrderService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getOrders();
    this.getNotCanceledOrders();
    setInterval(() => {
      this.getNotCanceledOrders();
      this.getOrders();
      if (this.counter < this.orders.lenght) {
        this.snackBar.open('Neue Bestellung ist angekommen!', undefined, {
          duration: 2000,
          horizontalPosition: 'right'
        });
        this.counter = this.orders.lenght;
      }
    }, 30000);
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
    this.orderService.getOrders().subscribe(
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
    this.orderService.getOrders().subscribe(
      response => {
        for (const order of response.body) {
          order.json = JSON.parse(order.json);
        }
        this.orders = JSON.parse(JSON.stringify(response.body));
        if (this.counter === 0) {
          this.counter = this.orders.lenght;
        }
        this.cdRef.detectChanges();
      }
    );
  }

  getTotalPrice(articles: any): number {
    let total = 0;
    for (const article of articles ) {
      total += article.quantity * article.price;
    }
    return total;
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

}
