import { Component, Inject, OnInit } from '@angular/core';
import { reference, studentProfile } from '../../Models/ProfileModels';
import { trialStudent } from 'src/app/trial-student/Models/trialStudent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TrialStudentService } from 'src/app/trial-student/Services/trial-student.service';
import { ReportService } from '../../Service/student-profile.service';
import { BranchService } from 'src/app/branch/Services/branch.service';
import { Currentstatus } from '../../Models/ProfileModels';


@Component({
  selector: 'app-edit-profile-dialog-studentprofile',
  templateUrl: './edit-profile-dialog-studentprofile.component.html',
  styleUrls: ['./edit-profile-dialog-studentprofile.component.css']
})
export class EditProfileDialogStudentprofileComponent implements OnInit {
  profileForm!: FormGroup;
  trialStudentInfo!: trialStudent;
  referenceOptions: { value: number; label: string }[] = [];
  branches: any[] = [];
    Currentstatus = Currentstatus;


statusList = Object.keys(Currentstatus)
  .filter(key => isNaN(Number(key))) as Array<keyof typeof Currentstatus>;

  




  constructor(
    private fb: FormBuilder,
    private trialStudentService: TrialStudentService,
    private studentService: ReportService,
    private branchService:BranchService,
    public dialogRef: MatDialogRef<EditProfileDialogStudentprofileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: studentProfile
  ) {
    // Initialize form to prevent undefined errors
    this.profileForm = this.fb.group({
      studentId: [this.data.studentId || '', Validators.required],
      trialStudentId: [this.data.trialStudentId || '', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      dob: ['', Validators.required],
      referredBy: ['', Validators.required],
      branchId:['',Validators.required],
      currentstatus: ['', Validators.required],
      companyName: [null]
    });

    // Reference dropdown options
    this.referenceOptions = Object.keys(reference)
      .filter(key => isNaN(Number(key)))
      .map(key => ({
        value: reference[key as keyof typeof reference],
        label: key.charAt(0).toUpperCase() + key.slice(1)
      }));
  }

  ngOnInit(): void {

  
  this.branchService.getAllBranches().subscribe({
    next: (branches) => {
      this.branches = branches;

      
      this.trialStudentService.getTrialStudentById(this.data.trialStudentId)
        .subscribe((trialData: trialStudent) => {

          this.trialStudentInfo = trialData;
          const dob = this.formatDateLocal(this.data.dob);

       
          this.profileForm.patchValue({
            studentId: this.data.studentId,
            trialStudentId: this.data.trialStudentId,
            firstName: trialData.firstName,
            lastName: trialData.lastName,
            address: trialData.address,
            email: trialData.email,
            phone: trialData.phone,
            dob: dob,
            referredBy: this.data.referredBy,
            branchId: this.data.branchId,
            currentstatus: this.data.currentstatus,
            companyName: this.data.companyNames
   
          });
        });
    },
    error: err => console.error(err)
  });
}



onStatusChange(value: string) {

  const company = this.profileForm.get('companyName');

  if (value === 'Placed') {
    company?.setValidators([Validators.required]);
  } else {
    company?.clearValidators();
    company?.setValue(null);   // <-- send NULL to backend
  }

  company?.updateValueAndValidity();
}



  // Format date as yyyy-MM-dd in local timezone
  private formatDateLocal(date: string | Date | null): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Handle Datepicker changes
  onDobChange(selectedDate: Date | null) {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formatted = `${year}-${month}-${day}`;
      this.profileForm.get('dob')?.setValue(formatted);
    } else {
      this.profileForm.get('dob')?.setValue(null);
    }
  }

  onSave(): void {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;

      // Updated trial student (preserve status)
      const updatedTrialStudent: trialStudent = {
        trialStudentId: formValue.trialStudentId,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        address: formValue.address,
        email: formValue.email,
        phone: formValue.phone,
       branchId: formValue.branchId, 
        status: this.trialStudentInfo.status,
        
      };

let statusValue = formValue.currentstatus;

if (statusValue === null || statusValue === '' || statusValue === undefined) {
  statusValue = 6;
}



// if user did not select status → make it Ongoing (6)
// if (statusValue === null || statusValue === '' || statusValue === undefined) {
//   statusValue = 6;
// }

      // Updated student profile
     const updatedProfile = {
  trialStudentId: formValue.trialStudentId,
  firstName: formValue.firstName,
  lastName: formValue.lastName,
  email: formValue.email,
  phone: formValue.phone,
  address: formValue.address,
  dob: formValue.dob,                     // yyyy-MM-dd
  referredBy: formValue.referredBy,
  branchId: formValue.branchId,
  currentstatus: formValue.currentstatus, // number
  companyName: formValue.companyName ?? null
};



      console.log("Profile Payload:", updatedProfile);
      console.log("TrialStudent Payload:", updatedTrialStudent);

      // Save sequentially
      this.trialStudentService
  .updateTrialStudent(updatedTrialStudent.trialStudentId, updatedTrialStudent)
  .subscribe(() => {

    this.studentService.updateStudentProfile(
      this.data.studentId,          // <-- ID in URL
      updatedProfile                // <-- body (no studentId)
    )
    .subscribe(() => {
      this.dialogRef.close(true);
      window.location.reload();
    });

  });

            
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
