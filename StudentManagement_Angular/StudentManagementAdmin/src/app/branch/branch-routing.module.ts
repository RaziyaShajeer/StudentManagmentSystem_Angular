import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectBranchComponent } from './Components/select-branch/select-branch.component';
import { AddBranchComponent } from './Components/add-branch/add-branch.component';
import { UpdateBranchComponent } from './Components/update-branch/update-branch.component';

const routes: Routes = [
  {path:'',component:SelectBranchComponent},
  {path:'addbranch',component:AddBranchComponent},
  { path: 'edit/:id', component: UpdateBranchComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchRoutingModule { }
