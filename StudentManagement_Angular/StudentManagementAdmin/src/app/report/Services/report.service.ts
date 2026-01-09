import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FinalReportDTO } from '../Models/final-report.model';
import { environment } from 'src/app/environment/environment';
@Injectable({
  providedIn: 'root'
})

export class ReportService {
  // private apiUrl = 'https://localhost:7183/api/AdminReport/fees';

  // private feeUrl = `${environment.baseurl}/fee`;
 private reportUrl = `${environment.baseurl}/fees`;


  
  constructor(private http: HttpClient) { }


  //  getFeesByCriteria(
  //   fromDate: Date,
  //   toDate: Date,
  //   status: number | null
  // ): Observable<any[]> {

  //   let params = new HttpParams()
  //     .set('startDate', fromDate.toISOString().split('T')[0])
  //     .set('endDate', toDate.toISOString().split('T')[0]);

  //   if (status !== null && status !== undefined) {
  //     params = params.set('status', status);
  //   }

  //   return this.http.get<any[]>(this.feeUrl, { params });
  // }
 getFinalFeeReport(
  startDate?: string,
  endDate?: string,
  status?: number | null,
  branch?: string | null
): Observable<FinalReportDTO> {

  let params = new HttpParams();

  if (startDate) params = params.set('startDate', startDate);
  if (endDate)   params = params.set('endDate', endDate);
  if (status !== null && status !== undefined)
    params = params.set('status', status);
  if (branch) params = params.set('Branch', branch);

  return this.http.get<FinalReportDTO>(this.reportUrl, { params });
}



searchFeesWithFilters(
  startDate?: string,
  endDate?: string,
  status?: number | null,
  branchId?: string | null
) {
  let params = new HttpParams();

  if (startDate) params = params.set('startDate', startDate);
  if (endDate) params = params.set('endDate', endDate);
  if (status !== null && status !== undefined) {
    params = params.set('status', status);
  }
  if (branchId) {
    params = params.set('Branch', branchId); // must match backend
  }

  return this.http.get<any>(`${environment.baseurl}/fees`, { params });
}



getAllBranches(): Observable<any[]> {
  return this.http.get<any[]>(
    `${environment.baseurl}/GetAllBranches`
  );
}


downloadFeeExcel( startDate?: string,
  endDate?: string,
  status?: number | null,
  branchId?: string | null) {
    let params = new HttpParams();

  if (startDate) params = params.set('startDate', startDate);
  if (endDate) params = params.set('endDate', endDate);
  if (status !== null && status !== undefined) {
    params = params.set('status', status);
  }
  if (branchId) {
    params = params.set('Branch', branchId); // must match backend
  }
return this.http.get(
    `${environment.baseurl}/getfeebyexcelfile`,
    {
      params,
      responseType: 'blob'   // ✅ Excel file
    }
  );
}

getAllFeeStructures() {
  return this.http.get<any[]>(`${environment.baseurl}/feestructure`);
}

getFeesByFeeStructureId(id: string) {
  return this.http.get<any[]>(
    `${this.baseUrl}/api/v1/fees/${id}`
  );
}


getFeeStructureByStudentId(studentId: string) {
  return this.http.get<any[]>(
    `${this.baseUrl}/api/v1/feestructure?studentId=${studentId}`
  );
}

getFeesByStudentId(studentId: string) {
  return this.http.get<any[]>(
    `${this.baseUrl}/api/v1/GetFeesByStudentId/${studentId}`
  );
}



GetFeesss(){
  return this.http.get<any[]>(`${environment.baseurl}/fees`);
}
getBranches() {
   console.log("branch");
  return this.http.get<any[]>(`${environment.baseurl}/GetAllBranches`)
 
}

private baseUrl = environment.fileBaseUrl;





}

