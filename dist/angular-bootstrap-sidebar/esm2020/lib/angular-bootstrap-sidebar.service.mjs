import { HostListener, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class ABSService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1ib290c3RyYXAtc2lkZWJhci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1ib290c3RyYXAtc2lkZWJhci9zcmMvbGliL2FuZ3VsYXItYm9vdHN0cmFwLXNpZGViYXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUNqRSxPQUFPLEVBQWMsZUFBZSxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQUluRCxNQUFNLE9BQU8sVUFBVTtJQUlyQixZQUFvQixJQUFZO1FBQVosU0FBSSxHQUFKLElBQUksQ0FBUTtRQUh4QixzQkFBaUIsR0FBNkIsSUFBSSxlQUFlLENBQVUsS0FBSyxDQUFDLENBQUM7UUFDbEYsZUFBVSxHQUE0QixJQUFJLGVBQWUsQ0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLHdCQUF3QjtRQUdyRyxXQUFXLENBQUMsR0FBRyxFQUFFO1lBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUM7Z0JBQ3pFLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEtBQUssVUFBVSxFQUFFO29CQUN4QyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDbEM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFRCxNQUFNLENBQUMsR0FBVztRQUNoQixRQUFRLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELDZDQUE2QztJQUM3QyxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxhQUFhO1FBQ1gsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDL0MsQ0FBQztJQUVELFVBQVU7UUFDUixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCxtQkFBbUIsQ0FBQyxLQUFvQjtRQUN0QyxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLEdBQUcsRUFBRTtZQUN4RCxLQUFLLEVBQUUsQ0FBQTtZQUNQLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDbkI7SUFDSCxDQUFDO0lBQ0QsV0FBVztRQUNULHNDQUFzQztRQUN0QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNoQyxDQUFDOzt3R0E1Q1UsVUFBVTs0R0FBVixVQUFVLGNBRlQsTUFBTTs0RkFFUCxVQUFVO2tCQUh0QixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs2RkFrQ0MsbUJBQW1CO3NCQURsQixZQUFZO3VCQUFDLGtCQUFrQixFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSG9zdExpc3RlbmVyLCBJbmplY3RhYmxlLCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQUJTU2VydmljZSB7XG4gIHByaXZhdGUgbWVudVRvZ2dsZVN1YmplY3Q6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuICBwcml2YXRlIGRpclN1YmplY3Q6IEJlaGF2aW9yU3ViamVjdDxzdHJpbmc+ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxzdHJpbmc+KCcnKTsgLy8gQ2hhbmdlIHRvIHN0cmluZyB0eXBlXG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSB6b25lOiBOZ1pvbmUpIHtcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgY29uc3QgY3VycmVudERpciA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RpcicpIHx8ICdsdHInO1xuICAgICAgICBpZiAodGhpcy5kaXJTdWJqZWN0LnZhbHVlICE9PSBjdXJyZW50RGlyKSB7XG4gICAgICAgICAgdGhpcy5kaXJTdWJqZWN0Lm5leHQoY3VycmVudERpcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sIDEwMDApO1xuICB9XG5cbiAgc2V0RGlyKGRpcjogc3RyaW5nKSB7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGlyJywgZGlyKTtcbiAgICB0aGlzLmRpclN1YmplY3QubmV4dChkaXIpO1xuICB9XG5cbiAgLy8gTW9kaWZ5IGdldERpciB0byByZXR1cm4gT2JzZXJ2YWJsZTxzdHJpbmc+XG4gIGdldERpcigpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmRpclN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBnZXRNZW51U3RhdHVzKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLm1lbnVUb2dnbGVTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgdG9nZ2xlTWVudSgpIHtcbiAgICB0aGlzLm1lbnVUb2dnbGVTdWJqZWN0Lm5leHQoIXRoaXMubWVudVRvZ2dsZVN1YmplY3QudmFsdWUpO1xuICB9XG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmtleWRvd24nLCBbJyRldmVudCddKVxuICBoYW5kbGVLZXlib2FyZEV2ZW50KGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmN0cmxLZXkgJiYgZXZlbnQuc2hpZnRLZXkgJiYgZXZlbnQua2V5ID09PSAnUycpIHtcbiAgICAgIGFsZXJ0KClcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLnRvZ2dsZU1lbnUoKTtcbiAgICB9XG4gIH1cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgLy8gVW5zdWJzY3JpYmUgdG8gcHJldmVudCBtZW1vcnkgbGVha3NcbiAgICB0aGlzLm1lbnVUb2dnbGVTdWJqZWN0LnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5kaXJTdWJqZWN0LnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cbiJdfQ==