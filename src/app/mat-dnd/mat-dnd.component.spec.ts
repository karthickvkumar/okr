import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDndComponent } from './mat-dnd.component';

describe('MatDndComponent', () => {
  let component: MatDndComponent;
  let fixture: ComponentFixture<MatDndComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatDndComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatDndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
