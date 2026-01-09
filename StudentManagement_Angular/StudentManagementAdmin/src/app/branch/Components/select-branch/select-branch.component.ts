  import { Component } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { Branch } from '../../Models/branch';
  import { BranchService } from '../../Services/branch.service';
  import {  ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/shared/layout.service';

  @Component({
    selector: 'app-select-branch',
    templateUrl: './select-branch.component.html',
    styleUrls: ['./select-branch.component.css']
  })
  export class SelectBranchComponent {

  branchForm!: FormGroup;
  branches:Branch[]=[];
  branchListVisible = this.layoutService.branchListVisibility$;
  

    constructor(private fb: FormBuilder,private snackBar: MatSnackBar,private branchservice:BranchService,private router:Router,private route:ActivatedRoute,private layoutService:LayoutService) {}

    ngOnInit(): void {
      this.branchForm = this.fb.group({
        branch: ['',Validators.required]
      });
      this.loadbranches();
    const firstLogin = localStorage.getItem('firstLogin');

  if (firstLogin) {

    this.layoutService.hideSidebar();
    this.layoutService.hidebranchlist();
  } else {
 
    this.layoutService.showSidebar();
    this.layoutService.showbranchlist();
  }
    }

    loadbranches(){
      this.branchservice.getAllBranches().subscribe({next:(res)=>this.branches=res,
        error:()=>{
          this.snackBar.open('Failed to load branches','Close',{
            duration:2000,
            panelClass:['error-snackbar']
          });
        }
      });
    }


  onSubmit() {

    if (this.branchForm.invalid) {
      this.snackBar.open('Please select a branch', 'Close', {
        duration: 2000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    const selectedBranchid=this.branchForm.value.branch;
    localStorage.setItem('selectedBranchId', selectedBranchid); 

    this.snackBar.open('Branch selected successfully!', 'Close', {
      duration: 2000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
 
    this.layoutService.showSidebar();
    this.layoutService.showbranchlist();

     localStorage.removeItem('firstLogin');
  
    this.router.navigate(['/home/dashboard']);
  }

  selectBranch(id: string) {
  this.branchForm.patchValue({ branch: id });

  this.snackBar.open('Branch selected ', 'Close', {
    duration: 2000,
    panelClass: ['success-snackbar']
  });
}
editBranch(id: string) {

  this.router.navigate(['edit', id], { relativeTo: this.route });
}




confirmDelete(id: string) {
  if (confirm("Are you sure you want to delete this branch?")) {
    this.branchservice.deleteBranch(id).subscribe({
      next: () => {
        this.snackBar.open("Branch deleted successfully", "Close", {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
        this.loadbranches(); 
      },
      error: () => {
        this.snackBar.open("Failed to delete branch", "Close", {
          duration: 2000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}


  }
