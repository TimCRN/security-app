import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickSigninComponent } from './quick-signin.component';

describe('QuickSigninComponent', () => {
  let component: QuickSigninComponent;
  let fixture: ComponentFixture<QuickSigninComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickSigninComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
