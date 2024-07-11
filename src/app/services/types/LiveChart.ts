export type LiveChartItem = {
  tick: string;
  ask?: number;
  bid?: number;
  last?: number;
};

export type LiveChartDataset = {
  label: string;
  data: number[];
  backgroundColor: string;
};

export type LiveChartData = {
  labels: string[];
  datasets: LiveChartDataset[];
  options?: {
    aspectRatio: number;
  };
};
