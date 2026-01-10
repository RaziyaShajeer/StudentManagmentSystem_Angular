import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from '../../Services/report.service';

@Component({
  selector: 'app-view-student-report',
  templateUrl: './view-student-report.component.html',
  styleUrls: ['./view-student-report.component.css']
})
export class ViewStudentReportComponent implements OnInit {

  studentId: string = '';
feeStructureId: string = '';
fees: any[] = [];

studentName = '';
courseName = '';


  constructor(
    private route: ActivatedRoute,
    private service: ReportService
  ) {}

  // ngOnInit(): void {
  // const feeStructureId = this.route.snapshot.paramMap.get('id');

  // if (feeStructureId) {
  //   this.reportService
  //     .getFeesByFeeStructureId(feeStructureId)
  //     .subscribe(res => {
  //       this.studentFees = res;

  //       if (res.length > 0) {
  //         this.studentName = res[0].studentName;
  //         this.courseName = res[0].courseName;
  //       }
  //     });
  // }

ngOnInit(): void {
  this.studentId =
    this.route.snapshot.paramMap.get('studentId') ?? '';

  if (!this.studentId) {
    console.error('StudentId missing');
    return;
  }

  this.loadStudentFees();
}

loadStudentFees(): void {
  this.service.getFeesByStudentId(this.studentId).subscribe({
    next: (res: any[]) => {
      console.log('API response:', res);

      this.fees = res ?? [];

      if (this.fees.length > 0) {
        this.studentName = this.fees[0].studentName;
        this.courseName = this.fees[0].courseName;
      }
    },
    error: err => {
      console.error('API error', err);
      this.fees = [];
    }
  });
}







loadFeeStructureId(): void {
  this.service.getFeesByStudentId(this.studentId).subscribe({
  next: (res: any[]) => {

    console.log('API raw response:', res);

    if (!res || res.length === 0) {
      this.fees = [];
      return;
    }

    // ✅ THIS IS THE FIX
    this.fees = res[0].feeInstallment ?? [];

    console.log('Final fees used by UI:', this.fees);
  },
  error: (err: any) => {
    console.error('API error', err);
    this.fees = [];
  }
});

}





// loadStudentFees(): void {
//   this.service.getFeeStructureByStudentId(this.studentId).subscribe({
//     next: (res: any[]) => {
//       console.log('API raw response:', res);

//       const feeStructure =
//         res?.[0]
//           ?.courseDetail
//           ?.profile
//           ?.feeStructure?.[0];

//       if (!feeStructure) {
//         console.error('FeeStructure not found');
//         this.fees = [];
//         return;
//       }

//       // ✅ THIS WAS THE MISSING LINK
//       this.fees = feeStructure.feeInstallment ?? [];

//       this.studentName =
//         res[0]?.courseDetail?.profile?.firstName ?? '';

//       this.courseName =
//         res[0]?.courseDetail?.course?.courseName ?? '';

//       console.log('Final fees:', this.fees);
//     },
//     error: (err: any) => {
//       console.error('API error', err);
//       this.fees = [];
//     }
//   });
// }






  getBalance(fee: any): number {
    return (fee.amount ?? 0) - (fee.amountReceived ?? 0);
  }
}


//   //   this.studentId = this.route.snapshot.paramMap.get('studentId') ?? '';
//   //   console.log('Student ID:', this.studentId);

//   //   if (this.studentId) {
//   //     this.loadStudentFees();
//   //   }
//   // }

//   // loadStudentFees(): void {
//   //   this.service.getFeesByStudentId(this.studentId).subscribe({
//   //     next: (data) => {
//   //       console.log('Student fees:', data);
//   //       this.studentFees = data;

//   //       if (data.length > 0) {
//   //         this.studentName = data[0].studentName || 'Unknown';
//   //         this.courseName = data[0].courseName || 'N/A';
//   //       }
//   //     },
//   //     error: (err) => {
//   //       console.error('Error fetching student fees:', err);
//   //     }
//   //   });
//   // }

//   const id = this.route.snapshot.paramMap.get('id');

//   if (id) {
//       this.loadFeesByFeeStructure(id);
//     }
//   }




// loadFeesByFeeStructure(feeStructureId: string): void {
//     this.reportService.getFeesByFeeStructureId(feeStructureId).subscribe({
//       next: (res: any[]) => {
//         this.studentFees = res;

//         if (res.length > 0) {
//           this.studentName = res[0].studentName;
//           this.courseName = res[0].courseName;
//         }
//       },
//       error: (err) => {
//         console.error('Error loading student fees', err);
//         this.studentFees = [];
//       }
//     });
//   }
  

//   getBalance(item: any): number {
//     return (item.amount ?? 0) - (item.amountReceived ?? 0);
//   }
                                              
// }

