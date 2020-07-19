import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardWrapperComponent } from './board-wrapper.component';

describe('BoardWrapperComponent', () => {
  let component: BoardWrapperComponent;
  let fixture: ComponentFixture<BoardWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
