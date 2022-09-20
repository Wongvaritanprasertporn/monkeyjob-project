import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFeatureJobComponent } from './add-feature-job.component';

describe('AddFeatureJobComponent', () => {
  let component: AddFeatureJobComponent;
  let fixture: ComponentFixture<AddFeatureJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFeatureJobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFeatureJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
