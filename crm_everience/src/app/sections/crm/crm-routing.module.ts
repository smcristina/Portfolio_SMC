import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrmComponent } from './crm.component';
import { MatTableModule } from '@angular/material/table';

const routes: Routes = [
  {
    path: '',
    component: CrmComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Import RouterModule for child routes
  exports: [RouterModule],
})
export class CrmRoutingModule {}
