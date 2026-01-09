import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportService } from '../../Service/student-profile.service';
import { TrialStudentService } from 'src/app/trial-student/Services/trial-student.service';
import { reference } from '../../Models/ProfileModels';
import { ProgressTrackerService } from '../../Service/progress-tracker.service';   //ADDED
import { Subscription } from 'rxjs';
import { BranchService } from 'src/app/branch/Services/branch.service';


@Component({
  selector: 'app-student-profile-home',
  templateUrl: './student-profile-home.component.html',
  styleUrls: ['./student-profile-home.component.css']
})
export class StudentProfileHomeComponent implements OnInit {

  ProfileForm!: FormGroup;
  trialStudentId!: string | null;
  studentId!: any;
  successMessage: string = '';
errorMessage: string = '';

//added
photoFile!: File | null;
photoPreview: string | ArrayBuffer | null = null;
branches: any[] = [];

////
selectedBranchId: string | null = null;
selectedBranchName: string | null = null;

  enrollmentType: 'trial' | 'direct' = 'direct'; // Default enrollment type

  // This flag tracks if a trial student was actually selected
  hasSelectedTrialStudent = false;

  referenceOptions: reference[] = [reference.student, reference.staff, reference.advertisement, reference.webinar];

  referenceLabels: { [key in reference]: string } = {
    [reference.student]: 'Student',
    [reference.staff]: 'Staff',
    [reference.advertisement]: 'Advertisement',
    [reference.webinar]: 'Webinar'
  };
   ///****////
steps: { label: string }[] = [];   
 currentStep = 0;
  progressValue = 0; 
    private subs = new Subscription();//ADDED
     

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private profileService: ReportService,
    private trialStudentService: TrialStudentService,
    private router: Router,
    private progressService:ProgressTrackerService,
    private branchService:BranchService   //added
  ) { }

  ngOnInit(): void {
    ///****////
        this.steps = this.progressService.steps; //added
          this.progressService.setStep(0);
            const stepSub = this.progressService.currentStep$.subscribe(step => {
      this.currentStep = step;
      this.progressValue = this.progressService.getProgressValue(step);
    });
    this.subs.add(stepSub);
    this.loadBranches(); 
        
     this.selectedBranchId = localStorage.getItem('selectedBranchId');
  if (this.selectedBranchId) {
    const branch = this.branches.find(b => b.branchId === this.selectedBranchId);
    this.selectedBranchName = branch ? branch.branchName : null;
  }

    this.route.queryParams.subscribe(params => {
    const trialId = params['trialStudentId'];
    if (trialId) {
      this.trialStudentId = trialId;
      this.profileService.trialStudentId = trialId; 
    } else {
      this.trialStudentId = this.profileService.trialStudentId;
    }
    console.log("StudentProfileHome → trialStudentId:", this.trialStudentId);
  });

    this.ProfileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      dob: ['', [Validators.required, this.minimumAgeValidator(16)]],
      referredBy: [null, Validators.required],
     branchId: ['', Validators.required],
    });

    if (this.trialStudentId) {
      // User arrived with trialStudentId (clicked enroll from Trial Students list)

      this.enrollmentType = 'trial';
      this.hasSelectedTrialStudent = true;
      this.profileService.trialStudentId = this.trialStudentId;
      this.loadTrialStudentData();
    } else {
      this.profileService.enrollmentType = 'direct';
      this.hasSelectedTrialStudent = false;
    }
  }

loadBranches() {
  this.branchService.getAllBranches().subscribe(res => {
    this.branches = res;

    const storedBranchId = localStorage.getItem('selectedBranchId');
    if (storedBranchId) {
      this.ProfileForm.patchValue({ branchId: storedBranchId });
      this.selectedBranchId = storedBranchId;

      const branch = this.branches.find(b => b.branchId === storedBranchId);
      this.selectedBranchName = branch ? branch.branchName : null;
    }
  });
}

  
  goToTrialStudentList() {
    this.router.navigate(['/home/trialStudent/ViewTrialStudent']);
  }


  minimumAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const dob = new Date(control.value);
      const today = new Date();

      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      const dayDiff = today.getDate() - dob.getDate();

      const isOldEnough =
        age > minAge ||
        (age === minAge && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));

      return !isOldEnough ? { minAge: { requiredAge: minAge, actualAge: age } } : null;
    };
  }

  // Load Trial Student data to prefill form
  loadTrialStudentData() {
    if (!this.trialStudentId) {
      alert('No Trial Student selected. Please select a Trial Student first.');
      return;
    }

    this.trialStudentService.getTrialStudentById(this.trialStudentId).subscribe(data => {
      this.trialStudentService.courseId=data.courseId
      this.ProfileForm.patchValue({
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        email: data.email,
        phone: data.phone,

      });
    });
  }

  // When user changes enrollment type dropdown
  onEnrollmentTypeChange(type: 'trial' | 'direct') {
    this.enrollmentType = type?? 'direct';
    this.profileService.enrollmentType = type;
    console.log(this.profileService.enrollmentType)
    if (type === 'trial' && this.hasSelectedTrialStudent) {
      // Only prefill if a trial student was actually selected
      this.loadTrialStudentData();
    } else {
      // Clear the flag and reset form if switching to direct or no trial student selected
      this.hasSelectedTrialStudent = false;
      this.trialStudentId = null;
      this.ProfileForm.reset();
    }
  }

  //added
onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.photoFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.photoPreview = e.target ? e.target.result as string | ArrayBuffer : null;
    };
    reader.readAsDataURL(file);
  }
}
isSubmitting = false;
//changed all
onSubmit() {
  if (this.ProfileForm.valid) {
    const formValue = this.ProfileForm.value;
    const formData = new FormData();
this.isSubmitting = true; // 🔒 lock submit
    // Append text fields
    formData.append('firstName', formValue.firstName);
    formData.append('lastName', formValue.lastName);
    formData.append('address', formValue.address);
    formData.append('email', formValue.email);
    formData.append('phone', formValue.phone);
    formData.append('branchId', formValue.branchId);


    // Format Date of Birth (convert to YYYY-MM-DD)
 if (formValue.dob) {
  const dob = new Date(formValue.dob);
  const formattedDob = dob.toISOString().split('T')[0];
  formData.append('dob', formattedDob);
}



    formData.append('referredBy', formValue.referredBy);
    formData.append('enrollmentType', this.enrollmentType === 'trial' ? '1' : '0');

    // Add trialStudentId if applicable
    if (this.enrollmentType === 'trial' && this.trialStudentId) {
      formData.append('trialStudentId', this.trialStudentId);
    }

    // Add photo file (if selected)
    if (this.photoFile) {
      formData.append('photoFile', this.photoFile);
    }

    // Submit data to backend
    this.profileService.addStudentProfile(formData).subscribe({
      next: (response) => {
        this.studentId = response.studentId;
        this.profileService.studentId = this.studentId;

        //  Confirm photo upload success
        if (response.photoUrl) {
          console.log('Photo uploaded successfully:', response.photoUrl);
          this.photoPreview = response.photoUrl; // show backend-saved image
        } else {
          console.warn(' No photo URL returned from backend');
        }

        
        if (this.studentId && this.studentId !== '00000000-0000-0000-0000-000000000000'){
      this.router.navigate(['/home/studentProfile/secondary-contact', this.studentId]); //changed

        } else {
          alert('Student ID not returned correctly.');
        }
      },
     
    });
  } else {
    alert('Please fill out all required fields correctly.');
  }
}

}
