export interface StudentIndividualFee {
  studentId: string;
  studentName: string;
  courseName: string;
  totalPaidAmount: number;
  balance: number;
  totalAmount: number;
}

export interface FinalReportDTO {
  totalAmountPaid: number;
  totalBalanceAmount: number;
  totalDueAmount: number;
  totalFees: number;
  studentIndividulfees: StudentIndividualFee[];
}
