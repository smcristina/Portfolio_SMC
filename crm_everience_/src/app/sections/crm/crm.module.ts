import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CrmComponent } from './crm.component';
import { LeadsComponent } from './sales/leads/leads.component';
import { LeadDetailComponent } from './sales/leads/lead-detail/lead-detail.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, RouterModule],
  exports: [],
})
export class CrmModule {}
