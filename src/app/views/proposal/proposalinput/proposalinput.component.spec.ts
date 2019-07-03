import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalinputComponent } from './proposalinput.component';

describe('ProposalinputComponent', () => {
  let component: ProposalinputComponent;
  let fixture: ComponentFixture<ProposalinputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalinputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalinputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
