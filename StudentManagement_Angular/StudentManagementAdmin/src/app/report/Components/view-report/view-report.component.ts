import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fees,InstallmentStatus } from '../../Models/fees';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportService } from '../../Services/report.service';


import { FinalReportDTO } from '../../Models/final-report.model';
import { StudentFeeSummary } from '../../Models/student-fee-summary.model';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.css']
})
export class ViewReportComponent implements OnInit{

  
  fee:any[]=[];
finalReport?:FinalReportDTO;
allStudents: any[] = [];
summarizedFees: any[] = [];
students: StudentFeeSummary[] = [];

  public feeStatus=InstallmentStatus;
  searchForm!:FormGroup
  filterFee:any[]=[]

    //added
  studentId!:string
  constructor(
    private service:ReportService,
    private router:Router,
    private fb:FormBuilder,
    private reportService:ReportService){}

ngOnInit(): void {
  // this.service.getAllFees().subscribe(data => {
  //   console.log('Received fees data:', data);
  //   this.fee = data;
  //   this.filterFee = this.fee;

    
  //   this.summarizeFeesByStudent();

  // this.searchForm = this.fb.group({
  //   fromDate: [''],
  //   toDate: [''],
  //   status: [''],
  //   branch: ['']


  // // this.loadAllFees();
  // }
  // );


  this.searchForm = this.fb.group({
    fromDate: [''],
    toDate: [''],
    status: [''],
      branchId: ['ALL']  // default = All

  });

  this.loadAllTimeData();
  this.loadBranches();
}
branches: any[] = [];



//added
// summarizeFeesByStudent(): void {
//   const grouped: { [key: string]: any } = {};
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   for (const item of this.filterFee) {
    
//     const studentKey = item.studentId ?? item.studentName ?? 'Unknown';

//     // Create group if it doesn’t exist
//     if (!grouped[studentKey]) {
//   grouped[studentKey] = {
//     studentId: item.studentId ?? 'N/A',
//     studentName: item.studentName || 'Unknown',
//     paidAmount: 0,
//     balance: 0,
//     overdue: 0,
//     totalDue: 0,
//     feeStructureId: item.feeStructureId ?? ''
//   };
// }


//     // Normalize due date
//     const dueDate =
//       typeof item.dueDate === 'string'
//         ? new Date(item.dueDate)
//         : item.dueDate instanceof Date
//         ? item.dueDate
//         : new Date();
//     dueDate.setHours(0, 0, 0, 0);


//     grouped[studentKey].paidAmount += item.amountReceived ?? 0;
//     grouped[studentKey].totalDue += item.amount ?? 0;
//     grouped[studentKey].balance =
//       grouped[studentKey].totalDue - grouped[studentKey].paidAmount;

    
//     const isNotFullyPaid = item.status === 1 || item.status === 2;
//     const isPastDue = dueDate < today;

//     if (isNotFullyPaid && isPastDue && item.dueAmount > 0) {
//       grouped[studentKey].overdue += item.dueAmount;
//     }
//   }

//   this.summarizedFees = Object.values(grouped);
//   console.log(' Summarized Fees (with IDs):', this.summarizedFees);
// }


// onSearch() {
//   const { fromDate, toDate, status,branch } = this.searchForm.value;

//   if (!fromDate || !toDate) {
//     alert("Please select both From and To dates.");
//     return;
//   }

//   const parsedFromDate = new Date(fromDate);
//   const parsedToDate = new Date(toDate);

//   parsedFromDate.setHours(0, 0, 0, 0);
//   parsedToDate.setHours(23, 59, 59, 999);

//   this.reportService.getFeesByCriteria(parsedFromDate, parsedToDate, status).subscribe({
//     next: data => {

//       let result=data;
//       if (branch && branch.trim() !== '') {
//         result = result.filter(
//           (f: any) => f.branchName?.toLowerCase() === branch.toLowerCase()
//         );
      
//       }
//           this.filterFee = result;
//       // this.filterFee = data;
//       this.summarizeFeesByStudent(); 
//     },
//     error: err => {
//       console.error(err);
//       this.filterFee = [];
//       this.summarizedFees = []; 
//     }
//   });
// }
//  loadAllFees() {
//     this.reportService.getFinalFeeReport().subscribe({
//       next: (res: any) => {
//         console.log('DEFAULT LOAD:', res);
//         this.summarizedFees = res.studentIndividualfees ?? [];
//       },
//       error: err => {
//         console.error(err);
//         this.summarizedFees = [];
//       }
//     });
//   }

 loadAllTimeData() {
    this.reportService.getFinalFeeReport().subscribe({
      next: (res: any) => {
        this.finalReport = res;

        // full list
        this.allStudents = res.studentIndividulfees ?? [];

        // default table data
        this.summarizedFees = [...this.allStudents];
      },
      error: () => {
        this.allStudents = [];
        this.summarizedFees = [];
      }
    });
  }

  loadBranches(): void {
  this.reportService.getBranches()
   
    .subscribe({
      next: data => this.branches = data,
      error: err => console.error('Failed to load branches', err)
    });
}

downloadExcel() {

   const { fromDate, toDate, status, branch } = this.searchForm.value;
   if ((!fromDate && toDate)||(fromDate && !toDate)) {
    alert('Select both dates');
    return;
  }
  const startDate = fromDate.toISOString().split('T')[0];
  const endDate = toDate.toISOString().split('T')[0];
console.log("Date selected");

  this.reportService.downloadFeeExcel(startDate, endDate, status, branch).subscribe({
    next: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'Fees.xlsx'; // you can change name
      a.click();

      window.URL.revokeObjectURL(url);
    },
    error: err => {
      console.error('Excel download failed', err);
    }
  });
}

viewStudent(student: any) {
  console.log('Clicked student:', student);

  this.router.navigate([
    '/home/report/student-report',
    student.studentId
  ]);
}










// viewStudent(student: any) {
//   console.log('Clicked student:', student);

//   if (!student.feeStructureId) {
//     console.error('Missing feeStructureId', student);
//     return;
//   }

//   this.router.navigate([
//     '/home/report/student-report',
//     student.feeStructureId
//   ]);
// }



onSearch() {
  const { fromDate, toDate } = this.searchForm.value;

  if ((!fromDate && toDate)||(fromDate && !toDate)) {
    alert('Please select both From and To dates.');
    return;
  }

  this.reportService.getFinalFeeReport().subscribe({
    next: (res: any) => {
      console.log('REPORT RESPONSE:', res);

      // totals
      this.finalReport = res;

      // student rows (EXACT name from Swagger)
      this.summarizedFees = res.studentIndividualfees ?? [];
    },
    error: err => {
      console.error('API ERROR:', err);
      this.finalReport = undefined;
      this.summarizedFees = [];
    }
  });

  // this.loadAllFees();
}

onSearchFeesNew() {
  const { fromDate, toDate, status, branchId } = this.searchForm.value;


  if (!fromDate && !toDate && !status && !branchId) {
    alert('choose atleastanything');
    return;
  }

  if ((fromDate && !toDate) || (!fromDate && toDate)) {
    alert('Please select both From and To dates');
    return;
  }
  const finalBranchId = branchId === 'ALL' ? null : branchId;
  
  let startDate: string | undefined;
  let endDate: string | undefined;



  if (fromDate && toDate) {
    startDate = new Date(fromDate).toISOString().slice(0, 10);
    endDate   = new Date(toDate).toISOString().slice(0, 10);
  }

  this.reportService
    .searchFeesWithFilters(startDate, endDate, status, finalBranchId)
    .subscribe({
      next: (res: FinalReportDTO) => {
        this.summarizedFees = res.studentIndividulfees ?? [];

        this.finalReport =
          this.summarizedFees.length === 0
            ? {
                totalAmountPaid: 0,
                totalBalanceAmount: 0,
                totalDueAmount: 0,
                totalFees: 0,
                studentIndividulfees: []
              }
            : res;
      },
      error: err => {
        console.error('Search failed', err);
        this.summarizedFees = [];
      }
    });
}





getTodayTotalCollection(): number {
  const today = new Date();
  let total = 0;

  for (const row of this.filterFee) {
    const dueDate = this.parseLocalDate(row.dueDate);
    const isToday =
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear();

    if (
      isToday &&
      (row.status === this.feeStatus.paid || row.status === this.feeStatus.pending||row.status===this.feeStatus.partiallyPaid) &&
      row.amount
    ) {
      total += Number(row.amount);
    }
  }
  return total;
}

getTodayCollected(): number {
  const today = new Date();
  let total = 0;

  for (const row of this.filterFee) {
    const dueDate = this.parseLocalDate(row.dueDate);
    const isToday =
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear();

    if (isToday && ((row.status === this.feeStatus.paid)||(row.status === this.feeStatus.partiallyPaid)) && row.amountReceived) {
      total += Number(row.amountReceived);
    }
  }
  return total;
}

getTodayPending(): number {
  
   let total = 0;
   total=this.getTodayTotalCollection()-this.getTodayCollected()
  return total;
}

getMonthTotalCollection(): number {
  const month = new Date();
  let total = 0;

  for (const row of this.filterFee) {
    const dueDate = this.parseLocalDate(row.dueDate);
    const isMonth =
      dueDate.getMonth() === month.getMonth() &&
      dueDate.getFullYear() === month.getFullYear();

    if (
      isMonth &&
      (row.status === this.feeStatus.paid || row.status === this.feeStatus.pending||row.status===this.feeStatus.partiallyPaid) &&
      row.amount
    ) {
      total += Number(row.amount);
    }
  }
  return total;
}

getMonthCollected(): number {
  const month = new Date();
  let total = 0;

  for (const row of this.filterFee) {
    const dueDate = this.parseLocalDate(row.dueDate);
    const isMonth =
      dueDate.getMonth() === month.getMonth() &&
      dueDate.getFullYear() === month.getFullYear();

    if (isMonth && ((row.status === this.feeStatus.paid)||(row.status === this.feeStatus.partiallyPaid)) && row.amountReceived) {
      total += Number(row.amountReceived);
    }
  }
  return total;
}

getMonthPending(): number {
  
  let total = 0;
  total=this.getMonthTotalCollection()-this.getMonthCollected();
  return total;
}

// viewDetails(student: any): void {
//   if (!student.feeStructureId) {
//     console.warn('No feeStructureId found for student:', student);
//     return;
//   }

//   this.service.getFeeStructureById(student.feeStructureId).subscribe({
//     next: (response) => {
//       this.studentId = response.studentId;
//       this.router.navigate(['/home/report/student-report', this.studentId]);
//     },
//     error: (err) => {
//       console.error('Failed to fetch fee structure:', err);
//     }
//   });
// }



displayedColumns: string[] = ['studentId', 'studentName', 'courseName', 'amount', 'balance', 'dueDate', 'status', 'detail'];


  getRowClass(row: any): string {
  const today = new Date();
  const dueDate = this.parseLocalDate(row.dueDate);

  if (row.status === this.feeStatus.paid) {
    return 'paid-status'; // Green
  }

  if (row.status === this.feeStatus.partiallyPaid) {
    return 'partial-status'; // Green
  }

  if (
    row.status === this.feeStatus.pending &&
    dueDate.getDate() < today.getDate() &&
    dueDate.getMonth() === today.getMonth() &&
    dueDate.getFullYear() === today.getFullYear()
  ) {
    return 'due-over'; // Red
  }

  if (
    row.status === this.feeStatus.pending &&
    dueDate.getDate() === today.getDate() &&
    dueDate.getMonth() === today.getMonth() &&
    dueDate.getFullYear() === today.getFullYear()
  ) {
    return 'due-today'; // Red
  }

  if (
    row.status === this.feeStatus.pending &&
    dueDate.getDate() > today.getDate() &&
    dueDate.getMonth() === today.getMonth() &&
    dueDate.getFullYear() === today.getFullYear()
  ) {
    return 'due-this-month'; // Yellow
  }

  return '';
}

parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-based
}

parseLocalDated(input: string | Date): Date {
  if (input instanceof Date) {
    return new Date(input); // Return a new Date instance
  }

  if (typeof input === 'string') {
    const [year, month, day] = input.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  throw new Error('Invalid date format');
}

//final row
getTotalPaid(): number {
  return this.summarizedFees.reduce(
    (sum, s) => sum + (s.paidAmount || 0),
    0
  );
}

getTotalBalance(): number {
  return this.summarizedFees.reduce(
    (sum, s) => sum + (s.balance || 0),
    0
  );
}

getTotalOverdue(): number {
  return this.summarizedFees.reduce(
    (sum, s) => sum + (s.overdue || 0),
    0
  );
}

getGrandTotal(): number {
  return this.summarizedFees.reduce(
    (sum, s) => sum + (s.totalDue || 0),
    0
  );
}

}
