import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBannerComponent } from './list-banner.component';

describe('ListBannerComponent', () => {
  let component: ListBannerComponent;
  let fixture: ComponentFixture<ListBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
