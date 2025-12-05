// pnl.component.ts
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  RequestService,
  PNL,
  Resource,
} from '../../../../../services/crm/requests.service';
import {
  EmployeesService,
  Employee,
} from '../../../../../services/crm/employees.service';

@Component({
  selector: 'app-pnl',
  templateUrl: './pnl.component.html',
  styleUrls: ['./pnl.component.scss'],
})
export class PnlComponent {
  flashTotalCost = false;
  flashTotalPrice = false;
  flashUnitPrice = false;
  hasBackfill = false;
  employees: Employee[] = [];
  selectedTool: any;
  selectedTools: number[] = [];

  id = Number(this.route.snapshot.paramMap.get('id'));

  // keep top-level pnl object but typed and with resources array
  pnl: PNL = {
    work_mode: '',
    quantity_days: 0,
    unit_cost: 0,
    total_cost: 0,
    total_service_cost: 0,
    markup: 0,
    unit_price: 0,
    total_price: 0,
    total_service_price: 0,
    margin_percentage: 0,
    total_gross_margin: 0,
    service_margin_percentage: 0,
    service_gross_margin: 0,
    id_request: Number(this.route.snapshot.paramMap.get('id')),
    tools: [],
    resources: [],
  };

  // Backfill helper flags (optional)
  // (Used internally by backfill handlers if needed)
  backfillUnitPriceManual = false; // set true when user manually edits unit_price in backfill mode

  tools = [
    { id: 1, tool: 'Desk', daily_cost: 14.0, yearly_cost: 3500.0 },
    {
      id: 2,
      tool: 'Dedicated Car Lease',
      daily_cost: 58.0,
      yearly_cost: 14500.0,
    },
    {
      id: 3,
      tool: 'Dedicated Mobile Phone',
      daily_cost: 1.0,
      yearly_cost: 250.0,
    },
  ];

  workModes = [
    { value: 'Onsite', label: 'In sede' },
    { value: 'Ibrido', label: 'Ibrido' },
    { value: 'Remote', label: 'Remoto' },
  ];

  constructor(
    private router: Router,
    private requestService: RequestService,
    private route: ActivatedRoute,
    private employeesService: EmployeesService
  ) {}

  ngOnInit() {
    this.employeesService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data.sort((a, b) =>
          (a.first_name + ' ' + a.last_name).localeCompare(
            b.first_name + ' ' + b.last_name
          )
        );
      },
      error: (err) => console.error('Errore caricando dipendenti:', err),
    });

    // ensure resources[] contains at least one element for UI stability
    if (!this.pnl.resources || this.pnl.resources.length === 0) {
      this.pnl.resources = [
        { resource: '', quantity_days: 0, unit_cost: 0, total_cost: 0 },
      ];
    }
  }

  //
  // ---------------------------
  // SINGLE-RESOURCE (existing, unchanged logic)
  // ---------------------------
  //

  // keep the exact single-resource employee-select behavior you had
  onEmployeeSelect(employeeId: string, index?: number) {
    // If index is provided, delegate to backfill handler
    if (this.hasBackfill && typeof index === 'number') {
      return this.onEmployeeSelectBackfill(employeeId, index);
    }

    // --- SINGLE RESOURCE original behavior (unchanged) ---
    const selected = this.employees.find((e) => e.id === Number(employeeId));
    if (selected) {
      this.pnl.resource = selected.id.toString();
      this.pnl.unit_cost = selected.cost;

      // using your original working single-resource calls
      this.calculateTotalCost();
      this.calculateTotalPriceAndMargin();
    }
  }

  showPNLWithBackfill() {
    this.hasBackfill = true;
    if (!this.pnl.resources || this.pnl.resources.length === 0) {
      this.pnl.resources = [
        { resource: '', quantity_days: 0, unit_cost: 0, total_cost: 0 },
      ];
    }
  }
  showPNLWithoutBackfill() {
    this.hasBackfill = false;
    // optionally sync first resource to top-level fields for continuity
    const first =
      this.pnl.resources && this.pnl.resources.length
        ? this.pnl.resources[0]
        : undefined;
    if (first) {
      this.pnl.resource = first.resource as any;
      this.pnl.quantity_days = first.quantity_days as any;
      this.pnl.unit_cost = first.unit_cost as any;
      this.pnl.total_cost = first.total_cost as any;
    }
  }

  // original single-resource save (we still preserve this behavior; savePNL will wrap appropriately)
  savePNL() {
    // Before saving, wrap single resource into pnl.resources if not backfill
    if (!this.hasBackfill) {
      this.pnl.resources = [
        {
          resource: this.pnl.resource || '',
          quantity_days: this.pnl.quantity_days || 0,
          unit_cost: this.pnl.unit_cost || 0,
          total_cost: this.pnl.total_cost || 0,
        },
      ];
    } else {
      // ensure each resource has total_cost set
      this.pnl.resources = (this.pnl.resources || []).map((r) => ({
        ...r,
        total_cost: r.total_cost ?? (r.quantity_days || 0) * (r.unit_cost || 0),
      }));
    }

    // attach tools
    this.pnl.tools = this.selectedTools.map((tId: number) => {
      const tool = this.tools.find((tt) => tt.id === tId);
      return {
        tool: tool?.tool || '',
        daily_cost: tool?.daily_cost || 0,
        yearly_cost: tool?.yearly_cost || 0,
      };
    });

    this.requestService.createPNL(this.pnl).subscribe({
      next: (res) => {
        console.log('PNL creato con ID:', res.pnl_id);
        this.goBack();
      },
      error: (err) => console.error('Errore creazione PNL:', err),
    });
  }

  calculateTotalCost() {
    if (this.hasBackfill) {
      return this.calculateBackfillTotalCost();
    }

    const unitCost = this.pnl.unit_cost || 0;
    const days = this.pnl.quantity_days || 0;

    // costo risorsa
    this.pnl.total_cost = unitCost * days;

    // costo totale servizio = costo risorsa + cost of all selected tools
    const toolsCost = this.selectedTools.reduce(
      (sum: number, toolId: number) => {
        const tool = this.tools.find((t) => t.id === toolId);
        if (tool) {
          // giornate totali * costo giornaliero
          return sum + tool.daily_cost * days;
        }
        return sum;
      },
      0
    );

    this.pnl.total_service_cost = this.pnl.total_cost + toolsCost;

    this.flashTotalCost = true;
    setTimeout(() => (this.flashTotalCost = false), 1000);
  }

  calculateTotalServiceCost() {
    if (this.hasBackfill) {
      return this.calculateBackfillServiceCost();
    }

    const days = this.pnl.quantity_days || 0;
    const resourceCost = this.pnl.total_cost || 0;

    const toolsCost = this.selectedTools.reduce(
      (sum: number, toolId: number) => {
        const tool = this.tools.find((t) => t.id === toolId);
        return sum + (tool ? tool.daily_cost * days : 0);
      },
      0
    );

    this.pnl.total_service_cost = resourceCost + toolsCost;

    this.calculateTotalPriceAndMargin();
  }

  calculateTotalPriceAndMargin() {
    if (this.hasBackfill) {
      return this.calculateBackfillPriceAndMargin();
    }

    const unitPrice = this.pnl.unit_price || 0;
    const days = this.pnl.quantity_days || 0;
    const totalCost = this.pnl.total_cost || 0;
    const totalServiceCost = this.pnl.total_service_cost || 0;

    // full price resource
    this.pnl.total_price = unitPrice * days;

    // resource margins
    if (this.pnl.total_price) {
      this.pnl.margin_percentage = parseFloat(
        (
          ((this.pnl.total_price - totalCost) / this.pnl.total_price) *
          100
        ).toFixed(2)
      );
      this.pnl.total_gross_margin = parseFloat(
        (this.pnl.total_price - totalCost).toFixed(2)
      );
    } else {
      this.pnl.margin_percentage = 0;
      this.pnl.total_gross_margin = 0;
    }

    //prezzo totale servizio = prezzo risorsa
    this.pnl.total_service_price = this.pnl.total_price;

    //service margins
    if (this.pnl.total_service_price) {
      this.pnl.service_margin_percentage = parseFloat(
        (
          ((this.pnl.total_service_price - totalServiceCost) /
            this.pnl.total_service_price) *
          100
        ).toFixed(2)
      );
      this.pnl.service_gross_margin = parseFloat(
        (this.pnl.total_service_price - totalServiceCost).toFixed(2)
      );
    } else {
      this.pnl.service_margin_percentage = 0;
      this.pnl.service_gross_margin = 0;
    }

    this.flashTotalPrice = true;
    setTimeout(() => (this.flashTotalPrice = false), 300);
  }

  onMarkupChange() {
    //if backfill, delegate to backfill handler
    if (this.hasBackfill) {
      return this.onBackfillMarkupChange();
    }

    const unitCost = this.pnl.unit_cost || 0;
    const markup = this.pnl.markup || 0;

    if (unitCost > 0 && markup > 0) {
      this.pnl.unit_price = parseFloat((unitCost * markup).toFixed(2));
      this.calculateTotalPriceAndMargin();
    }
  }

  onUnitPriceChange() {
    //again: if backfill, delegate to backfill handler
    if (this.hasBackfill) {
      return this.onBackfillUnitPriceChange();
    }

    const unitCost = this.pnl.unit_cost || 0;
    const unitPrice = this.pnl.unit_price || 0;

    if (unitCost > 0 && unitPrice > 0) {
      this.pnl.markup = parseFloat((unitPrice / unitCost).toFixed(2));
      this.calculateTotalPriceAndMargin();
    }
  }

  onToolChange(event: Event) {
    this.selectedTool = Number((event.target as HTMLSelectElement).value);

    if (!this.selectedTools.includes(this.selectedTool)) {
      this.selectedTools.push(this.selectedTool);
    }

    // Recalculate total cost && margins including tools
    if (this.hasBackfill) {
      this.calculateBackfillTotals();
    } else {
      this.calculateTotalCost();
      this.calculateTotalPriceAndMargin();
    }
  }

  getTotalToolsCost(): number {
    return this.selectedTools.reduce((sum: number, toolId: number) => {
      const tool = this.tools.find((t) => t.id === toolId);
      return sum + (tool?.yearly_cost || 0);
    }, 0);
  }

  goBack() {
    this.router.navigate(['crm', 'requests']);
  }

  // Called when selecting employee in a backfill row
  onEmployeeSelectBackfill(employeeId: string, index: number) {
    const selected = this.employees.find((e) => e.id === Number(employeeId));
    if (!selected) return;

    const res = this.pnl.resources![index];
    res.resource = selected.id;
    //like single flow
    res.unit_cost = selected.cost;
    // update resource total
    res.total_cost = (res.quantity_days || 0) * (res.unit_cost || 0);

    this.calculateBackfillTotals();
  }

  calculateResourceTotals(index: number) {
    const res = this.pnl.resources![index];
    if (!res) return;
    res.total_cost = (res.quantity_days || 0) * (res.unit_cost || 0);
    this.flashTotalCost = true;
    setTimeout(() => (this.flashTotalCost = false), 800);

    this.calculateBackfillTotals();
  }

  // helper: compute aggregates (total days and total resource cost)
  private computeBackfillAggregates() {
    const resources = this.pnl.resources || [];
    let aggregatedResourceCost = 0;
    let aggregatedDays = 0;
    resources.forEach((r) => {
      r.total_cost = (r.quantity_days || 0) * (r.unit_cost || 0);
      aggregatedResourceCost += r.total_cost || 0;
      aggregatedDays += r.quantity_days || 0;
    });
    return { aggregatedResourceCost, aggregatedDays };
  }

  // calculates totals for backfill (resource cost, tools cost, service cost)
  calculateBackfillTotals() {
    const { aggregatedResourceCost, aggregatedDays } =
      this.computeBackfillAggregates();

    // tools cost based on aggregatedDays
    const toolsCost = this.selectedTools.reduce(
      (sum: number, toolId: number) => {
        const tool = this.tools.find((t) => t.id === toolId);
        return sum + (tool ? tool.daily_cost * aggregatedDays : 0);
      },
      0
    );

    this.pnl.total_cost = aggregatedResourceCost;
    this.pnl.total_service_cost = aggregatedResourceCost + toolsCost;

    // After updating costs, recalc price/margins
    this.calculateBackfillPriceAndMargin();
  }

  //Called when quantity/tools/unit_price/markup change and we need to update price/margins for backfill
  calculateBackfillPriceAndMargin() {
    const { aggregatedResourceCost, aggregatedDays } =
      this.computeBackfillAggregates();

    //avoid division by zero
    const days = aggregatedDays || 0;

    // verage unit cost across resources x dya
    const avgUnitCost = days > 0 ? aggregatedResourceCost / days : 0;

    //If user manually set unit_price in backfill, keep it.
    //otherwise, if markup is present, compute unit_price from avgUnitCost * markup (like single behavior but averaged)
    if (!this.backfillUnitPriceManual) {
      const markup = this.pnl.markup || 0;
      if (avgUnitCost > 0 && markup > 0) {
        this.pnl.unit_price = parseFloat((avgUnitCost * markup).toFixed(2));
      }
    }

    // total price is unit_price * total aggregated days
    const unitPrice = this.pnl.unit_price || 0;
    this.pnl.total_price = unitPrice * days;

    // resource margins (using aggregatedResourceCost)
    if (this.pnl.total_price && this.pnl.total_price > 0) {
      this.pnl.margin_percentage = parseFloat(
        (
          ((this.pnl.total_price - aggregatedResourceCost) /
            this.pnl.total_price) *
          100
        ).toFixed(2)
      );
      this.pnl.total_gross_margin = parseFloat(
        (this.pnl.total_price - aggregatedResourceCost).toFixed(2)
      );
    } else {
      this.pnl.margin_percentage = 0;
      this.pnl.total_gross_margin = 0;
    }

    // service totals (total_service_price uses total_price)
    this.pnl.total_service_price = this.pnl.total_price;
    if (this.pnl.total_service_price && this.pnl.total_service_price > 0) {
      this.pnl.service_margin_percentage = parseFloat(
        (
          ((this.pnl.total_service_price - (this.pnl.total_service_cost || 0)) /
            this.pnl.total_service_price) *
          100
        ).toFixed(2)
      );
      this.pnl.service_gross_margin = parseFloat(
        (
          this.pnl.total_service_price - (this.pnl.total_service_cost || 0)
        ).toFixed(2)
      );
    } else {
      this.pnl.service_margin_percentage = 0;
      this.pnl.service_gross_margin = 0;
    }

    this.flashTotalPrice = true;
    setTimeout(() => (this.flashTotalPrice = false), 300);
  }

  // invoked when markup changes in backfill mode
  onBackfillMarkupChange() {
    const { aggregatedResourceCost, aggregatedDays } =
      this.computeBackfillAggregates();
    const days = aggregatedDays || 0;
    const avgUnitCost = days > 0 ? aggregatedResourceCost / days : 0;

    const markup = this.pnl.markup || 0;
    if (avgUnitCost > 0 && markup > 0) {
      this.pnl.unit_price = parseFloat((avgUnitCost * markup).toFixed(2));
      this.backfillUnitPriceManual = false;
    }

    this.calculateBackfillTotals();
  }

  // invoked when unit_price is changed manually in backfill mode
  onBackfillUnitPriceChange() {
    // mark that user set unit price manually so markup updates do not overwrite it
    this.backfillUnitPriceManual = true;

    // recompute markup relative to average unit cost if possible
    const { aggregatedResourceCost, aggregatedDays } =
      this.computeBackfillAggregates();
    const avgUnitCost =
      aggregatedDays > 0 ? aggregatedResourceCost / aggregatedDays : 0;
    const unitPrice = this.pnl.unit_price || 0;

    if (avgUnitCost > 0 && unitPrice > 0) {
      this.pnl.markup = parseFloat((unitPrice / avgUnitCost).toFixed(2));
    }

    this.calculateBackfillTotals();
  }

  // small helpers used by single/backfill wrappers
  private calculateBackfillTotalCost() {
    // simply reuse backfill totals
    this.calculateBackfillTotals();
  }

  private calculateBackfillServiceCost() {
    this.calculateBackfillTotals();
  }

  addResource() {
    if (!this.pnl.resources) {
      this.pnl.resources = [];
    }
    this.pnl.resources.push({
      resource: '',
      quantity_days: 0,
      unit_cost: 0,
      total_cost: 0,
    });
  }

  removeResource(index: number) {
    if (!this.pnl.resources) return;
    this.pnl.resources.splice(index, 1);
    //it should always have at least one row >.<
    if (this.pnl.resources.length === 0) {
      this.addResource();
    }

    // recalc totals after removing
    this.calculateBackfillTotals();
  }
}
