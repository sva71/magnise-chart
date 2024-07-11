import { Component, OnInit } from '@angular/core';
import Chart, { ChartData } from 'chart.js/auto';
import { LiveChartService } from '../services/liveChart/live-chart.service';
import { WebsocketService } from '../services/websocket/websocket.service';
import { environment } from '../../environment';

@Component({
  selector: 'app-live-chart',
  standalone: true,
  imports: [],
  templateUrl: './live-chart.component.html',
  styleUrl: './live-chart.component.scss',
})
export class LiveChartComponent implements OnInit {
  chart: Chart;

  defaultChartData: ChartData = {
    labels: [],
    datasets: [
      { label: 'Ask', data: [], backgroundColor: 'red' },
      { label: 'Bid', data: [], backgroundColor: 'lightgreen' },
      { label: 'Last', data: [], backgroundColor: 'blue' },
    ],
  };

  data: ChartData = { ...this.defaultChartData };

  constructor(
    private liveChartService: LiveChartService,
    private webSocket: WebsocketService,
  ) {}

  ngOnInit(): void {
    this.webSocket.isActiveSubscription$.subscribe((status) => {
      if (!status) {
        this.data = { ...this.defaultChartData };
      }
    });
    this.chart = new Chart('LiveChart', {
      type: 'line',
      data: this.data,
      options: {
        responsive: true,
      },
    });
    this.liveChartService.newItem$.subscribe((item) => {
      if (this.chart.data.labels.length === environment.MAX_LIVE_CHART_TICKS) {
        this.chart.data.labels.shift();
        this.chart.data.datasets.forEach((dataset) => dataset.data.shift());
      }
      this.chart.data.labels.push(item.tick);
      this.chart.data.datasets[0].data.push(item.ask);
      this.chart.data.datasets[1].data.push(item.bid);
      this.chart.data.datasets[2].data.push(item.last);
      this.chart.update();
    });
    this.webSocket.isActiveSubscription$.subscribe((status) => {
      status && this.clearChart();
    });
  }

  clearChart(): void {
    this.chart.data.labels = [];
    this.chart.data.datasets[0].data = [];
    this.chart.data.datasets[1].data = [];
    this.chart.data.datasets[2].data = [];
    this.chart.update();
  }
}
