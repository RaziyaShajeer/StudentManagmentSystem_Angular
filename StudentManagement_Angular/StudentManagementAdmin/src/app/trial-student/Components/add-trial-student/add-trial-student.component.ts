import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TrialStudentService } from '../../Services/trial-student.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CourseService } from 'src/app/course/Services/course.service';
import { Course } from 'src/app/course/Models/Course';
import { BranchService } from 'src/app/branch/Services/branch.service';
@Component({
  selector: 'app-add-trial-student',
  templateUrl: './add-trial-student.component.html',
  styleUrls: ['./add-trial-student.component.css']
})
export class AddTrialStudentComponent implements OnInit {
  studentForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
    courses: Course[] = []; 
    branches: any[] = [];

    selectedBranchId: string | null = null;
    selectedBranchName: string | null = null;
  constructor(
    private fb: FormBuilder,
    private trialStudentService: TrialStudentService,
    private router: Router,
    private courseService: CourseService,
    private branchService:BranchService
  ) {}

  ngOnInit(): void {
    this.studentForm = this.fb.group({
  firstName: ['', Validators.required],
  lastName: ['', Validators.required],
  address: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
  courseId: ['', Validators.required],
  branchId:['',Validators.required]
});

   
     this.loadCourses();

       this.loadBranches(); 
 
  }
   
loadBranches() {
  this.branchService.getAllBranches().subscribe(res => {
    this.branches = res;

  
    this.selectedBranchId = localStorage.getItem('selectedBranchId');

    if (this.selectedBranchId) {
      const branch = this.branches.find(b => b.branchId === this.selectedBranchId);
      this.selectedBranchName = branch ? branch.branchName : null;

      this.studentForm.patchValue({ branchId: this.selectedBranchId });
    }
  });
}



  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (res) => this.courses = res,
      error: (err) => console.error('Error loading courses', err)
    });
  }

  
  onSubmit(): void {
  if (this.studentForm.invalid) return;

  this.trialStudentService.addTrialStudent(this.studentForm.value).subscribe({
    next: (res) => {
      this.trialStudentService.courseId=res.courseId;
      
      this.successMessage = 'Trial student added successfully';
      this.errorMessage = '';

  
     const trialStudentId = res.trialStudentId || res.id;

      // Navigate to fee payment form with query param
     this.router.navigate(['/home/feePayment/paymentForm'], { 
        queryParams: { trialStudentId },
         state: { trialStudent: res }   
         
      });
    },
    error: (err: HttpErrorResponse) => {
      if (err.status === 409 && err.error?.message) {
        this.errorMessage = err.error.message; // "Email already exists"
      } else {
        this.errorMessage = 'Something went wrong. Please try again.';
      }
    }
  });
}
 
}
