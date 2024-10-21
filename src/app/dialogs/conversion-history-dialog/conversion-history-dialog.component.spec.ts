import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionHistoryDialogComponent } from './conversion-history-dialog.component';

describe('ConversionHistoryDialogComponent', () => {
  let component: ConversionHistoryDialogComponent;
  let fixture: ComponentFixture<ConversionHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversionHistoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversionHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
