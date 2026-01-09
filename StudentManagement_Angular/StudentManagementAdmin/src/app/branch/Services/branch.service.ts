import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment/environment';
import { Branch } from '../Models/branch';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  

  constructor(private http: HttpClient) {}

  addBranch(data:any) {
    return this.http.post(`${environment.baseurl}/addbranch`,data);
  }

  getAllBranches(){
    return this.http.get<Branch[]>(`${environment.baseurl}/GetAllBranches`)
  }

  updateBranch(id: string, data: any) {
  return this.http.put(`${environment.baseurl}/UpdateBranch/${id}`, data);
}

  deleteBranch(id: string) {
  return this.http.delete(`${environment.baseurl}/DeleteBranch/${id}`);
}

  getBranchById(id: string) {
    return this.http.get<Branch>(`${environment.baseurl}/GetBranchById/${id}`);
  }


}
