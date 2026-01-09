import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BatchService } from '../../Services/batch.service';
import { BranchService } from 'src/app/branch/Services/branch.service';

@Component({
  selector: 'app-update-batch',
  templateUrl: './update-batch.component.html',
  styleUrls: ['./update-batch.component.css']
})
export class UpdateBatchComponent implements OnInit{


    batchForm!: FormGroup;
    batchId!: any;
    branches:any[]=[];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private batchService: BatchService,
        private router: Router,
        private branchService:BranchService
      ) {}
    
      ngOnInit(): void {
         this.batchId = this.route.snapshot.paramMap.get('batchId');
          console.log(this.batchId)
          this.batchForm = this.fb.group({
          batchName: ['', Validators.required],
          batchTimeFrom: ['', Validators.required],
      batchTimeFromPeriod: ['AM', Validators.required],
      batchTimeTo: ['', Validators.required],
      batchTimeToPeriod: ['PM', Validators.required],
          batchDescription: ['', Validators.required],
              branchId: ['', Validators.required], 
          
        });
        
          this.loadBranches();
        this.loadCourseData();
      }
      loadCourseData() {
         this.batchService.getBatchById(this.batchId).subscribe(data => {
          const [fromPart, toPart] = data.batchTime.split(' - ');
        const [fromTime, fromPeriod] = fromPart.split(' ');
        const [toTime, toPeriod] = toPart.split(' ');
          this.batchForm.patchValue({
            batchName: data.batchName,
          batchTimeFrom: fromTime,
          batchTimeFromPeriod: fromPeriod,
          batchTimeTo: toTime,
          batchTimeToPeriod: toPeriod,
           batchDescription:data.batchDescription,
             branchId: data.branchId, 
            
          });
        });   
      }

          loadBranches() {
          this.branchService.getAllBranches().subscribe((res: any) => {
          this.branches = res;
         });
        }

       onSubmit() {
        if (this.batchForm.valid) {
          const formValue = this.batchForm.value;
          const batchTime = `${formValue.batchTimeFrom} ${formValue.batchTimeFromPeriod} - ${formValue.batchTimeTo} ${formValue.batchTimeToPeriod}`;
          const updatedBatch = {
            batchId: this.batchId,
          batchName: formValue.batchName,
          batchTime: batchTime,
          batchDescription:formValue.batchDescription,
            branchId: formValue.branchId,
          
          
          };
            this.batchService.updateBatch(this.batchId, updatedBatch).subscribe(() => {
            //alert('Course updated successfully!');
            this.router.navigate(['/home/batch/viewBatch']); 
          });
        }
      }
       cancel(): void {
    this.router.navigate(['/home/batch/viewBatch']);
  }
      
}
