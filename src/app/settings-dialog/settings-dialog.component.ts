import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Instrument } from '../services/types/Instrument';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DataService, IHistoricalSettings } from '../services/data.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { FinProvider } from '../services/types/FinProvider';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import {
  ChartPeriodicity,
  HistoricalChartType,
  PaginationResp,
} from '../services/apiRoutes/utils';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

interface SettingsEditForm {
  historicalChartType: FormControl<HistoricalChartType>;
  interval: FormControl<number>;
  periodicity: FormControl<ChartPeriodicity>;
  barsCount: FormControl<number>;
  dateFrom: FormControl<Date>;
  dateTo: FormControl<Date>;
}

@Component({
  selector: 'app-settings-dialog',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogActions,
    MatButtonModule,
    MatRadioGroup,
    MatRadioButton,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './settings-dialog.component.html',
  styleUrl: './settings-dialog.component.scss',
})
export class SettingsDialogComponent implements OnInit {
  settingsForm: FormGroup = null;

  status = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IHistoricalSettings,
    private dataService: DataService,
    public dialogRef: MatDialogRef<SettingsDialogComponent>,
  ) {
    this.dataService.statusData$.subscribe((s) => (this.status = s));
  }

  ngOnInit() {
    this.settingsForm = new FormGroup<SettingsEditForm>({
      historicalChartType: new FormControl(this.data.historicalChartType, Validators.required),
      interval: new FormControl(this.data.interval, Validators.required),
      periodicity: new FormControl(this.data.periodicity, Validators.required),
      barsCount: new FormControl(this.data.barsCount),
      dateFrom: new FormControl(this.data.dateFrom),
      dateTo: new FormControl(this.data.dateTo),
    });
    this.settingsForm.controls['historicalChartType'].valueChanges.subscribe(value => {
      switch (value) {
        case 'count-back': {
          this.settingsForm.controls['dateFrom'].removeValidators(Validators.required);
          this.settingsForm.controls['dateTo'].removeValidators(Validators.required);
          this.settingsForm.controls['barsCount'].addValidators(Validators.required);
          break;
        }
        case 'date-range': {
          this.settingsForm.controls['barsCount'].removeValidators(Validators.required);
          this.settingsForm.controls['dateFrom'].addValidators(Validators.required);
          this.settingsForm.controls['dateTo'].addValidators(Validators.required);
          break;
        }
      }
    })
  }

  onSubmit() {
    this.dialogRef.close(this.settingsForm.value);
  }
}
