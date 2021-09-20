import { Component, Input } from '@angular/core';
import { Grid } from 'src/app/models/grid';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {
  @Input()
  public grid: Grid;
}
