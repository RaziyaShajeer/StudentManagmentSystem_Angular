import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrialStudentService } from '../../Services/trial-student.service';
import { trialStudent } from '../../Models/trialStudent';
import { BranchService } from 'src/app/branch/Services/branch.service';

@Component({
  selector: 'app-update-trial-student',
  templateUrl: './update-trial-student.component.html',
  styleUrls: ['./update-trial-student.component.css']
})
export class UpdateTrialStudentComponent implements OnInit {
  studentForm!: FormGroup;
  studentId!: any;
    trialStudent!: trialStudent; 
    branches: any[] = [];


  constructor(
    private fb: FormBuilder,
    private trialStudentService: TrialStudentService,
    private route: ActivatedRoute,
    private router: Router,
    private branchService:BranchService
  ) {}

 

ngOnInit(): void {
  this.studentId = this.route.snapshot.paramMap.get('trialStudentId');
  this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      branchId:['',Validators.required]
    });
    this.loadBranches();
  this.loadStudentData();
}
  

loadBranches() {
  this.branchService.getAllBranches().subscribe(res => {
    this.branches = res;
  });
}


  loadStudentData(): void {
    this.trialStudentService.getTrialStudentById(this.studentId).subscribe(data => {
       this.trialStudent = data;
          this.studentForm.patchValue({
            firstName: data.firstName,
           lastName: data.lastName,
           address:data.address,
           email:data.email,
           phone:data.phone,
          branchId: data.branchId 
            
          });
        });
  }

  onSubmit(): void {
  if (!this.studentForm.valid) return;

  // Ensure trialStudent is loaded
  const currentStatus = this.trialStudent?.status ?? 'Pending';

  const formValue = this.studentForm.value;
  const updatedStudent = {
    trialStudentId: this.studentId,
    firstName: formValue.firstName,
    lastName: formValue.lastName,
    address: formValue.address,
    email: formValue.email,
    phone: formValue.phone,
    status: currentStatus,
    branchId: formValue.branchId
  };

  this.trialStudentService.updateTrialStudent(this.studentId, updatedStudent).subscribe({
    next: () => {
      // Navigate after successful update
      this.router.navigate(['/home/trialStudent/ViewTrialStudent']);
    },
    error: (err: any) => {
      // Safe error handling
      if (err?.status) {
        console.error(`HTTP Error ${err.status}: ${err.statusText}`);
      } else {
        console.error('Unexpected error:', err);
      }
      // Optional: show a message in the UI instead of alert
      // this.updateErrorMessage = 'Failed to update student. Please try again.';
    }
  });
}
}