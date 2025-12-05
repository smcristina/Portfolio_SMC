import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';

//components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { CrmComponent } from './sections/crm/crm.component';
import { MarketingComponent } from './sections/marketing/marketing.component';
import { MenuComponent } from './components/crm-menu/menu.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeadsComponent } from './sections/crm/sales/leads/leads.component';
import { OpportunitiesComponent } from './sections/crm/sales/opportunities/opportunities.component';
import { LeadDetailComponent } from './sections/crm/sales/leads/lead-detail/lead-detail.component';
import { CreateLeadModalComponent } from './modals/create-lead-modal/create-lead-modal.component';
import { OpportunityDetailComponent } from './sections/crm/sales/opportunities/opportunity-detail/opportunity-detail.component';
import { RequestsComponent } from './sections/crm/sales/requests/requests.component';
import { RequestDetailComponent } from './sections/crm/sales/requests/request-detail/request-detail.component';
import { ClientsComponent } from './sections/crm/sales/clients/clients.component';
import { CreateClientModalComponent } from './modals/create-client-modal/create-client-modal.component';
import { ClientDetailComponent } from './sections/crm/sales/clients/client-detail/client-detail.component';
import { LoginComponent } from './sections/auth/login/login.component';
import { RegisterComponent } from './sections/auth/register/register.component';
import { ContactsComponent } from './sections/crm/sales/contacts/contacts.component';
import { CreateContactModalComponent } from './modals/create-contact-modal/create-contact-modal.component';
import { SalesContractsComponent } from './sections/crm/sales/sales-contracts/sales-contracts.component';
import { VendorsComponent } from './sections/crm/operation/vendors/vendors.component';
import { CreateVendorModalComponent } from './modals/create-vendor-modal/create-vendor-modal.component';
import { AnagraphicComponent } from './sections/crm/hr/anagraphic/anagraphic.component';
import { EmployeeDetailComponent } from './sections/crm/hr/anagraphic/employee-detail/employee-detail.component';
import { MarketingMenuComponent } from './components/marketing-menu/marketing-menu.component';
import { PipeProfileComponent } from './sections/crm/hr/pipe-profile/pipe-profile.component';
import { HelpDeskPipeComponent } from './sections/crm/hr/pipe-profile/profiles/help-desk-pipe/help-desk-pipe.component';
import { DeveloperPipeComponent } from './sections/crm/hr/pipe-profile/profiles/developer-pipe/developer-pipe.component';
import { SystemPipeComponent } from './sections/crm/hr/pipe-profile/profiles/system-pipe/system-pipe.component';
import { NetworkPipeComponent } from './sections/crm/hr/pipe-profile/profiles/network-pipe/network-pipe.component';
import { VendorDetailComponent } from './sections/crm/operation/vendors/vendor-detail/vendor-detail.component';
import { AdminPanelComponent } from './sections/crm/admin/admin-panel/admin-panel.component';
import { ConvertLeadModalComponent } from './modals/convert-lead-modal/convert-lead-modal.component';
import { SalesContractsDetailComponent } from './sections/crm/sales/sales-contracts/sales-contracts-detail/sales-contracts-detail.component';
import { NewUserComponent } from './sections/auth/new-user/new-user.component';
import { HelpDeskDetailComponent } from './sections/crm/hr/pipe-profile/profiles/help-desk-pipe/help-desk-detail/help-desk-detail.component';
import { DeveloperDetailComponent } from './sections/crm/hr/pipe-profile/profiles/developer-pipe/developer-detail/developer-detail.component';
import { SystemDetailComponent } from './sections/crm/hr/pipe-profile/profiles/system-pipe/system-detail/system-detail.component';
import { NetworkDetailComponent } from './sections/crm/hr/pipe-profile/profiles/network-pipe/network-detail/network-detail.component';
import { ContractsComponent } from './sections/contracts/contracts.component';
import { ContractsMenuComponent } from './components/contracts-menu/contracts-menu.component';
import { ArchiveComponent } from './sections/crm/admin/archive/archive.component';
//Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { ConvertOpportunityModalComponent } from './modals/convert-opportunity-modal/convert-opportunity-modal.component';
import { ConvertRequestModalComponent } from './modals/convert-request-modal/convert-request-modal.component';
import { ContractsDataModalComponent } from './modals/contracts-data-modal/contracts-data-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateEmployeeModalComponent } from './modals/create-employee-modal/create-employee-modal.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ModifyEmployeeModalComponent } from './modals/modify-employee-modal/modify-employee-modal.component';
import { CreateSkillsModalComponent } from './modals/create-skills-modal/create-skills-modal.component';
import { PnlComponent } from './sections/crm/sales/requests/pnl/pnl.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NewUserComponent,
    CrmComponent,
    HomeComponent,
    MarketingComponent,
    MenuComponent,
    MarketingMenuComponent,
    ContractsMenuComponent,
    TopBarComponent,
    ClientsComponent,
    ClientDetailComponent,
    ContactsComponent,
    LeadsComponent,
    LeadDetailComponent,
    OpportunitiesComponent,
    OpportunityDetailComponent,
    RequestsComponent,
    PnlComponent,
    RequestDetailComponent,
    SalesContractsComponent,
    SalesContractsDetailComponent,
    VendorsComponent,
    VendorDetailComponent,
    AnagraphicComponent,
    EmployeeDetailComponent,
    PipeProfileComponent,
    HelpDeskPipeComponent,
    HelpDeskDetailComponent,
    DeveloperPipeComponent,
    DeveloperDetailComponent,
    SystemPipeComponent,
    SystemDetailComponent,
    NetworkPipeComponent,
    NetworkDetailComponent,
    AdminPanelComponent,
    ContractsComponent,
    ArchiveComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormField,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    CreateLeadModalComponent,
    CreateClientModalComponent,
    CreateContactModalComponent,
    CreateEmployeeModalComponent,
    CreateVendorModalComponent,
    ConvertLeadModalComponent,
    ConvertOpportunityModalComponent,
    ConvertRequestModalComponent,
    ContractsDataModalComponent,
    HttpClientModule,
    ModifyEmployeeModalComponent,
    CreateSkillsModalComponent
   
  ],
  bootstrap: [AppComponent],
  providers: [
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'everience-crm',
        appId: '1:321596356788:web:c9400c3f4def89f540ffe1',
        storageBucket: 'everience-crm.firebasestorage.app',
        apiKey: 'AIzaSyBMRVwYzJnMLu1yHBpE83qru9YmVBxopjs',
        authDomain: 'everience-crm.firebaseapp.com',
        messagingSenderId: '321596356788',
      })
    ),
    provideAuth(() => getAuth()),
  ],
})
export class AppModule {}
