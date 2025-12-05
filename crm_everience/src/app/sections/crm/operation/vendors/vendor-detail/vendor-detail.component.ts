import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  styleUrl: './vendor-detail.component.scss',
})
export class VendorDetailComponent {
  editing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    //private itemService: ItemService,
    private router: Router
  ) {}

  vendors = [
    {
      id: 5,
      id_pnl: 3,
      vendor_name: 'FIRSTONE',
      province: 'Firenze',
      service_category: 'Stampanti e Telefoni',
      standard_daily_cost: 180,
      maggiorazione_non_feriale: '30-50%',
      cm_vendor: 'F5',
    },
  ];

  vendor: any = {};

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      //this.itemService.getItemById(id).subscribe((data) => (this.item = data));
      this.vendor = this.vendors[0];
    }
    console.log(this.vendor);
  }

  editClient() {
    this.editing = !this.editing;
  }

  saveChanges() {
    /*
      this.itemService.updateItem(this.item).subscribe(() => {
        
        this.router.navigate(['/items']);
      });
      */
  }
}
