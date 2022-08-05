import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListShortlistComponent } from './list-shortlist.component';

describe('ListShortlistComponent', () => {
  let component: ListShortlistComponent;
  let fixture: ComponentFixture<ListShortlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListShortlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListShortlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
