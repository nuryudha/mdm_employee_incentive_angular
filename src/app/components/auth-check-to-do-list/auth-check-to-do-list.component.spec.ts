import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCheckToDoListComponent } from './auth-check-to-do-list.component';

describe('AuthCheckToDoListComponent', () => {
  let component: AuthCheckToDoListComponent;
  let fixture: ComponentFixture<AuthCheckToDoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthCheckToDoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCheckToDoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
