import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutingToLoginComponent } from './routing-to-login.component';

describe('RoutingToLoginComponent', () => {
  let component: RoutingToLoginComponent;
  let fixture: ComponentFixture<RoutingToLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutingToLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutingToLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
