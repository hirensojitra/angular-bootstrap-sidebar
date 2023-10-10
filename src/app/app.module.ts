import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularBootstrapSidebar } from 'projects/angular-bootstrap-sidebar/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularBootstrapSidebar
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
