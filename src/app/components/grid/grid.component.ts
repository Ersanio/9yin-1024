import { Component, OnInit } from '@angular/core';
import { Point } from 'src/app/models/point';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  public matrix =
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

  constructor() { }

  ngOnInit(): void {
    this.setupInitialGrid();
  }


  private setupInitialGrid() {
    for (let i = 0; i < 2; i++) {
      this.generateTileInRandomEmptyCell();
    }
  }

  private generateTileInRandomEmptyCell() {
    let point = this.getRandomEmptyCell();
    if(point?.x != undefined && point?.y != undefined) {
      this.matrix[point?.x][point?.y] = Math.random() < 0.5 ? 2 : 4;
    }
  }

  private getRandomEmptyCell(): Point | undefined {
    let slots = this.getAllEmptyCells();
    if (slots.length) {
      return slots[Math.floor(Math.random() * slots.length)];
    } else {
      return undefined;
    }
  }

  private getAllEmptyCells(): Point[] {
    let slots = [];

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (this.matrix[x][y] == 0) {
          slots.push(new Point(x, y));
        }
      }
    }

    return slots;
  }
}
