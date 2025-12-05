import { Component, OnInit } from '@angular/core';
import { ConfirmationModalComponent } from '../../../../modals/confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact, ContactService } from '../../../../services/crm/contacts.service';



@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})

export class ContactsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private contactService: ContactService,
    private router: Router
    
  ) {}

  editing: boolean = false; 

  displayedColumns: string[] = [
    'company_name',
    'contact_name',
    'contact_email',
    'contact_phone',
    'contact_role',
    'contact_source',
    'edit',
    'archive',
  ];

  contacts: Contact[] = [];
  contact: any;
  id! : number;
  isLoading = true;
  error: string | null = null;
  dataSource: any;
  searchTerm: string = ''; // Stores user input

  ngOnInit(): void {
    this.fetchContacts();
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    // console.log('ID from route:', id);
    // NON VIENE UTILIZZATO MA è STATO CREATO PER EVENTUALI OCCASIONI
    if (id) {
      this.id = +id;
      this.contactService.getContactById(id).subscribe({
        next: (contact) => {
          this.contacts.push(contact);
        },
        error: (err)=> {
          console.error('Error fetching contact by ID:', err);
        },
        });
    }
  }
  

  fetchContacts(): void {
    this.contactService.getContacts().subscribe({
      next: (data) => {
        this.contacts = data;
        this.isLoading = false;
        this.dataSource = this.contacts;
      },
      error: (err) => {
        this.error = 'Failed to load contacts.';
        this.isLoading = false;
        console.error(err);
      },
    });
  }


  openDetailedView(id: string) {
    console.log(id);
  }

  openModal() {
    const modal = document.querySelector('.modal-container');
    modal?.classList.add('active');
  }

  createContact(newContact: any): void {
    this.contactService.postContact(newContact).subscribe({
      next: (response) => {
        console.log('Contact created successfully', response);
        this.fetchContacts();
      },
      error: (error) => {
        console.error('Error creating contact:', error);
      },
    });
  }

  handleNewContact(newContact: any) {
    this.contacts.push(newContact);
  }

  ////////////////////////////////////////////da guardare
  // handleNewContact(newContact: any) {
  //     this.contactService.postContact(
  //     newContact.contact_name,
  //     newContact.contact_role,
  //     newContact.contact_phone,
  //     newContact.contact_mail, 
  //     newContact.contact_source,
  //     newContact.company_name,
  //     0).subscribe({
  //       next: (savedContact: any) =>{
  //         this.contacts.push(savedContact);
  //         this.dataSource = this.contacts;
  //         console.log('Contact created successfully:', savedContact);
  //         this.fetchContacts();
  //       },
  //       error: (err) => {
  //         console.error('Error creating contact:', err);
  //       }
  //     });
  // }


  applyFilter() {
    if (this.searchTerm.length < 2) {
      this.dataSource = this.contacts; // Reset if less than 2 characters
      return;
    }

    this.dataSource = this.contacts.filter((contact) =>
      Object.values(contact).some((value) =>
        value?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }   
      
  editContact(){
    this.editing = !this.editing;
  }

  changesContact(){
    this.contactService.putContact(this.id, this.contact).subscribe({
      next: () => {
        this.router.navigate(['/crm/sales/contacts', this.contact.id]);
        this.editing = false;
      },
      error: (err) => {
        console.error('Error updating contact:', err);
      }
    });
  }


//ARCHIVIAZIONE
 openConfirmDialog(id: number) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: { message: 'Sei sicuro di volere archiviare questa rubrica?' },
      autoFocus: false,
    });

  dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.archiveContact(id);
      } else {
        console.log('Archiviato.');
      }
    });
  }

  archiveContact(id: number){
    this.contactService.archivedContact(id).subscribe({
      next: (data) => {
        console.log('Contact archived:', data);
        this.fetchContacts(); // Refresh the contact list
      },
      error: (err) => {
        console.error('Error archiving contact:', err);
      },
    });
    console.log('archived', id);
  }
 
}
