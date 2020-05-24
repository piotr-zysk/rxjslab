import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TypeAheadComponent } from './type-ahead/type-ahead.component';

@NgModule({
  declarations: [
    AppComponent,
    TypeAheadComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
