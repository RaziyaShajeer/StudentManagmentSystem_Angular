import { Component,OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { ReportService } from '../../Service/student-profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProgressTrackerService } from '../../Service/progress-tracker.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-secondary-contact',
  templateUrl: './secondary-contact.component.html',
  styleUrls: ['./secondary-contact.component.css']
})
export class SecondaryContactComponent implements OnInit 
{ 
  contactForm!: FormGroup;
  studentId!: string;


/////**** */
    steps: { label: string }[] = [];
  currentStep = 0;
  progressValue = 0;

  private subs = new Subscription();
////******* */




  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ReportService,
    private snackBar: MatSnackBar,
    private progressService: ProgressTrackerService
  ) {}



  ngOnInit(): void {
    /////****** */
  this.steps = this.progressService.steps;
    this.progressService.setStep(1);   // SECONDARY CONTACT = STEP 1

    const stepSub = this.progressService.currentStep$.subscribe(step => {
      this.currentStep = step;
      this.progressValue = this.progressService.getProgressValue(step);
    });
    this.subs.add(stepSub);

    /////*** */
    this.studentId = this.route.snapshot.paramMap.get('studentId')!;
    if (!this.studentId) {
      alert('Student ID missing.');
      this.router.navigate(['/home/secondary-contact', this.studentId]);
      return;
    }

    this.contactForm = this.fb.group({
      guardianName: ['', Validators.required],
      relation: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      adress: ['', Validators.required]
    });

    // Optional: load existing contact data if available
    this.profileService.getSecondaryContactByStudentId(this.studentId).subscribe({
      next: (res) => {
        if (res) this.contactForm.patchValue(res);
      },
      error: (err) => {
        console.warn('No existing secondary contact found:', err);
      }
    });
  }
isSubmitting = false;
  onSubmit() {
  if (this.contactForm.invalid||this.isSubmitting) return;

  const data = {
    studentId: this.studentId,
    guardianName: this.contactForm.value.guardianName,
    relation: this.contactForm.value.relation,
    phone: this.contactForm.value.phone,
    adress: this.contactForm.value.adress
  };
  this.isSubmitting = true; // 🔒 lock submit
  this.profileService.addSecondaryContact(data).subscribe({
    next: (res) => {
      console.log('✅ Secondary contact added:', res);
      this.snackBar.open('Secondary contact saved successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      //////////******* *//////
        this.progressService.setStep(2);
         //////////******* *//////
     
      this.router.navigate([`/home/studentProfile/qualification`, this.studentId]);
    },
    error: (err) => {
      console.error('❌ Error adding secondary contact:', err);
      this.snackBar.open('Failed to save secondary contact.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
       this.isSubmitting = false; // 🔓 unlock on error

    }
    
    
  });
  
}


}
  
