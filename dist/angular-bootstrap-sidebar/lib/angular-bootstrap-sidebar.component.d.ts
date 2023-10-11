import { OnInit } from '@angular/core';
import { ABSService } from './angular-bootstrap-sidebar.service';
import * as i0 from "@angular/core";
export interface MenuItem {
    label: string;
    icon?: string;
    link?: string;
    title?: string;
    subItems?: MenuItem[];
}
export declare class ABSComponent implements OnInit {
    bootstrapAngularSidebarService: ABSService;
    menuData: any;
    menuActive: any;
    menuHover: any;
    menuStatus: boolean;
    menuDir: string;
    private menuStatusSubscription;
    private dirSubscription;
    constructor(bootstrapAngularSidebarService: ABSService);
    handleKeyboardEvent(event: KeyboardEvent): void;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ABSComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ABSComponent, "abs", never, { "menuData": "menuData"; "menuActive": "menuActive"; "menuHover": "menuHover"; }, {}, never, never, false, never>;
}
