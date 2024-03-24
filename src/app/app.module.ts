import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { OrdersComponent } from './orders/orders.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SpacePipe } from './space.pipe';
import { HomeService } from './home/home.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MenuComponent } from './menu/menu.component';
import { OrderService } from './orders/order.service';
import { MenuService } from './menu/menu.service';
import {MatIconModule} from "@angular/material/icon";
import localeDe from '@angular/common/locales/de-CH';
import {registerLocaleData} from "@angular/common";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
registerLocaleData(localeDe);


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    OrdersComponent,
    SpacePipe,
    MenuComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatSnackBarModule,
        FormsModule,
        MatDividerModule,
        MatAutocompleteModule,
        MatMenuModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatChipsModule,
        MatSlideToggleModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
  providers: [
    HomeService,
    MatSnackBarModule,
    OrderService,
    MenuService,
    { provide: LOCALE_ID, useValue: 'de-CH'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
