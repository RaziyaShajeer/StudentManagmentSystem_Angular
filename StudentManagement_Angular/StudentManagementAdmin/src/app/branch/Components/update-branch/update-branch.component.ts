import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from '../../Services/branch.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-branch',
  templateUrl: './update-branch.component.html',
  styleUrls: ['./update-branch.component.css']
})
export class UpdateBranchComponent {

   branchForm!: FormGroup;
  branchId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private branchService: BranchService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}
ngOnInit(): void {

  this.branchForm = this.fb.group({
    branchName: ['', Validators.required],
    location: ['', Validators.required],
    pinCode: ['', Validators.required],
    branchCode:['',Validators.required]
  });

  this.branchId = this.route.snapshot.paramMap.get('id')!;
  console.log("ID received:", this.branchId);

  this.loadBranch();
}

loadBranch() {
  this.branchService.getBranchById(this.branchId).subscribe(res => {
    console.log("Loaded branch:", res);
    this.branchForm.patchValue(res);
  });
}


  onSubmit() {
  if (this.branchForm.invalid) return;

  this.branchService.updateBranch(this.branchId, this.branchForm.value)
    .subscribe({
      next: () => {
        this.snackBar.open('Branch updated successfully', 'Close', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });

       this.router.navigate(['/home/branch']);
      },
      error: () => {
        this.snackBar.open('Failed to update branch', 'Close', {
          duration: 2000,
          panelClass: ['error-snackbar']
        });
      }
    });
}


}
