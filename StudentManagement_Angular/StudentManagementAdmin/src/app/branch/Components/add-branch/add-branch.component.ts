import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from '../../Services/branch.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.css']
})
export class AddBranchComponent {
  branchForm!: FormGroup;
  successMessage = "";
  errorMessage = "";

  constructor(private fb: FormBuilder, private branchService: BranchService,private router:Router) {}

  ngOnInit(): void {
    this.branchForm = this.fb.group({
      BranchName: ['', Validators.required],
      Location: ['', Validators.required],
      PinCode: ['',Validators.required],
      BranchCode:['',Validators.required]
    });
  }

  saveBranch() {
    this.successMessage = "";
    this.errorMessage = "";

    if (this.branchForm.invalid) {
      this.errorMessage = "Please fill in all required fields.";
      return;
    }

    this.branchService.addBranch(this.branchForm.value).subscribe({
      next: (res) => {
        this.successMessage = "Branch added successfully!";
        console.log("branch added");
        this.router.navigate(['/home/branch']);
        this.branchForm.reset();
      },
      error: (err) => {
        this.errorMessage = "Something went wrong. Try again.";
      }
    });
  }
}
