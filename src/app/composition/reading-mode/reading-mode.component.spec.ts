import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingModeComponent } from './reading-mode.component';

describe('ReadingModeComponent', () => {
  let component: ReadingModeComponent;
  let fixture: ComponentFixture<ReadingModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadingModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
