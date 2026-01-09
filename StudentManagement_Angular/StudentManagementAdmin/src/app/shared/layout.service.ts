import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

   private sidebarVisible$ = new BehaviorSubject<boolean>(true);
   private branchlistvisible$=new BehaviorSubject<boolean>(true);

  sidebarVisibility$ = this.sidebarVisible$.asObservable();
  branchListVisibility$=this.branchlistvisible$.asObservable();

  showSidebar() {
    this.sidebarVisible$.next(true);
  }

  hideSidebar() {
    this.sidebarVisible$.next(false);
  }

  showbranchlist(){
    this.branchlistvisible$.next(true);

  }

  hidebranchlist(){
    this.branchlistvisible$.next(false);
  }
}
