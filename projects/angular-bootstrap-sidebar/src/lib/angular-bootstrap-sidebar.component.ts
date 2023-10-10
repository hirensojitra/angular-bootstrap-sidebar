import { HostListener, Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ABSService } from './angular-bootstrap-sidebar.service';
export interface MenuItem {
  label: string;
  icon?: string;
  link?: string;
  title?: string;
  subItems?: MenuItem[];
}
@Component({
  selector: 'abs',
  templateUrl: './angular-bootstrap-sidebar.component.html',
  styleUrls: ['./angular-bootstrap-sidebar.component.scss',]
})
export class ABSComponent implements OnInit {
  @Input() menuData: any;
  @Input() menuActive: any;
  @Input() menuHover: any;
  public menuStatus = false;
  public menuDir = 'ltr';
  private menuStatusSubscription!: Subscription;
  private dirSubscription!: Subscription;
  constructor(public bootstrapAngularSidebarService: ABSService) {
    this.bootstrapAngularSidebarService.getMenuStatus().subscribe((status) => {
      this.menuStatus = status;
    });
    this.bootstrapAngularSidebarService.getDir().subscribe((dir) => {
      this.menuDir = dir;
    });
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.shiftKey && event.key === 'S') {
      event.preventDefault();
      this.bootstrapAngularSidebarService.toggleMenu();
    }
  }
  ngOnInit(): void {
    this.menuStatusSubscription = this.bootstrapAngularSidebarService.getMenuStatus().subscribe((status) => {
      this.menuStatus = status;
      if (status) {
        document.body.classList.add('menu-open');
      } else {
        document.body.classList.remove('menu-open');
      }
    });

    this.dirSubscription = this.bootstrapAngularSidebarService.getDir().subscribe((dir) => {
      if (dir === '') {
        document.documentElement.setAttribute('dir', 'ltr');
      }
      dir = dir || 'ltr';
      this.menuDir = dir;
    });
    this.menuActive ? this.bootstrapAngularSidebarService.toggleMenu() : null;

    // Emit the menuData array as a single value
    // this.dataSetSubject.next(this.menuData);

    // Subscribe to changes in menuData using dataSetSubject
    // this.dataSetSubject.subscribe((newMenuData: MenuItem[]) => {
    //   // Perform actions when menuData changes
    //   console.log('Menu data has changed:', newMenuData);
    //   // You can update the sidebar based on the new menuData here
    // });
  }
}
