import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingMenuComponent } from './marketing-menu.component';

describe('MarketingMenuComponent', () => {
  let component: MarketingMenuComponent;
  let fixture: ComponentFixture<MarketingMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarketingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
