import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteinputComponent } from './quoteinput.component';

describe('QuoteinputComponent', () => {
  let component: QuoteinputComponent;
  let fixture: ComponentFixture<QuoteinputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteinputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteinputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
