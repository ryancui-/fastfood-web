import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MyGroupPageComponent} from './my-group-page.component';

describe('MyGroupPageComponent', () => {
  let component: MyGroupPageComponent;
  let fixture: ComponentFixture<MyGroupPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyGroupPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGroupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
