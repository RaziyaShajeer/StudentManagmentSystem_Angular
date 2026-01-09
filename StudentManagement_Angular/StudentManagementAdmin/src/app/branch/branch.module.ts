import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchRoutingModule } from './branch-routing.module';
import { SelectBranchComponent } from './Components/select-branch/select-branch.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import {  RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { AddBranchComponent } from './Components/add-branch/add-branch.component';
import { UpdateBranchComponent } from './Components/update-branch/update-branch.component';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    SelectBranchComponent,
    AddBranchComponent,
    UpdateBranchComponent
  ],
  imports: [
    CommonModule,
    BranchRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    RouterModule,
    MatSelectModule,
    MatInputModule
  
    
    
  ]
})
export class BranchModule { }
