import { Component, OnInit } from '@angular/core';
import { batch } from '../../Models/batch';
import { BatchService } from '../../Services/batch.service';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/branch/Services/branch.service';

@Component({
  selector: 'app-view-batch',
  templateUrl: './view-batch.component.html',
  styleUrls: ['./view-batch.component.css']
})
export class ViewBatchComponent implements OnInit {

  batchList: batch[] = [];
  filteredList: batch[] = [];
  searchTerm: string = '';
  showBatchList: boolean = false;
  branches:any[]=[];

  constructor(private service: BatchService, private router: Router,private branchservice:BranchService) {}

  ngOnInit(): void {
    this.getBatches();
    this.getBranches();
  }

  getBatches() {
    this.service.getBatches().subscribe({
      next: (response) => {
        this.batchList = response;
        this.filteredList = []; // initially hidden
      },
      error: () => {
        console.error("Error fetching data");
      }
    });
  }

  getBranches() {
    this.branchservice.getAllBranches().subscribe({
      next: (res) => {
        this.branches = res;
        // After branches are loaded, fetch batches
        this.getBatches();
      },
      error: () => {
        console.error('Error fetching branches');
      }
    });
  }

   getBranchName(branchId: string): string {
    const branch = this.branches.find(b => b.branchId === branchId);
    return branch ? branch.branchName : 'Unknown';
  }

  onSearchInput(event: Event) {
    const term = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchTerm = term;

    if (term) {
      this.filteredList = this.batchList.filter(batch =>
        batch.batchName.toLowerCase().includes(term) ||
        batch.batchDescription?.toLowerCase().includes(term)
      );
      this.showBatchList = true; // show on search
    } else {
      this.filteredList = this.showBatchList ? [...this.batchList] : [];
    }
  }

  onListBatches() {
    this.showBatchList = true;
    this.searchTerm = '';
    this.filteredList = [...this.batchList];
  }

  addNewBatch() {
    this.router.navigate(['/home/batch/addBatch']);
  }

  editBatch(batch: batch) {
    this.router.navigate(['/home/batch/updateBatch', batch.batchId]); // corrected routing
  }

  deleteBatch(batchId: any) {
    this.router.navigate(['/home/batch/removeBatch', batchId]);
  }
}
