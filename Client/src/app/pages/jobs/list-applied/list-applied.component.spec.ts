import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAppliedComponent } from './list-applied.component';

describe('ListAppliedComponent', () => {
  let component: ListAppliedComponent;
  let fixture: ComponentFixture<ListAppliedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAppliedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAppliedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
