import { Component, OnInit } from '@angular/core';
import { Direction } from 'src/app/models/direction';
import { Grid } from 'src/app/models/grid';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  public grid: Grid;
  constructor() { }

  ngOnInit(): void {
    this.grid = new Grid(4, 4);
    this.grid.setupInitialGrid();
  }

  public moveTiles(direction: Direction) {
    const moveHasBeenMade = this.grid.moveTiles(direction);
    if(moveHasBeenMade) {
      this.grid.generateTilesInRandomEmptyTiles(1);
    }
  }
}
