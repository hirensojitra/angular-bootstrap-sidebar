import { EventEmitter, Output, Renderer2 } from '@angular/core';
import { ElementRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { Input } from '@angular/core';
import { Directive } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
export interface MenuItem {
  label: string;
  icon?: string;
  link?: string;
  title?: string;
  subItems?: MenuItem[];
}
@Directive({
  selector: '[sidebarMenu]'
})
export class ABSDirective implements OnInit, AfterViewInit{
  private isMenuActive: boolean = false;
  private isMenuHover: boolean = false;
  private menuDataSubject = new Subject<MenuItem[]>();
  private menuActiveSubject = new Subject<boolean>();
  private menuHoverSubject = new Subject<boolean>();

  @Input() set menuActive(value: boolean) {
    this.menuActiveSubject.next(value);
  }

  @Input() set menuHover(value: boolean) {
    this.menuHoverSubject.next(value);
  }

  @Input() set menuData(value: MenuItem[]) {
    this.menuDataSubject.next(value);
  }
  @Output() menuActiveChange = new EventEmitter<boolean>();
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router
  ) {
    this.menuActiveSubject.subscribe((isMenuActive: boolean) => {
      this.handleMenuActiveChange(isMenuActive);
      this.updateSidebarVisibility();
      this.toggleMenuOpenClass(isMenuActive);
      this.checkActive(this.isMenuActive);
    })
    this.menuHoverSubject.subscribe((isMenuHover: boolean) => {
      this.handleMenuHoverChange(isMenuHover);
    })
    this.menuDataSubject.subscribe((menuData: MenuItem[]) => {
      this.createSidebar(menuData);
      this.checkActive(this.isMenuActive)
    });
  }
  private handleMenuActiveChange(isMenuActive: boolean) {
    this.isMenuActive = isMenuActive;
  }
  private handleMenuHoverChange(isMenuHover: boolean) {
    this.isMenuHover = isMenuHover;
    // Handle any logic when menuHover changes
  }
  private toggleMenuOpenClass(isActive: boolean) {
    if (isActive) {
      this.el.nativeElement.classList.add('menu-open');
    } else {
      this.el.nativeElement.classList.remove('menu-open');
    }
  }
  private findSiblingListItems(el: HTMLElement, className: string) {
    let items = (el.parentElement) ? (Array.from(el.parentElement.children) as HTMLElement[]).filter(child => child !== el && child.classList.contains(className)) : null;
    return items ? items.forEach(siblingLi => {
      const siblingLiElement = siblingLi as HTMLElement;
      const submenuOfSiblingUls = siblingLiElement.querySelectorAll('ul');
      submenuOfSiblingUls.forEach(submenu => {
        if (submenu instanceof HTMLElement) {
          submenu.classList.add('collapse');
        }
      });
      const aElements = siblingLiElement.querySelectorAll('a.clicked');
      aElements.forEach(a => {
        a.classList.remove('clicked');
      });
    }) : false;
  }
  private updateSidebarVisibility() {
    const submenuElements = this.el.nativeElement.querySelectorAll('.submenu');
    const clickedElements = this.el.nativeElement.querySelectorAll('.clicked');
    let parentElement = this.el.nativeElement.parentElement;
    while (parentElement) {
      if (parentElement.classList.contains('sidebar')) {
        break;
      }
      parentElement = parentElement.parentElement;
    }
    submenuElements.forEach((ul: HTMLElement) => {
      ul.classList.add('collapse')
      if (this.isMenuActive) {
        parentElement.classList.add('menu-open')
      } else {
        parentElement.classList.remove('menu-open')
      }
    });
    clickedElements.forEach((a: HTMLElement) => {
      a.classList.remove('clicked')
    });

    const closeMenu = this.el.nativeElement.querySelector('.close-menu');
    closeMenu?.remove();
  }
  private checkActive(activate?: any) {
    const navLink = this.el.nativeElement.querySelectorAll('.nav-link');
    navLink.forEach((a: HTMLElement) => {
      const href = a.getAttribute('href')?.toString();
      if (href) {
        let link = href.split('/').filter(value => value !== "");
        link = link.map(value => {
          const indexOfSpecialChar = value.search(/[^\w\s-]/gi);
          if (indexOfSpecialChar !== -1) {
            return value.substring(0, indexOfSpecialChar);
          }
          return value;
        });

        let currentLink = this.router.url.split('/').filter(value => value !== "");
        currentLink = currentLink.map(value => {
          const indexOfSpecialChar = value.search(/[^\w\s-]/gi);
          if (indexOfSpecialChar !== -1) {
            return value.substring(0, indexOfSpecialChar);
          }
          return value;
        });

        const minLength = Math.min(link.length, currentLink.length);
        currentLink = currentLink.slice(0, minLength);
        const areIdentical = JSON.stringify(link) === JSON.stringify(currentLink);
        if (areIdentical) {
          a.classList.add('active');
          if (activate) {
            const parentUl = a.closest('ul');
            if (parentUl) {
              parentUl.classList.remove('collapse');
            }
          }
        } else {
          a.classList.remove('active');
        }
      }
    });
  }
  private createSidebar(menuData: MenuItem[], parentElement?: any) {
    const ul = this.renderer.createElement('ul');
    menuData.forEach((menuItem: MenuItem) => {
      const li = this.renderer.createElement('li');
      const a = this.renderer.createElement('a');
      li.classList.add('nav-item');
      this.renderer.setAttribute(a, 'href', menuItem.link!);
      if (this.router.url.includes(menuItem.link!)) {
        a.classList.add('active')
      }
      a.setAttribute('routerLinkActive', 'current');
      a.classList.add('nav-link', 'text-nowrap', 'link');
      const menuItemSpan = this.renderer.createElement('span');
      this.renderer.appendChild(menuItemSpan, this.renderer.createText(menuItem.label));

      if (menuItem.icon) {
        const menuItemIcon = this.renderer.createElement('i');
        this.renderer.addClass(menuItemSpan, 'ms-3');
        this.renderer.addClass(menuItemIcon, 'fa');
        this.renderer.addClass(menuItemIcon, menuItem.icon);
        this.renderer.appendChild(a, menuItemIcon);
      }

      this.renderer.appendChild(a, menuItemSpan);

      this.renderer.appendChild(li, a);
      if (menuItem.subItems && menuItem.subItems.length > 0) {
        const arrow = this.renderer.createElement('i');
        arrow.classList.add('fa', 'fa-angle-down', 'control-arrow');
        this.renderer.appendChild(a, arrow);
        a.addEventListener('click', (event: Event) => {
          event.preventDefault();
          const submenuElement = li.querySelector('ul');
          submenuElement.classList.toggle('collapse');
          const closeMenu = this.el.nativeElement.querySelector('.close-menu');
          if (!submenuElement.classList.contains('collapse')) {
            a.classList.add('clicked');
            closeMenu ? closeMenu.remove() : null;
            const closeMenuAdd = this.renderer.createElement('div');
            closeMenuAdd.addEventListener('click', () => {
              const toggleLiSubmenu = li.querySelectorAll('ul');
              toggleLiSubmenu.forEach((submenu: HTMLElement) => {
                if (submenu instanceof HTMLElement) {
                  submenu.classList.add('collapse');
                }
              });
              this.updateSidebarVisibility();
              closeMenuAdd.remove();
            })
            closeMenuAdd.classList.add('close-menu');
            this.renderer.appendChild(this.el.nativeElement, closeMenuAdd);
            this.findSiblingListItems(li, 'has-submenu');
          } else {
            a.classList.remove('clicked');
            const toggleLiSubmenu = li.querySelectorAll('ul');
            toggleLiSubmenu.forEach((submenu: HTMLElement) => {
              if (submenu instanceof HTMLElement) {
                submenu.classList.add('collapse');
              }
            });
          }
          return false;
        });
        console.log(this.isMenuActive)
        a.addEventListener('mouseenter', (event: Event) => {
          console.log(this.isMenuActive, this.isMenuHover);
          if (!this.isMenuActive && this.isMenuHover) {
            const submenuElement = li.querySelector('ul');
            submenuElement.classList.toggle('collapse');
            const closeMenu = this.el.nativeElement.querySelector('.close-menu');
            if (!submenuElement.classList.contains('collapse')) {
              a.classList.add('clicked');
              closeMenu ? closeMenu.remove() : null;
              const closeMenuAdd = this.renderer.createElement('div');
              closeMenuAdd.addEventListener('mouseenter', () => {
                const toggleLiSubmenu = li.querySelectorAll('ul');
                toggleLiSubmenu.forEach((submenu: HTMLElement) => {
                  if (submenu instanceof HTMLElement) {
                    submenu.classList.add('collapse');
                  }
                });
                this.updateSidebarVisibility();
                closeMenuAdd.remove();
              })
              closeMenuAdd.classList.add('close-menu');
              this.renderer.appendChild(this.el.nativeElement, closeMenuAdd);
              this.findSiblingListItems(li, 'has-submenu');
            } else {
              a.classList.remove('clicked');
              const toggleLiSubmenu = li.querySelectorAll('ul');
              toggleLiSubmenu.forEach((submenu: HTMLElement) => {
                if (submenu instanceof HTMLElement) {
                  submenu.classList.add('collapse');
                }
              });
            }
          }
          return false;
        })
        this.createSidebar(menuItem.subItems, li);
        li.classList.add('has-submenu');
      }
      else {
        a.addEventListener('mouseenter', (event: Event) => {
          !this.isMenuActive && this.isMenuHover ? this.findSiblingListItems(li, 'has-submenu') : null;
        })
        a.addEventListener('click', (event: Event) => {
          event.preventDefault();
          // Find siblings of the parent li and remove 'clicked' class
          const parentLi = a.parentElement as HTMLElement;
          const siblings = Array.from(parentLi.parentElement?.children || []) as HTMLElement[];
          siblings.forEach(sibling => {
            if (sibling !== parentLi) {
              const siblingLink = sibling.querySelector('a');
              if (siblingLink) {
                siblingLink.classList.remove('active');
              }
            }
          });
          this.findSiblingListItems(li, 'has-submenu');
          const link = menuItem.link!;
          setTimeout(() => {
            this.router.navigate([link]).then(() => {
              this.checkActive();
            });
            !this.isMenuActive ? this.updateSidebarVisibility() : null;
            a.classList.add('active')
          }, 200);
        });
      }
      this.renderer.appendChild(ul, li);
    });
    const container = parentElement || this.el.nativeElement;
    this.renderer.appendChild(container, ul);
    if (!parentElement) {
      this.el.nativeElement.innerHTML = '';
      const sidebar = this.renderer.createElement('nav');
      this.renderer.appendChild(sidebar, ul);
      ul.classList.add('nav', 'flex-column', 'align-items-start');
      this.renderer.appendChild(this.el.nativeElement, sidebar);
    } else {
      ul.classList.add('submenu', 'list-unstyled', 'collapse');
    }
  }
  ngOnInit() {
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkActive(this.isMenuActive);
      }
    });    
  }
  ngAfterViewInit(): void {
  }
}
