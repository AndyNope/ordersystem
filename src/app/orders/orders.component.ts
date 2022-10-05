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
  constructor(
    private orderService: OrderService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getOrders();
    setInterval(() => {
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

  getOrders() {
    this.orderService.getOrders().subscribe(
      response => {
        for (const order of response.body) {
          order.json = JSON.parse(order.json);
        }
        this.orders = JSON.parse(JSON.stringify(response.body));
        // // console.log(response.body);
        // for (const order of this.orders) {
        //   // console.log(order);
        //   for (const article of order.json.articles) {
        //     // console.log(article.name);

        //   }
        // }
        if (this.counter === 0) {
          this.counter = this.orders.lenght;
        }
        this.cdRef.detectChanges();
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

}
