import { EventEmitter, Renderer2 } from '@angular/core';
import { ElementRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import * as i0 from "@angular/core";
export interface MenuItem {
    label: string;
    icon?: string;
    link?: string;
    title?: string;
    subItems?: MenuItem[];
}
export declare class ABSDirective implements OnInit, AfterViewInit {
    private el;
    private renderer;
    private router;
    private isMenuActive;
    private isMenuHover;
    private menuDataSubject;
    private menuActiveSubject;
    private menuHoverSubject;
    set menuActive(value: boolean);
    set menuHover(value: boolean);
    set menuData(value: MenuItem[]);
    menuActiveChange: EventEmitter<boolean>;
    constructor(el: ElementRef, renderer: Renderer2, router: Router);
    private handleMenuActiveChange;
    private handleMenuHoverChange;
    private toggleMenuOpenClass;
    private findSiblingListItems;
    private updateSidebarVisibility;
    private checkActive;
    private createSidebar;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ABSDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ABSDirective, "[sidebarMenu]", never, { "menuActive": "menuActive"; "menuHover": "menuHover"; "menuData": "menuData"; }, { "menuActiveChange": "menuActiveChange"; }, never, never, false, never>;
}
