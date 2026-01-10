export interface StudentFeeSummary {
  studentId: string;
  studentName: string;
  courseName: string;
  feeStructureId: string;
  totalPaidAmount: number;
  balance: number;
}
