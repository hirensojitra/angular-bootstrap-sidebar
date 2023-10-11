import { EventEmitter, Output } from '@angular/core';
import { Input } from '@angular/core';
import { Directive } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
export class ABSDirective {
    set menuActive(value) {
        this.menuActiveSubject.next(value);
    }
    set menuHover(value) {
        this.menuHoverSubject.next(value);
    }
    set menuData(value) {
        this.menuDataSubject.next(value);
    }
    constructor(el, renderer, router) {
        this.el = el;
        this.renderer = renderer;
        this.router = router;
        this.isMenuActive = false;
        this.isMenuHover = false;
        this.menuDataSubject = new Subject();
        this.menuActiveSubject = new Subject();
        this.menuHoverSubject = new Subject();
        this.menuActiveChange = new EventEmitter();
        this.menuActiveSubject.subscribe((isMenuActive) => {
            this.handleMenuActiveChange(isMenuActive);
            this.updateSidebarVisibility();
            this.toggleMenuOpenClass(isMenuActive);
            this.checkActive(this.isMenuActive);
        });
        this.menuHoverSubject.subscribe((isMenuHover) => {
            this.handleMenuHoverChange(isMenuHover);
        });
        this.menuDataSubject.subscribe((menuData) => {
            this.createSidebar(menuData);
            this.checkActive(this.isMenuActive);
        });
    }
    handleMenuActiveChange(isMenuActive) {
        this.isMenuActive = isMenuActive;
    }
    handleMenuHoverChange(isMenuHover) {
        this.isMenuHover = isMenuHover;
        // Handle any logic when menuHover changes
    }
    toggleMenuOpenClass(isActive) {
        if (isActive) {
            this.el.nativeElement.classList.add('menu-open');
        }
        else {
            this.el.nativeElement.classList.remove('menu-open');
        }
    }
    findSiblingListItems(el, className) {
        let items = (el.parentElement) ? Array.from(el.parentElement.children).filter(child => child !== el && child.classList.contains(className)) : null;
        return items ? items.forEach(siblingLi => {
            const siblingLiElement = siblingLi;
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
    updateSidebarVisibility() {
        const submenuElements = this.el.nativeElement.querySelectorAll('.submenu');
        const clickedElements = this.el.nativeElement.querySelectorAll('.clicked');
        let parentElement = this.el.nativeElement.parentElement;
        while (parentElement) {
            if (parentElement.classList.contains('sidebar')) {
                break;
            }
            parentElement = parentElement.parentElement;
        }
        submenuElements.forEach((ul) => {
            ul.classList.add('collapse');
            if (this.isMenuActive) {
                parentElement.classList.add('menu-open');
            }
            else {
                parentElement.classList.remove('menu-open');
            }
        });
        clickedElements.forEach((a) => {
            a.classList.remove('clicked');
        });
        const closeMenu = this.el.nativeElement.querySelector('.close-menu');
        closeMenu?.remove();
    }
    checkActive(activate) {
        const navLink = this.el.nativeElement.querySelectorAll('.nav-link');
        navLink.forEach((a) => {
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
                }
                else {
                    a.classList.remove('active');
                }
            }
        });
    }
    createSidebar(menuData, parentElement) {
        const ul = this.renderer.createElement('ul');
        menuData.forEach((menuItem) => {
            const li = this.renderer.createElement('li');
            const a = this.renderer.createElement('a');
            li.classList.add('nav-item');
            this.renderer.setAttribute(a, 'href', menuItem.link);
            if (this.router.url.includes(menuItem.link)) {
                a.classList.add('active');
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
                a.addEventListener('click', (event) => {
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
                            toggleLiSubmenu.forEach((submenu) => {
                                if (submenu instanceof HTMLElement) {
                                    submenu.classList.add('collapse');
                                }
                            });
                            this.updateSidebarVisibility();
                            closeMenuAdd.remove();
                        });
                        closeMenuAdd.classList.add('close-menu');
                        this.renderer.appendChild(this.el.nativeElement, closeMenuAdd);
                        this.findSiblingListItems(li, 'has-submenu');
                    }
                    else {
                        a.classList.remove('clicked');
                        const toggleLiSubmenu = li.querySelectorAll('ul');
                        toggleLiSubmenu.forEach((submenu) => {
                            if (submenu instanceof HTMLElement) {
                                submenu.classList.add('collapse');
                            }
                        });
                    }
                    return false;
                });
                console.log(this.isMenuActive);
                a.addEventListener('mouseenter', (event) => {
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
                                toggleLiSubmenu.forEach((submenu) => {
                                    if (submenu instanceof HTMLElement) {
                                        submenu.classList.add('collapse');
                                    }
                                });
                                this.updateSidebarVisibility();
                                closeMenuAdd.remove();
                            });
                            closeMenuAdd.classList.add('close-menu');
                            this.renderer.appendChild(this.el.nativeElement, closeMenuAdd);
                            this.findSiblingListItems(li, 'has-submenu');
                        }
                        else {
                            a.classList.remove('clicked');
                            const toggleLiSubmenu = li.querySelectorAll('ul');
                            toggleLiSubmenu.forEach((submenu) => {
                                if (submenu instanceof HTMLElement) {
                                    submenu.classList.add('collapse');
                                }
                            });
                        }
                    }
                    return false;
                });
                this.createSidebar(menuItem.subItems, li);
                li.classList.add('has-submenu');
            }
            else {
                a.addEventListener('mouseenter', (event) => {
                    !this.isMenuActive && this.isMenuHover ? this.findSiblingListItems(li, 'has-submenu') : null;
                });
                a.addEventListener('click', (event) => {
                    event.preventDefault();
                    // Find siblings of the parent li and remove 'clicked' class
                    const parentLi = a.parentElement;
                    const siblings = Array.from(parentLi.parentElement?.children || []);
                    siblings.forEach(sibling => {
                        if (sibling !== parentLi) {
                            const siblingLink = sibling.querySelector('a');
                            if (siblingLink) {
                                siblingLink.classList.remove('active');
                            }
                        }
                    });
                    this.findSiblingListItems(li, 'has-submenu');
                    const link = menuItem.link;
                    setTimeout(() => {
                        this.router.navigate([link]).then(() => {
                            this.checkActive();
                        });
                        !this.isMenuActive ? this.updateSidebarVisibility() : null;
                        a.classList.add('active');
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
        }
        else {
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
    ngAfterViewInit() {
    }
}
ABSDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: ABSDirective, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1.Router }], target: i0.ɵɵFactoryTarget.Directive });
ABSDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.10", type: ABSDirective, selector: "[sidebarMenu]", inputs: { menuActive: "menuActive", menuHover: "menuHover", menuData: "menuData" }, outputs: { menuActiveChange: "menuActiveChange" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: ABSDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[sidebarMenu]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1.Router }]; }, propDecorators: { menuActive: [{
                type: Input
            }], menuHover: [{
                type: Input
            }], menuData: [{
                type: Input
            }], menuActiveChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1ib290c3RyYXAtc2lkZWJhci5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWJvb3RzdHJhcC1zaWRlYmFyL3NyYy9saWIvYW5ndWxhci1ib290c3RyYXAtc2lkZWJhci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFJaEUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxhQUFhLEVBQVUsTUFBTSxpQkFBaUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7QUFXL0IsTUFBTSxPQUFPLFlBQVk7SUFPdkIsSUFBYSxVQUFVLENBQUMsS0FBYztRQUNwQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxJQUFhLFNBQVMsQ0FBQyxLQUFjO1FBQ25DLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELElBQWEsUUFBUSxDQUFDLEtBQWlCO1FBQ3JDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxZQUNVLEVBQWMsRUFDZCxRQUFtQixFQUNuQixNQUFjO1FBRmQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQXJCaEIsaUJBQVksR0FBWSxLQUFLLENBQUM7UUFDOUIsZ0JBQVcsR0FBWSxLQUFLLENBQUM7UUFDN0Isb0JBQWUsR0FBRyxJ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QyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNuQyxJQUFJLEtBQUssWUFBWSxhQUFhLEVBQUU7Z0JBQ2xDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ3JDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0QsZUFBZTtJQUNmLENBQUM7OzBHQTlSVSxZQUFZOzhGQUFaLFlBQVk7NEZBQVosWUFBWTtrQkFIeEIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsZUFBZTtpQkFDMUI7OElBUWMsVUFBVTtzQkFBdEIsS0FBSztnQkFJTyxTQUFTO3NCQUFyQixLQUFLO2dCQUlPLFFBQVE7c0JBQXBCLEtBQUs7Z0JBR0ksZ0JBQWdCO3NCQUF6QixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBPdXRwdXQsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBZnRlclZpZXdJbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGlyZWN0aXZlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOYXZpZ2F0aW9uRW5kLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuZXhwb3J0IGludGVyZmFjZSBNZW51SXRlbSB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIGljb24/OiBzdHJpbmc7XG4gIGxpbms/OiBzdHJpbmc7XG4gIHRpdGxlPzogc3RyaW5nO1xuICBzdWJJdGVtcz86IE1lbnVJdGVtW107XG59XG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbc2lkZWJhck1lbnVdJ1xufSlcbmV4cG9ydCBjbGFzcyBBQlNEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXR7XG4gIHByaXZhdGUgaXNNZW51QWN0aXZlOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgaXNNZW51SG92ZXI6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBtZW51RGF0YVN1YmplY3QgPSBuZXcgU3ViamVjdDxNZW51SXRlbVtdPigpO1xuICBwcml2YXRlIG1lbnVBY3RpdmVTdWJqZWN0ID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcbiAgcHJpdmF0ZSBtZW51SG92ZXJTdWJqZWN0ID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcblxuICBASW5wdXQoKSBzZXQgbWVudUFjdGl2ZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMubWVudUFjdGl2ZVN1YmplY3QubmV4dCh2YWx1ZSk7XG4gIH1cblxuICBASW5wdXQoKSBzZXQgbWVudUhvdmVyKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5tZW51SG92ZXJTdWJqZWN0Lm5leHQodmFsdWUpO1xuICB9XG5cbiAgQElucHV0KCkgc2V0IG1lbnVEYXRhKHZhbHVlOiBNZW51SXRlbVtdKSB7XG4gICAgdGhpcy5tZW51RGF0YVN1YmplY3QubmV4dCh2YWx1ZSk7XG4gIH1cbiAgQE91dHB1dCgpIG1lbnVBY3RpdmVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJcbiAgKSB7XG4gICAgdGhpcy5tZW51QWN0aXZlU3ViamVjdC5zdWJzY3JpYmUoKGlzTWVudUFjdGl2ZTogYm9vbGVhbikgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVNZW51QWN0aXZlQ2hhbmdlKGlzTWVudUFjdGl2ZSk7XG4gICAgICB0aGlzLnVwZGF0ZVNpZGViYXJWaXNpYmlsaXR5KCk7XG4gICAgICB0aGlzLnRvZ2dsZU1lbnVPcGVuQ2xhc3MoaXNNZW51QWN0aXZlKTtcbiAgICAgIHRoaXMuY2hlY2tBY3RpdmUodGhpcy5pc01lbnVBY3RpdmUpO1xuICAgIH0pXG4gICAgdGhpcy5tZW51SG92ZXJTdWJqZWN0LnN1YnNjcmliZSgoaXNNZW51SG92ZXI6IGJvb2xlYW4pID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlTWVudUhvdmVyQ2hhbmdlKGlzTWVudUhvdmVyKTtcbiAgICB9KVxuICAgIHRoaXMubWVudURhdGFTdWJqZWN0LnN1YnNjcmliZSgobWVudURhdGE6IE1lbnVJdGVtW10pID0+IHtcbiAgICAgIHRoaXMuY3JlYXRlU2lkZWJhcihtZW51RGF0YSk7XG4gICAgICB0aGlzLmNoZWNrQWN0aXZlKHRoaXMuaXNNZW51QWN0aXZlKVxuICAgIH0pO1xuICB9XG4gIHByaXZhdGUgaGFuZGxlTWVudUFjdGl2ZUNoYW5nZShpc01lbnVBY3RpdmU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmlzTWVudUFjdGl2ZSA9IGlzTWVudUFjdGl2ZTtcbiAgfVxuICBwcml2YXRlIGhhbmRsZU1lbnVIb3ZlckNoYW5nZShpc01lbnVIb3ZlcjogYm9vbGVhbikge1xuICAgIHRoaXMuaXNNZW51SG92ZXIgPSBpc01lbnVIb3ZlcjtcbiAgICAvLyBIYW5kbGUgYW55IGxvZ2ljIHdoZW4gbWVudUhvdmVyIGNoYW5nZXNcbiAgfVxuICBwcml2YXRlIHRvZ2dsZU1lbnVPcGVuQ2xhc3MoaXNBY3RpdmU6IGJvb2xlYW4pIHtcbiAgICBpZiAoaXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtZW51LW9wZW4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21lbnUtb3BlbicpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIGZpbmRTaWJsaW5nTGlzdEl0ZW1zKGVsOiBIVE1MRWxlbWVudCwgY2xhc3NOYW1lOiBzdHJpbmcpIHtcbiAgICBsZXQgaXRlbXMgPSAoZWwucGFyZW50RWxlbWVudCkgPyAoQXJyYXkuZnJvbShlbC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuKSBhcyBIVE1MRWxlbWVudFtdKS5maWx0ZXIoY2hpbGQgPT4gY2hpbGQgIT09IGVsICYmIGNoaWxkLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKSA6IG51bGw7XG4gICAgcmV0dXJuIGl0ZW1zID8gaXRlbXMuZm9yRWFjaChzaWJsaW5nTGkgPT4ge1xuICAgICAgY29uc3Qgc2libGluZ0xpRWxlbWVudCA9IHNpYmxpbmdMaSBhcyBIVE1MRWxlbWVudDtcbiAgICAgIGNvbnN0IHN1Ym1lbnVPZlNpYmxpbmdVbHMgPSBzaWJsaW5nTGlFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3VsJyk7XG4gICAgICBzdWJtZW51T2ZTaWJsaW5nVWxzLmZvckVhY2goc3VibWVudSA9PiB7XG4gICAgICAgIGlmIChzdWJtZW51IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICBzdWJtZW51LmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgYUVsZW1lbnRzID0gc2libGluZ0xpRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhLmNsaWNrZWQnKTtcbiAgICAgIGFFbGVtZW50cy5mb3JFYWNoKGEgPT4ge1xuICAgICAgICBhLmNsYXNzTGlzdC5yZW1vdmUoJ2NsaWNrZWQnKTtcbiAgICAgIH0pO1xuICAgIH0pIDogZmFsc2U7XG4gIH1cbiAgcHJpdmF0ZSB1cGRhdGVTaWRlYmFyVmlzaWJpbGl0eSgpIHtcbiAgICBjb25zdCBzdWJtZW51RWxlbWVudHMgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnN1Ym1lbnUnKTtcbiAgICBjb25zdCBjbGlja2VkRWxlbWVudHMgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNsaWNrZWQnKTtcbiAgICBsZXQgcGFyZW50RWxlbWVudCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgIHdoaWxlIChwYXJlbnRFbGVtZW50KSB7XG4gICAgICBpZiAocGFyZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3NpZGViYXInKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHBhcmVudEVsZW1lbnQgPSBwYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuICAgIHN1Ym1lbnVFbGVtZW50cy5mb3JFYWNoKCh1bDogSFRNTEVsZW1lbnQpID0+IHtcbiAgICAgIHVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlJylcbiAgICAgIGlmICh0aGlzLmlzTWVudUFjdGl2ZSkge1xuICAgICAgICBwYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21lbnUtb3BlbicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21lbnUtb3BlbicpXG4gICAgICB9XG4gICAgfSk7XG4gICAgY2xpY2tlZEVsZW1lbnRzLmZvckVhY2goKGE6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICBhLmNsYXNzTGlzdC5yZW1vdmUoJ2NsaWNrZWQnKVxuICAgIH0pO1xuXG4gICAgY29uc3QgY2xvc2VNZW51ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbG9zZS1tZW51Jyk7XG4gICAgY2xvc2VNZW51Py5yZW1vdmUoKTtcbiAgfVxuICBwcml2YXRlIGNoZWNrQWN0aXZlKGFjdGl2YXRlPzogYW55KSB7XG4gICAgY29uc3QgbmF2TGluayA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubmF2LWxpbmsnKTtcbiAgICBuYXZMaW5rLmZvckVhY2goKGE6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCBocmVmID0gYS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKT8udG9TdHJpbmcoKTtcbiAgICAgIGlmIChocmVmKSB7XG4gICAgICAgIGxldCBsaW5rID0gaHJlZi5zcGxpdCgnLycpLmZpbHRlcih2YWx1ZSA9PiB2YWx1ZSAhPT0gXCJcIik7XG4gICAgICAgIGxpbmsgPSBsaW5rLm1hcCh2YWx1ZSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5kZXhPZlNwZWNpYWxDaGFyID0gdmFsdWUuc2VhcmNoKC9bXlxcd1xccy1dL2dpKTtcbiAgICAgICAgICBpZiAoaW5kZXhPZlNwZWNpYWxDaGFyICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnN1YnN0cmluZygwLCBpbmRleE9mU3BlY2lhbENoYXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBjdXJyZW50TGluayA9IHRoaXMucm91dGVyLnVybC5zcGxpdCgnLycpLmZpbHRlcih2YWx1ZSA9PiB2YWx1ZSAhPT0gXCJcIik7XG4gICAgICAgIGN1cnJlbnRMaW5rID0gY3VycmVudExpbmsubWFwKHZhbHVlID0+IHtcbiAgICAgICAgICBjb25zdCBpbmRleE9mU3BlY2lhbENoYXIgPSB2YWx1ZS5zZWFyY2goL1teXFx3XFxzLV0vZ2kpO1xuICAgICAgICAgIGlmIChpbmRleE9mU3BlY2lhbENoYXIgIT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUuc3Vic3RyaW5nKDAsIGluZGV4T2ZTcGVjaWFsQ2hhcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgbWluTGVuZ3RoID0gTWF0aC5taW4obGluay5sZW5ndGgsIGN1cnJlbnRMaW5rLmxlbmd0aCk7XG4gICAgICAgIGN1cnJlbnRMaW5rID0gY3VycmVudExpbmsuc2xpY2UoMCwgbWluTGVuZ3RoKTtcbiAgICAgICAgY29uc3QgYXJlSWRlbnRpY2FsID0gSlNPTi5zdHJpbmdpZnkobGluaykgPT09IEpTT04uc3RyaW5naWZ5KGN1cnJlbnRMaW5rKTtcbiAgICAgICAgaWYgKGFyZUlkZW50aWNhbCkge1xuICAgICAgICAgIGEuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgaWYgKGFjdGl2YXRlKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnRVbCA9IGEuY2xvc2VzdCgndWwnKTtcbiAgICAgICAgICAgIGlmIChwYXJlbnRVbCkge1xuICAgICAgICAgICAgICBwYXJlbnRVbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcHJpdmF0ZSBjcmVhdGVTaWRlYmFyKG1lbnVEYXRhOiBNZW51SXRlbVtdLCBwYXJlbnRFbGVtZW50PzogYW55KSB7XG4gICAgY29uc3QgdWwgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgbWVudURhdGEuZm9yRWFjaCgobWVudUl0ZW06IE1lbnVJdGVtKSA9PiB7XG4gICAgICBjb25zdCBsaSA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGNvbnN0IGEgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgIGxpLmNsYXNzTGlzdC5hZGQoJ25hdi1pdGVtJyk7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZShhLCAnaHJlZicsIG1lbnVJdGVtLmxpbmshKTtcbiAgICAgIGlmICh0aGlzLnJvdXRlci51cmwuaW5jbHVkZXMobWVudUl0ZW0ubGluayEpKSB7XG4gICAgICAgIGEuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgIH1cbiAgICAgIGEuc2V0QXR0cmlidXRlKCdyb3V0ZXJMaW5rQWN0aXZlJywgJ2N1cnJlbnQnKTtcbiAgICAgIGEuY2xhc3NMaXN0LmFkZCgnbmF2LWxpbmsnLCAndGV4dC1ub3dyYXAnLCAnbGluaycpO1xuICAgICAgY29uc3QgbWVudUl0ZW1TcGFuID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKG1lbnVJdGVtU3BhbiwgdGhpcy5yZW5kZXJlci5jcmVhdGVUZXh0KG1lbnVJdGVtLmxhYmVsKSk7XG5cbiAgICAgIGlmIChtZW51SXRlbS5pY29uKSB7XG4gICAgICAgIGNvbnN0IG1lbnVJdGVtSWNvbiA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnaScpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKG1lbnVJdGVtU3BhbiwgJ21zLTMnKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhtZW51SXRlbUljb24sICdmYScpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKG1lbnVJdGVtSWNvbiwgbWVudUl0ZW0uaWNvbik7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQoYSwgbWVudUl0ZW1JY29uKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZChhLCBtZW51SXRlbVNwYW4pO1xuXG4gICAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKGxpLCBhKTtcbiAgICAgIGlmIChtZW51SXRlbS5zdWJJdGVtcyAmJiBtZW51SXRlbS5zdWJJdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGFycm93ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdpJyk7XG4gICAgICAgIGFycm93LmNsYXNzTGlzdC5hZGQoJ2ZhJywgJ2ZhLWFuZ2xlLWRvd24nLCAnY29udHJvbC1hcnJvdycpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKGEsIGFycm93KTtcbiAgICAgICAgYS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudDogRXZlbnQpID0+IHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGNvbnN0IHN1Ym1lbnVFbGVtZW50ID0gbGkucXVlcnlTZWxlY3RvcigndWwnKTtcbiAgICAgICAgICBzdWJtZW51RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdjb2xsYXBzZScpO1xuICAgICAgICAgIGNvbnN0IGNsb3NlTWVudSA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuY2xvc2UtbWVudScpO1xuICAgICAgICAgIGlmICghc3VibWVudUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb2xsYXBzZScpKSB7XG4gICAgICAgICAgICBhLmNsYXNzTGlzdC5hZGQoJ2NsaWNrZWQnKTtcbiAgICAgICAgICAgIGNsb3NlTWVudSA/IGNsb3NlTWVudS5yZW1vdmUoKSA6IG51bGw7XG4gICAgICAgICAgICBjb25zdCBjbG9zZU1lbnVBZGQgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgY2xvc2VNZW51QWRkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB0b2dnbGVMaVN1Ym1lbnUgPSBsaS5xdWVyeVNlbGVjdG9yQWxsKCd1bCcpO1xuICAgICAgICAgICAgICB0b2dnbGVMaVN1Ym1lbnUuZm9yRWFjaCgoc3VibWVudTogSFRNTEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc3VibWVudSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICBzdWJtZW51LmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdGhpcy51cGRhdGVTaWRlYmFyVmlzaWJpbGl0eSgpO1xuICAgICAgICAgICAgICBjbG9zZU1lbnVBZGQucmVtb3ZlKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgY2xvc2VNZW51QWRkLmNsYXNzTGlzdC5hZGQoJ2Nsb3NlLW1lbnUnKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5lbC5uYXRpdmVFbGVtZW50LCBjbG9zZU1lbnVBZGQpO1xuICAgICAgICAgICAgdGhpcy5maW5kU2libGluZ0xpc3RJdGVtcyhsaSwgJ2hhcy1zdWJtZW51Jyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGEuY2xhc3NMaXN0LnJlbW92ZSgnY2xpY2tlZCcpO1xuICAgICAgICAgICAgY29uc3QgdG9nZ2xlTGlTdWJtZW51ID0gbGkucXVlcnlTZWxlY3RvckFsbCgndWwnKTtcbiAgICAgICAgICAgIHRvZ2dsZUxpU3VibWVudS5mb3JFYWNoKChzdWJtZW51OiBIVE1MRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoc3VibWVudSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgc3VibWVudS5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZScpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5pc01lbnVBY3RpdmUpXG4gICAgICAgIGEuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIChldmVudDogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmlzTWVudUFjdGl2ZSwgdGhpcy5pc01lbnVIb3Zlcik7XG4gICAgICAgICAgaWYgKCF0aGlzLmlzTWVudUFjdGl2ZSAmJiB0aGlzLmlzTWVudUhvdmVyKSB7XG4gICAgICAgICAgICBjb25zdCBzdWJtZW51RWxlbWVudCA9IGxpLnF1ZXJ5U2VsZWN0b3IoJ3VsJyk7XG4gICAgICAgICAgICBzdWJtZW51RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdjb2xsYXBzZScpO1xuICAgICAgICAgICAgY29uc3QgY2xvc2VNZW51ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbG9zZS1tZW51Jyk7XG4gICAgICAgICAgICBpZiAoIXN1Ym1lbnVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY29sbGFwc2UnKSkge1xuICAgICAgICAgICAgICBhLmNsYXNzTGlzdC5hZGQoJ2NsaWNrZWQnKTtcbiAgICAgICAgICAgICAgY2xvc2VNZW51ID8gY2xvc2VNZW51LnJlbW92ZSgpIDogbnVsbDtcbiAgICAgICAgICAgICAgY29uc3QgY2xvc2VNZW51QWRkID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgY2xvc2VNZW51QWRkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9nZ2xlTGlTdWJtZW51ID0gbGkucXVlcnlTZWxlY3RvckFsbCgndWwnKTtcbiAgICAgICAgICAgICAgICB0b2dnbGVMaVN1Ym1lbnUuZm9yRWFjaCgoc3VibWVudTogSFRNTEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChzdWJtZW51IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VibWVudS5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZScpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU2lkZWJhclZpc2liaWxpdHkoKTtcbiAgICAgICAgICAgICAgICBjbG9zZU1lbnVBZGQucmVtb3ZlKCk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIGNsb3NlTWVudUFkZC5jbGFzc0xpc3QuYWRkKCdjbG9zZS1tZW51Jyk7XG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5lbC5uYXRpdmVFbGVtZW50LCBjbG9zZU1lbnVBZGQpO1xuICAgICAgICAgICAgICB0aGlzLmZpbmRTaWJsaW5nTGlzdEl0ZW1zKGxpLCAnaGFzLXN1Ym1lbnUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGEuY2xhc3NMaXN0LnJlbW92ZSgnY2xpY2tlZCcpO1xuICAgICAgICAgICAgICBjb25zdCB0b2dnbGVMaVN1Ym1lbnUgPSBsaS5xdWVyeVNlbGVjdG9yQWxsKCd1bCcpO1xuICAgICAgICAgICAgICB0b2dnbGVMaVN1Ym1lbnUuZm9yRWFjaCgoc3VibWVudTogSFRNTEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc3VibWVudSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICBzdWJtZW51LmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KVxuICAgICAgICB0aGlzLmNyZWF0ZVNpZGViYXIobWVudUl0ZW0uc3ViSXRlbXMsIGxpKTtcbiAgICAgICAgbGkuY2xhc3NMaXN0LmFkZCgnaGFzLXN1Ym1lbnUnKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBhLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgIXRoaXMuaXNNZW51QWN0aXZlICYmIHRoaXMuaXNNZW51SG92ZXIgPyB0aGlzLmZpbmRTaWJsaW5nTGlzdEl0ZW1zKGxpLCAnaGFzLXN1Ym1lbnUnKSA6IG51bGw7XG4gICAgICAgIH0pXG4gICAgICAgIGEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAvLyBGaW5kIHNpYmxpbmdzIG9mIHRoZSBwYXJlbnQgbGkgYW5kIHJlbW92ZSAnY2xpY2tlZCcgY2xhc3NcbiAgICAgICAgICBjb25zdCBwYXJlbnRMaSA9IGEucGFyZW50RWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICBjb25zdCBzaWJsaW5ncyA9IEFycmF5LmZyb20ocGFyZW50TGkucGFyZW50RWxlbWVudD8uY2hpbGRyZW4gfHwgW10pIGFzIEhUTUxFbGVtZW50W107XG4gICAgICAgICAgc2libGluZ3MuZm9yRWFjaChzaWJsaW5nID0+IHtcbiAgICAgICAgICAgIGlmIChzaWJsaW5nICE9PSBwYXJlbnRMaSkge1xuICAgICAgICAgICAgICBjb25zdCBzaWJsaW5nTGluayA9IHNpYmxpbmcucXVlcnlTZWxlY3RvcignYScpO1xuICAgICAgICAgICAgICBpZiAoc2libGluZ0xpbmspIHtcbiAgICAgICAgICAgICAgICBzaWJsaW5nTGluay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuZmluZFNpYmxpbmdMaXN0SXRlbXMobGksICdoYXMtc3VibWVudScpO1xuICAgICAgICAgIGNvbnN0IGxpbmsgPSBtZW51SXRlbS5saW5rITtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtsaW5rXSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuY2hlY2tBY3RpdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgIXRoaXMuaXNNZW51QWN0aXZlID8gdGhpcy51cGRhdGVTaWRlYmFyVmlzaWJpbGl0eSgpIDogbnVsbDtcbiAgICAgICAgICAgIGEuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgICAgICB9LCAyMDApO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodWwsIGxpKTtcbiAgICB9KTtcbiAgICBjb25zdCBjb250YWluZXIgPSBwYXJlbnRFbGVtZW50IHx8IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lciwgdWwpO1xuICAgIGlmICghcGFyZW50RWxlbWVudCkge1xuICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmlubmVySFRNTCA9ICcnO1xuICAgICAgY29uc3Qgc2lkZWJhciA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnbmF2Jyk7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKHNpZGViYXIsIHVsKTtcbiAgICAgIHVsLmNsYXNzTGlzdC5hZGQoJ25hdicsICdmbGV4LWNvbHVtbicsICdhbGlnbi1pdGVtcy1zdGFydCcpO1xuICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIHNpZGViYXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1bC5jbGFzc0xpc3QuYWRkKCdzdWJtZW51JywgJ2xpc3QtdW5zdHlsZWQnLCAnY29sbGFwc2UnKTtcbiAgICB9XG4gIH1cbiAgbmdPbkluaXQoKSB7XG4gICAgXG4gICAgdGhpcy5yb3V0ZXIuZXZlbnRzLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uRW5kKSB7XG4gICAgICAgIHRoaXMuY2hlY2tBY3RpdmUodGhpcy5pc01lbnVBY3RpdmUpO1xuICAgICAgfVxuICAgIH0pOyAgICBcbiAgfVxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gIH1cbn1cbiJdfQ==