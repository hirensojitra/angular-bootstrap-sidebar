import * as i0 from '@angular/core';
import { Injectable, HostListener, EventEmitter, Directive, Input, Output, Component, NgModule } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as i2 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i1 from '@angular/router';
import { NavigationEnd } from '@angular/router';

class ABSService {
    constructor(zone) {
        this.zone = zone;
        this.menuToggleSubject = new BehaviorSubject(false);
        this.dirSubject = new BehaviorSubject(''); // Change to string type
        setInterval(() => {
            this.zone.run(() => {
                const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
                if (this.dirSubject.value !== currentDir) {
                    this.dirSubject.next(currentDir);
                }
            });
        }, 1000);
    }
    setDir(dir) {
        document.documentElement.setAttribute('dir', dir);
        this.dirSubject.next(dir);
    }
    // Modify getDir to return Observable<string>
    getDir() {
        return this.dirSubject.asObservable();
    }
    getMenuStatus() {
        return this.menuToggleSubject.asObservable();
    }
    toggleMenu() {
        this.menuToggleSubject.next(!this.menuToggleSubject.value);
    }
    handleKeyboardEvent(event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'S') {
            alert();
            event.preventDefault();
            this.toggleMenu();
        }
    }
    ngOnDestroy() {
        // Unsubscribe to prevent memory leaks
        this.menuToggleSubject.unsubscribe();
        this.dirSubject.unsubscribe();
    }
}
ABSService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: ABSService, deps: [{ token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable });
ABSService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: ABSService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: ABSService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }]; }, propDecorators: { handleKeyboardEvent: [{
                type: HostListener,
                args: ['document:keydown', ['$event']]
            }] } });

class ABSDirective {
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

class ABSComponent {
    constructor(bootstrapAngularSidebarService) {
        this.bootstrapAngularSidebarService = bootstrapAngularSidebarService;
        this.menuStatus = false;
        this.menuDir = 'ltr';
        this.bootstrapAngularSidebarService.getMenuStatus().subscribe((status) => {
            this.menuStatus = status;
        });
        this.bootstrapAngularSidebarService.getDir().subscribe((dir) => {
            this.menuDir = dir;
        });
    }
    handleKeyboardEvent(event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'S') {
            event.preventDefault();
            this.bootstrapAngularSidebarService.toggleMenu();
        }
    }
    ngOnInit() {
        this.menuStatusSubscription = this.bootstrapAngularSidebarService.getMenuStatus().subscribe((status) => {
            this.menuStatus = status;
            if (status) {
                document.body.classList.add('menu-open');
            }
            else {
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
ABSComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: ABSComponent, deps: [{ token: ABSService }], target: i0.ɵɵFactoryTarget.Component });
ABSComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.10", type: ABSComponent, selector: "abs", inputs: { menuData: "menuData", menuActive: "menuActive", menuHover: "menuHover" }, host: { listeners: { "document:keydown": "handleKeyboardEvent($event)" } }, ngImport: i0, template: "<div class=\"sidebar {{menuDir}}\" [ngClass]=\"{'menu-open': menuStatus}\" >\r\n    <div class=\"head-block d-flex align-items-center\"\r\n        [ngClass]=\"{'justify-content-between':menuStatus, 'justify-content-center':!menuStatus}\">\r\n        <img alt=\"IION\" class=\"menu-img\" src=\"assets/images/svg/IION.svg\" [ngClass]=\"{'d-none': !menuStatus}\">\r\n        <button (click)=\"bootstrapAngularSidebarService.toggleMenu()\" class=\"btn-dark btn menu-toggle\"><span class=\"fa fa-bars\"\r\n                [style.transform]=\"menuStatus ? 'rotate(-45deg)' : 'none'\"></span></button>\r\n    </div>\r\n    <div sidebarMenu [menuData]=\"menuData\" [menuActive]=\"menuStatus\" [menuHover]=\"menuHover\" class=\"sidebar-menu\"\r\n        [ngClass]=\"{'menu-open':menuStatus}\"></div>\r\n</div>", styles: ["::ng-deep html[dir=ltr] body{padding-left:5rem}::ng-deep html[dir=ltr] body.menu-open{padding-left:22.857rem}::ng-deep html[dir=rtl] body{padding-right:5rem}::ng-deep html[dir=rtl] body.menu-open{padding-right:22.857rem}.head-block{background:#FFF;padding:.571rem 1rem;height:5rem;border-bottom:1px solid #DDD}.head-block .menu-toggle{background:transparent linear-gradient(0deg,#03C9FC 0%,#5BFCB6 100%) 0% 0% no-repeat padding-box}.sidebar.ltr{position:fixed;overflow:visible;display:flex;flex-direction:column;z-index:0;width:5rem;top:0;left:0;height:100%;background:#FFFFFF;z-index:1}.sidebar.ltr.menu-open{width:22.857rem}.sidebar.ltr .sidebar-menu .nav{padding:.625rem}.sidebar.ltr .sidebar-menu .nav .nav-item{margin-bottom:.25rem;position:relative}.sidebar.ltr .sidebar-menu .nav .nav-item:last-child{margin-bottom:0}.sidebar.ltr .sidebar-menu .nav .nav-item .nav-link{border-radius:.438rem;border:1px solid #FFFFFF;font-size:1rem;line-height:1;padding:.771rem 1.017rem!important;font-weight:300;opacity:.8}.sidebar.ltr .sidebar-menu .nav .nav-item .nav-link:hover{border-color:#212130;opacity:1;font-weight:300}.sidebar.ltr .sidebar-menu .nav .nav-item .nav-link.clicked{background:#212130;color:#fff;opacity:1;font-weight:300}.sidebar.ltr .sidebar-menu .nav .nav-item .nav-link.active{background:#FFFFFF;color:#0ccef6;border-color:#0ccef6;opacity:1;font-weight:300}.sidebar.ltr .sidebar-menu .nav .nav-item .nav-link i{height:1.357rem;width:1.357rem;display:inline-block;vertical-align:middle;font-size:1.25rem}.sidebar.ltr .sidebar-menu .nav .nav-item .nav-link i:before{display:flex;align-items:center;justify-content:center;height:100%;width:100%}.sidebar.ltr .sidebar-menu .nav>.nav-item{margin-bottom:.625rem}.sidebar.ltr .sidebar-menu:not(.menu-open){overflow:visible;overflow-x:visible;position:relative}.sidebar.ltr .sidebar-menu:not(.menu-open) .close-menu{position:fixed;height:100%;width:100%;top:0;left:0;z-index:-1;background:rgba(0,0,0,.2)}.sidebar.ltr .sidebar-menu:not(.menu-open) .nav>.nav-item>.nav-link{display:block;text-align:center}.sidebar.ltr .sidebar-menu:not(.menu-open) .nav>.nav-item>.nav-link span{display:none}.sidebar.ltr .sidebar-menu:not(.menu-open) .nav>.nav-item>.nav-link .control-arrow{position:absolute;right:0;display:none}.sidebar.ltr .sidebar-menu:not(.menu-open) .nav>.nav-item.has-submenu{position:relative}.sidebar.ltr .sidebar-menu:not(.menu-open) .nav>.nav-item.has-submenu .submenu:not(.collapse){position:absolute;top:-.571rem;left:calc(100% + .571rem);display:block;width:22.857rem;padding:.571rem .625rem!important}.sidebar.ltr .sidebar-menu:not(.menu-open) .nav>.nav-item.has-submenu .submenu:not(.collapse) .nav-item .nav-link span{display:block}.sidebar.rtl{position:fixed;overflow:visible;display:flex;flex-direction:column;z-index:0;width:5rem;top:0;right:0;height:100%;background:#FFFFFF;z-index:1}.sidebar.rtl.menu-open{width:22.857rem}.sidebar.rtl .sidebar-menu .nav{padding:.625rem}.sidebar.rtl .sidebar-menu .nav .nav-item{margin-bottom:.25rem;position:relative}.sidebar.rtl .sidebar-menu .nav .nav-item:last-child{margin-bottom:0}.sidebar.rtl .sidebar-menu .nav .nav-item .nav-link{border-radius:.438rem;border:1px solid #FFFFFF;font-size:1rem;line-height:1;padding:.771rem 1.017rem!important;font-weight:300;opacity:.8}.sidebar.rtl .sidebar-menu .nav .nav-item .nav-link:hover{border-color:#212130;opacity:1;font-weight:300}.sidebar.rtl .sidebar-menu .nav .nav-item .nav-link.clicked{background:#212130;color:#fff;opacity:1;font-weight:300}.sidebar.rtl .sidebar-menu .nav .nav-item .nav-link.active{background:#FFFFFF;color:#0ccef6;border-color:#0ccef6;opacity:1;font-weight:300}.sidebar.rtl .sidebar-menu .nav .nav-item .nav-link i{height:1.357rem;width:1.357rem;display:inline-block;vertical-align:middle;font-size:1.25rem}.sidebar.rtl .sidebar-menu .nav .nav-item .nav-link i:before{display:flex;align-items:center;justify-content:center;height:100%;width:100%}.sidebar.rtl .sidebar-menu .nav>.nav-item{margin-bottom:.625rem}.sidebar.rtl .sidebar-menu:not(.menu-open){overflow:visible;overflow-x:visible;position:relative}.sidebar.rtl .sidebar-menu:not(.menu-open) .close-menu{position:fixed;height:100%;width:100%;top:0;right:0;z-index:-1;background:rgba(0,0,0,.2)}.sidebar.rtl .sidebar-menu:not(.menu-open) .nav>.nav-item>.nav-link{display:block;text-align:center}.sidebar.rtl .sidebar-menu:not(.menu-open) .nav>.nav-item>.nav-link span{display:none}.sidebar.rtl .sidebar-menu:not(.menu-open) .nav>.nav-item>.nav-link .control-arrow{position:absolute;left:0;display:none}.sidebar.rtl .sidebar-menu:not(.menu-open) .nav>.nav-item.has-submenu{position:relative}.sidebar.rtl .sidebar-menu:not(.menu-open) .nav>.nav-item.has-submenu .submenu:not(.collapse){position:absolute;top:-.571rem;right:calc(100% + .571rem);display:block;width:22.857rem;padding:.571rem .625rem!important}.sidebar.rtl .sidebar-menu:not(.menu-open) .nav>.nav-item.has-submenu .submenu:not(.collapse) .nav-item .nav-link span{display:block}@media (min-width: 768px){.ltr .sidebar-menu{flex-grow:1;overflow-x:hidden;background:#FFFFFF}.ltr .sidebar-menu nav{width:100%}.ltr .sidebar-menu nav .nav-link{display:block;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;align-items:center;color:#212130;position:relative;cursor:pointer}.ltr .sidebar-menu nav .nav-link span{display:inline-block;vertical-align:middle;max-width:100%;text-overflow:ellipsis;overflow:hidden}.ltr .sidebar-menu nav .nav-link.active{color:#0ccef6}.ltr .sidebar-menu nav .nav-link .control-arrow{transform:rotate(-90deg)!important}.ltr .sidebar-menu nav .nav-link.clicked .control-arrow{transform:rotate(90deg)!important}.ltr .sidebar-menu nav .nav-link .control-arrow{position:absolute;right:.571rem;top:calc(50% - .5rem)}.ltr .sidebar-menu nav .nav-item{width:100%}.ltr .sidebar-menu nav .nav-item .submenu{display:none;background:#FFFFFF;min-height:100%;padding:.325rem 0 .325rem 2.2rem}.ltr .sidebar-menu nav .nav-item .has-submenu .submenu-open>.submenu{display:block}.ltr .sidebar-menu.menu-open{width:22.857rem}.ltr .sidebar-menu.menu-open nav .nav-item .submenu:not(.collapse){display:block}.ltr .sidebar-menu.menu-open nav .nav-link .control-arrow{transform:rotate(0)!important}.ltr .sidebar-menu.menu-open nav .nav-link.clicked .control-arrow{transform:rotate(180deg)!important}.rtl .sidebar-menu{flex-grow:1;overflow-x:hidden;background:#FFFFFF}.rtl .sidebar-menu nav{width:100%}.rtl .sidebar-menu nav .nav-link{display:block;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;align-items:center;color:#212130;position:relative;cursor:pointer}.rtl .sidebar-menu nav .nav-link span{display:inline-block;vertical-align:middle;max-width:100%;text-overflow:ellipsis;overflow:hidden}.rtl .sidebar-menu nav .nav-link.active{color:#0ccef6}.rtl .sidebar-menu nav .nav-link .control-arrow{transform:rotate(90deg)!important}.rtl .sidebar-menu nav .nav-link.clicked .control-arrow{transform:rotate(-90deg)!important}.rtl .sidebar-menu nav .nav-link .control-arrow{position:absolute;left:.571rem;top:calc(50% - .5rem)}.rtl .sidebar-menu nav .nav-item{width:100%}.rtl .sidebar-menu nav .nav-item .submenu{display:none;background:#FFFFFF;min-height:100%;padding:.325rem 2.2rem .325rem 0}.rtl .sidebar-menu nav .nav-item .has-submenu .submenu-open>.submenu{display:block}.rtl .sidebar-menu.menu-open{width:22.857rem}.rtl .sidebar-menu.menu-open nav .nav-item .submenu:not(.collapse){display:block}.rtl .sidebar-menu.menu-open nav .nav-link .control-arrow{transform:rotate(0)!important}.rtl .sidebar-menu.menu-open nav .nav-link.clicked .control-arrow{transform:rotate(-180deg)!important}}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: ABSDirective, selector: "[sidebarMenu]", inputs: ["menuActive", "menuHover", "menuData"], outputs: ["menuActiveChange"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: ABSComponent, decorators: [{
            type: Component,
            args: [{ selector: 'abs', template: "<div class=\"sidebar {{menuDir}}\" [ngClass]=\"{'menu-open': menuStatus}\" >\r\n    <div class=\"head-block d-flex align-items-center\"\r\n        [ngClass]=\"{'justify-content-between':menuStatus, 'justify-content-center':!menuStatus}\">\r\n        <img alt=\"IION\" class=\"menu-img\" src=\"assets/images/svg/IION.svg\" [ngClass]=\"{'d-none': !menuStatus}\">\r\n        <button (click)=\"bootstrapAngularSidebarService.toggleMenu()\" class=\"btn-dark btn menu-toggle\"><span class=\"fa fa-bars\"\r\n                [style.transform]=\"menuStatus ? 'rotate(-45deg)' : 'none'\"></span></button>\r\n    </div>\r\n    <div sidebarMenu [menuData]=\"menuData\" [menuActive]=\"menuStatus\" [menuHover]=\"menuHover\" class=\"sidebar-menu\"\r\n        [ngClass]=\"{'menu-open':menuStatus}\"></div>\r\n</div>", styles: ["::ng-deep html[dir=ltr] body{padding-left:5rem}::ng-deep html[dir=ltr] body.menu-open{padding-left:22.857rem}::ng-deep html[dir=rtl] body{padding-right:5rem}::ng-deep html[dir=rtl] body.menu-open{padding-right:22.857rem}.head-block{background:#FFF;padding:.571rem 1rem;height:5rem;border-bottom:1px solid #DDD}.head-block .menu-toggle{background:transparent linear-gradient(0deg,#03C9FC 0%,#5BFCB6 100%) 0% 0% no-repeat padding-box}.sidebar.ltr{position:fixed;overflow:visible;display:flex;flex-direction:column;z-index:0;width:5rem;top:0;left:0;height:100%;background:#FFFFFF;z-index:1}.sidebar.ltr.menu-open{width:22.857rem}.sidebar.ltr .sidebar-menu .nav{padding:.625rem}.sidebar.ltr .sidebar-menu .nav .nav-item{margin-bottom:.25rem;position:relative}.sidebar.ltr .sidebar-menu .nav .nav-item:last-child{margin-bottom:0}.sidebar.ltr .sidebar-menu .nav .nav-item .nav-link{border-radius:.438rem;border:1px solid #FFFFFF;font-size:1rem;line-height:1;padding:.771rem 1.017rem!important;font-weight:300;opacity:.8}.sidebar.ltr .sidebar-menu .nav .nav-item .nav-link:hover{border-color:#212130;opacity:1;font-weight:300}.sidebar.ltr .sidebar-menu .nav .nav-item .nav-link.clicked{background:#212130;color:#fff;opacity:1;font-weight:300}.sidebar.ltr .sidebar-menu .nav .nav-item .nav-link.active{background:#FFFFFF;color:#0ccef6;border-color:#0ccef6;opacity:1;font-weight:300}.sidebar.ltr .sidebar-menu .nav .nav-item .nav-link i{height:1.357rem;width:1.357rem;display:inline-block;vertical-align:middle;font-size:1.25rem}.sidebar.ltr .sidebar-menu .nav .nav-item .nav-link i:before{display:flex;align-items:center;justify-content:center;height:100%;width:100%}.sidebar.ltr .sidebar-menu .nav>.nav-item{margin-bottom:.625rem}.sidebar.ltr .sidebar-menu:not(.menu-open){overflow:visible;overflow-x:visible;position:relative}.sidebar.ltr .sidebar-menu:not(.menu-open) .close-menu{position:fixed;height:100%;width:100%;top:0;left:0;z-index:-1;background:rgba(0,0,0,.2)}.sidebar.ltr .sidebar-menu:not(.menu-open) .nav>.nav-item>.nav-link{display:block;text-align:center}.sidebar.ltr .sidebar-menu:not(.menu-open) .nav>.nav-item>.nav-link span{display:none}.sidebar.ltr .sidebar-menu:not(.menu-open) .nav>.nav-item>.nav-link .control-arrow{position:absolute;right:0;display:none}.sidebar.ltr .sidebar-menu:not(.menu-open) .nav>.nav-item.has-submenu{position:relative}.sidebar.ltr .sidebar-menu:not(.menu-open) .nav>.nav-item.has-submenu .submenu:not(.collapse){position:absolute;top:-.571rem;left:calc(100% + .571rem);display:block;width:22.857rem;padding:.571rem .625rem!important}.sidebar.ltr .sidebar-menu:not(.menu-open) .nav>.nav-item.has-submenu .submenu:not(.collapse) .nav-item .nav-link span{display:block}.sidebar.rtl{position:fixed;overflow:visible;display:flex;flex-direction:column;z-index:0;width:5rem;top:0;right:0;height:100%;background:#FFFFFF;z-index:1}.sidebar.rtl.menu-open{width:22.857rem}.sidebar.rtl .sidebar-menu .nav{padding:.625rem}.sidebar.rtl .sidebar-menu .nav .nav-item{margin-bottom:.25rem;position:relative}.sidebar.rtl .sidebar-menu .nav .nav-item:last-child{margin-bottom:0}.sidebar.rtl .sidebar-menu .nav .nav-item .nav-link{border-radius:.438rem;border:1px solid #FFFFFF;font-size:1rem;line-height:1;padding:.771rem 1.017rem!important;font-weight:300;opacity:.8}.sidebar.rtl .sidebar-menu .nav .nav-item .nav-link:hover{border-color:#212130;opacity:1;font-weight:300}.sidebar.rtl .sidebar-menu .nav .nav-item .nav-link.clicked{background:#212130;color:#fff;opacity:1;font-weight:300}.sidebar.rtl .sidebar-menu .nav .nav-item .nav-link.active{background:#FFFFFF;color:#0ccef6;border-color:#0ccef6;opacity:1;font-weight:300}.sidebar.rtl .sidebar-menu .nav .nav-item .nav-link i{height:1.357rem;width:1.357rem;display:inline-block;vertical-align:middle;font-size:1.25rem}.sidebar.rtl .sidebar-menu .nav .nav-item .nav-link i:before{display:flex;align-items:center;justify-content:center;height:100%;width:100%}.sidebar.rtl .sidebar-menu .nav>.nav-item{margin-bottom:.625rem}.sidebar.rtl .sidebar-menu:not(.menu-open){overflow:visible;overflow-x:visible;position:relative}.sidebar.rtl .sidebar-menu:not(.menu-open) .close-menu{position:fixed;height:100%;width:100%;top:0;right:0;z-index:-1;background:rgba(0,0,0,.2)}.sidebar.rtl .sidebar-menu:not(.menu-open) .nav>.nav-item>.nav-link{display:block;text-align:center}.sidebar.rtl .sidebar-menu:not(.menu-open) .nav>.nav-item>.nav-link span{display:none}.sidebar.rtl .sidebar-menu:not(.menu-open) .nav>.nav-item>.nav-link .control-arrow{position:absolute;left:0;display:none}.sidebar.rtl .sidebar-menu:not(.menu-open) .nav>.nav-item.has-submenu{position:relative}.sidebar.rtl .sidebar-menu:not(.menu-open) .nav>.nav-item.has-submenu .submenu:not(.collapse){position:absolute;top:-.571rem;right:calc(100% + .571rem);display:block;width:22.857rem;padding:.571rem .625rem!important}.sidebar.rtl .sidebar-menu:not(.menu-open) .nav>.nav-item.has-submenu .submenu:not(.collapse) .nav-item .nav-link span{display:block}@media (min-width: 768px){.ltr .sidebar-menu{flex-grow:1;overflow-x:hidden;background:#FFFFFF}.ltr .sidebar-menu nav{width:100%}.ltr .sidebar-menu nav .nav-link{display:block;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;align-items:center;color:#212130;position:relative;cursor:pointer}.ltr .sidebar-menu nav .nav-link span{display:inline-block;vertical-align:middle;max-width:100%;text-overflow:ellipsis;overflow:hidden}.ltr .sidebar-menu nav .nav-link.active{color:#0ccef6}.ltr .sidebar-menu nav .nav-link .control-arrow{transform:rotate(-90deg)!important}.ltr .sidebar-menu nav .nav-link.clicked .control-arrow{transform:rotate(90deg)!important}.ltr .sidebar-menu nav .nav-link .control-arrow{position:absolute;right:.571rem;top:calc(50% - .5rem)}.ltr .sidebar-menu nav .nav-item{width:100%}.ltr .sidebar-menu nav .nav-item .submenu{display:none;background:#FFFFFF;min-height:100%;padding:.325rem 0 .325rem 2.2rem}.ltr .sidebar-menu nav .nav-item .has-submenu .submenu-open>.submenu{display:block}.ltr .sidebar-menu.menu-open{width:22.857rem}.ltr .sidebar-menu.menu-open nav .nav-item .submenu:not(.collapse){display:block}.ltr .sidebar-menu.menu-open nav .nav-link .control-arrow{transform:rotate(0)!important}.ltr .sidebar-menu.menu-open nav .nav-link.clicked .control-arrow{transform:rotate(180deg)!important}.rtl .sidebar-menu{flex-grow:1;overflow-x:hidden;background:#FFFFFF}.rtl .sidebar-menu nav{width:100%}.rtl .sidebar-menu nav .nav-link{display:block;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;align-items:center;color:#212130;position:relative;cursor:pointer}.rtl .sidebar-menu nav .nav-link span{display:inline-block;vertical-align:middle;max-width:100%;text-overflow:ellipsis;overflow:hidden}.rtl .sidebar-menu nav .nav-link.active{color:#0ccef6}.rtl .sidebar-menu nav .nav-link .control-arrow{transform:rotate(90deg)!important}.rtl .sidebar-menu nav .nav-link.clicked .control-arrow{transform:rotate(-90deg)!important}.rtl .sidebar-menu nav .nav-link .control-arrow{position:absolute;left:.571rem;top:calc(50% - .5rem)}.rtl .sidebar-menu nav .nav-item{width:100%}.rtl .sidebar-menu nav .nav-item .submenu{display:none;background:#FFFFFF;min-height:100%;padding:.325rem 2.2rem .325rem 0}.rtl .sidebar-menu nav .nav-item .has-submenu .submenu-open>.submenu{display:block}.rtl .sidebar-menu.menu-open{width:22.857rem}.rtl .sidebar-menu.menu-open nav .nav-item .submenu:not(.collapse){display:block}.rtl .sidebar-menu.menu-open nav .nav-link .control-arrow{transform:rotate(0)!important}.rtl .sidebar-menu.menu-open nav .nav-link.clicked .control-arrow{transform:rotate(-180deg)!important}}\n"] }]
        }], ctorParameters: function () { return [{ type: ABSService }]; }, propDecorators: { menuData: [{
                type: Input
            }], menuActive: [{
                type: Input
            }], menuHover: [{
                type: Input
            }], handleKeyboardEvent: [{
                type: HostListener,
                args: ['document:keydown', ['$event']]
            }] } });

class AngularBootstrapSidebar {
}
AngularBootstrapSidebar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: AngularBootstrapSidebar, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AngularBootstrapSidebar.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.10", ngImport: i0, type: AngularBootstrapSidebar, declarations: [ABSComponent,
        ABSDirective], imports: [CommonModule], exports: [ABSComponent] });
AngularBootstrapSidebar.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: AngularBootstrapSidebar, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: AngularBootstrapSidebar, decorators: [{
            type: NgModule,
            args: [{
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
                }]
        }] });

/*
 * Public API Surface of angular-bootstrap-sidebar
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ABSComponent, ABSService, AngularBootstrapSidebar };
//# sourceMappingURL=angular-bootstrap-sidebar.mjs.map
