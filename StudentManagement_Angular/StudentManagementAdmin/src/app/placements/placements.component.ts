import { Component, OnInit } from '@angular/core';
import { PlacementsService } from './Services/placements.service';

@Component({
  selector: 'app-placements',
  templateUrl: './placements.component.html',
  styleUrls: ['./placements.component.css']
})
export class PlacementsComponent implements OnInit {

  placements: any[] = [];
  filtered: any[] = [];

  searchTerm: string = '';

  constructor(private service: PlacementsService) {}

  ngOnInit(): void {
    this.loadPlacements();
  }

  loadPlacements() {
    this.service.getPlacements().subscribe(res => {
      this.placements = res;
      this.filtered = res;   // default
    });
  }

  filterPlacements() {
    const term = this.searchTerm.toLowerCase();

    this.filtered = this.placements.filter(p =>
      (p.firstName + ' ' + p.lastName).toLowerCase().includes(term) ||
      p.companyName.toLowerCase().includes(term)
    );
  }
}
