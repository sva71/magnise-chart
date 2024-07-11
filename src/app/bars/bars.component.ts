import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { DataService } from '../services/data.service';
import { Bar } from '../services/types/Bar';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-bars',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgApexchartsModule],
  templateUrl: './bars.component.html',
  styleUrl: './bars.component.scss',
})
export class BarsComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;

  bars: Bar[];
  public chartOptions: Partial<ChartOptions> = {
    series: [
      {
        name: 'candle',
        data: [],
      },
    ],
    chart: {
      type: 'candlestick',
    },
    title: {
      text: 'CountBack Chart',
      align: 'left',
    },
    xaxis: {
      type: 'datetime',
    },
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.bars$.subscribe(() => {
      this.bars = [...this.dataService.bars];
      this.chart.updateSeries([
        {
          name: 'candle',
          data: [
            ...this.bars.map((bar: Bar) => ({
              x: new Date(bar.t),
              y: [bar.o, bar.h, bar.l, bar.c],
            })),
          ],
        },
      ]);
    });
  }
}
