// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrmComponent } from './sections/crm/crm.component';
//import { ContractsComponent } from './sections/crm/sales/contracts/contracts.component';
import { MarketingComponent } from './sections/marketing/marketing.component';
import { HomeComponent } from './home/home.component';
import { ClientsComponent } from './sections/crm/sales/clients/clients.component';
import { ContactsComponent } from './sections/crm/sales/contacts/contacts.component';
import { LeadsComponent } from './sections/crm/sales/leads/leads.component';
import { OpportunitiesComponent } from './sections/crm/sales/opportunities/opportunities.component';
import { RequestsComponent } from './sections/crm/sales/requests/requests.component';
import { VendorsComponent } from './sections/crm/operation/vendors/vendors.component';
import { AnagraphicComponent } from './sections/crm/hr/anagraphic/anagraphic.component';
import { PipeProfileComponent } from './sections/crm/hr/pipe-profile/pipe-profile.component';
import { ArchiveComponent } from './sections/crm/admin/archive/archive.component';
import { AdminPanelComponent } from './sections/crm/admin/admin-panel/admin-panel.component';
import { LeadDetailComponent } from './sections/crm/sales/leads/lead-detail/lead-detail.component';
import { ContractsComponent } from './sections/contracts/contracts.component';
import { SalesContractsComponent } from './sections/crm/sales/sales-contracts/sales-contracts.component';
import { OpportunityDetailComponent } from './sections/crm/sales/opportunities/opportunity-detail/opportunity-detail.component';
import { RequestDetailComponent } from './sections/crm/sales/requests/request-detail/request-detail.component';
import { ClientDetailComponent } from './sections/crm/sales/clients/client-detail/client-detail.component';
import { RegisterComponent } from './sections/auth/register/register.component';
import { LoginComponent } from './sections/auth/login/login.component';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { SalesContractsDetailComponent } from './sections/crm/sales/sales-contracts/sales-contracts-detail/sales-contracts-detail.component';
import { VendorDetailComponent } from './sections/crm/operation/vendors/vendor-detail/vendor-detail.component';
import { EmployeeDetailComponent } from './sections/crm/hr/anagraphic/employee-detail/employee-detail.component';
import { HelpDeskDetailComponent } from './sections/crm/hr/pipe-profile/profiles/help-desk-pipe/help-desk-detail/help-desk-detail.component';
import { NewUserComponent } from './sections/auth/new-user/new-user.component';
import { BudgetsComponent } from './sections/marketing/budgets/budgets.component';
import { ClientAnalisysComponent } from './sections/marketing/dashboard/client-analisys/client-analisys.component';
import { LeadAnalisysComponent } from './sections/marketing/dashboard/lead-analisys/lead-analisys.component';
import { CommercialPipeComponent } from './sections/marketing/dashboard/commercial-pipe/commercial-pipe.component';
import { DeveloperDetailComponent } from './sections/crm/hr/pipe-profile/profiles/developer-pipe/developer-detail/developer-detail.component';
import { SystemDetailComponent } from './sections/crm/hr/pipe-profile/profiles/system-pipe/system-detail/system-detail.component';
import { NetworkDetailComponent } from './sections/crm/hr/pipe-profile/profiles/network-pipe/network-detail/network-detail.component';
import { PnlComponent } from './sections/crm/sales/requests/pnl/pnl.component';

const redirectUnauthorized = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  { path: 'register', component: RegisterComponent },
  { path: 'new-user', component: NewUserComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'crm',
    component: CrmComponent,
    ...canActivate(redirectUnauthorized),
    children: [
      { path: 'clients', component: ClientsComponent },
      { path: 'clients/:id', component: ClientDetailComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'leads', component: LeadsComponent },
      { path: 'leads/:id', component: LeadDetailComponent },
      { path: 'opportunities', component: OpportunitiesComponent },
      { path: 'opportunities/:id', component: OpportunityDetailComponent },
      { path: 'requests', component: RequestsComponent },
      { path: 'pnl/:id', component: PnlComponent }, //the id references the request id
      { path: 'requests/:id', component: RequestDetailComponent },
      { path: 'sales-contracts', component: SalesContractsComponent },
      { path: 'sales-contracts/:id', component: SalesContractsDetailComponent },
      { path: 'vendors', component: VendorsComponent },
      { path: 'vendors/:id', component: VendorDetailComponent },
      { path: 'anagraphic', component: AnagraphicComponent },
      {
        path: 'anagraphic/employee-detail/:id',
        component: EmployeeDetailComponent,
      },
      { path: 'pipe-profile', component: PipeProfileComponent },
      {
        path: 'pipe-profile/help-desk/:id',
        component: HelpDeskDetailComponent,
      },
      {
        path: 'pipe-profile/developer/:id',
        component: DeveloperDetailComponent,
      },
      {
        path: 'pipe-profile/system/:id',
        component: SystemDetailComponent,
      },
      {
        path: 'pipe-profile/network/:id',
        component: NetworkDetailComponent,
      },
      { path: 'archived-leads', component: ArchiveComponent },
      { path: 'archived-opportunities', component: ArchiveComponent },
      { path: 'archived-requests', component: ArchiveComponent },
      { path: 'archived-contracts', component: ArchiveComponent },
      { path: 'admin-panel', component: AdminPanelComponent },
    ],
  },
  { path: 'contracts', component: ContractsComponent },
  {
    path: 'marketing',
    component: MarketingComponent,
    ...canActivate(redirectUnauthorized),
    children: [
      { path: 'budgets', component: BudgetsComponent },
      {
        path: 'dashboard/client-analisys',
        component: ClientAnalisysComponent,
      },
      {
        path: 'dashboard/lead-analisys',
        component: LeadAnalisysComponent,
      },
      {
        path: 'dashboard/commercial-pipe',
        component: CommercialPipeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule], // Export the RouterModule so that it can be used in the AppModule
})
export class AppRoutingModule {}
