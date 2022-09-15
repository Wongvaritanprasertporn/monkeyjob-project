import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPostTypeComponent } from './select-post-type.component';

describe('SelectPostTypeComponent', () => {
  let component: SelectPostTypeComponent;
  let fixture: ComponentFixture<SelectPostTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectPostTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPostTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
