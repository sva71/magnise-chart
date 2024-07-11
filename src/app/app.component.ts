import { Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TopBarComponent } from './top-bar/top-bar.component';
import { BarsComponent } from './bars/bars.component';
import { LiveChartComponent } from './live-chart/live-chart.component';
import { DataService } from './services/data.service';
import { ChartType } from './services/apiRoutes/utils';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from "@angular/material/card";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatButton,
    TopBarComponent,
    BarsComponent,
    LiveChartComponent,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardSubtitle,
    MatCardTitle,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'magnise-chart';
  chartType: ChartType;
  status = '';

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.chartType$.subscribe(ct => this.chartType = ct);
    this.dataService.statusData$.subscribe(s => this.status = s);
  }
}
