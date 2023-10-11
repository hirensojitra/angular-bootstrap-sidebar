import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class ABSService {
    private zone;
    private menuToggleSubject;
    private dirSubject;
    constructor(zone: NgZone);
    setDir(dir: string): void;
    getDir(): Observable<string>;
    getMenuStatus(): Observable<boolean>;
    toggleMenu(): void;
    handleKeyboardEvent(event: KeyboardEvent): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ABSService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ABSService>;
}
