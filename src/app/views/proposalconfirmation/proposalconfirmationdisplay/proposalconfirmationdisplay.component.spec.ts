import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalconfirmationdisplayComponent } from './proposalconfirmationdisplay.component';

describe('ProposalconfirmationdisplayComponent', () => {
  let component: ProposalconfirmationdisplayComponent;
  let fixture: ComponentFixture<ProposalconfirmationdisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalconfirmationdisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalconfirmationdisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
