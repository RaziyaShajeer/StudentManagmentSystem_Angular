import { Component } from '@angular/core';
import { LayoutService } from 'src/app/shared/layout.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
    showSidebar = true;

    constructor(private layoutService: LayoutService) {}

  ngOnInit(): void {
    
    this.layoutService.sidebarVisibility$.subscribe(visible => {
      this.showSidebar = visible;
    });
  }

}
//fully added