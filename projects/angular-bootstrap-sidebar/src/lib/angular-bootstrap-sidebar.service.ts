import { HostListener, Injectable, NgZone } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ABSService {
  private menuToggleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private dirSubject: BehaviorSubject<string> = new BehaviorSubject<string>(''); // Change to string type

  constructor(private zone: NgZone) {
    setInterval(() => {
      this.zone.run(() => {
        const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
        if (this.dirSubject.value !== currentDir) {
          this.dirSubject.next(currentDir);
        }
      });
    }, 1000);
  }

  setDir(dir: string) {
    document.documentElement.setAttribute('dir', dir);
    this.dirSubject.next(dir);
  }

  // Modify getDir to return Observable<string>
  getDir(): Observable<string> {
    return this.dirSubject.asObservable();
  }

  getMenuStatus(): Observable<boolean> {
    return this.menuToggleSubject.asObservable();
  }

  toggleMenu() {
    this.menuToggleSubject.next(!this.menuToggleSubject.value);
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.shiftKey && event.key === 'S') {
      alert()
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
