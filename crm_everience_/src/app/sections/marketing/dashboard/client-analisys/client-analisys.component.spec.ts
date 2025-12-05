import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAnalisysComponent } from './client-analisys.component';

describe('ClientAnalisysComponent', () => {
  let component: ClientAnalisysComponent;
  let fixture: ComponentFixture<ClientAnalisysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAnalisysComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientAnalisysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
