import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkPipeComponent } from './network-pipe.component';

describe('NetworkPipeComponent', () => {
  let component: NetworkPipeComponent;
  let fixture: ComponentFixture<NetworkPipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkPipeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NetworkPipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
