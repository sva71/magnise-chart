import { TestBed } from '@angular/core/testing';

import { LiveChartService } from './live-chart.service';

describe('LiveChartService', () => {
  let service: LiveChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
