import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumListComponent } from './premium-list.component';

describe('PremiumListComponent', () => {
  let component: PremiumListComponent;
  let fixture: ComponentFixture<PremiumListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
