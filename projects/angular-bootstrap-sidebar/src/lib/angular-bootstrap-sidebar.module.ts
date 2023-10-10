import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ABSComponent } from './angular-bootstrap-sidebar.component';
import { ABSDirective } from './angular-bootstrap-sidebar.directive';

@NgModule({
  declarations: [
    ABSComponent,
    ABSDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ABSComponent
  ]
})
export class AngularBootstrapSidebar { }
