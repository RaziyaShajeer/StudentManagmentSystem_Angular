export interface trialStudent{
    trialStudentId: string;
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    phone: string;
    // status: StudentStatus;
    branchId: string;

     status: string;
  companyName?: string | null;
}
export enum StudentStatus {
  Registered = 'Registered',
  Enrolled = 'Enrolled',
  Deleted = 'Deleted'
}