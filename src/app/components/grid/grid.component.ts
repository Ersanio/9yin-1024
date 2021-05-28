import { Component, OnInit } from '@angular/core';
import { Direction } from 'src/app/app.component';
import { Point } from 'src/app/models/point';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  public matrix: number[][] =
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

  moveTiles(direction: Direction) {
    //todo: getvector instead of convoluted ifs https://github.com/gabrielecirulli/2048/blob/fc1ef4fe5a5fcccea7590f3e4c187c75980b353f/js/game_manager.js
    if (direction === Direction.Left || direction === Direction.Right) {
      this.moveTilesHorizontal(direction);
    } else {
      this.moveTilesVertical(direction);
    }

    // this.generateTilesInRandomEmptyCell(2);
  }

  moveTilesVertical(direction: Direction) {
    if (direction === Direction.Down) {
      for (let column = 0; column < 4; column++) {
        for (let tile = 0; tile < 4; tile++) {
          console.log(this.matrix[tile][column]);
        }
      }
    } else {
      for (let column = 0; column < 4; column++) {
        for (let tile = 3; tile >= 0; tile--) {
          console.log(this.matrix[tile][column]);
        }
      }
    }

  }
  moveTilesHorizontal(direction: Direction) {
    throw new Error('Method not implemented.');
  }

  private setupInitialGrid() {
    this.generateTilesInRandomEmptyCell(2);
  }

  private generateTilesInRandomEmptyCell(amount: number) {
    for (let i = 0; i < amount; i++) {
      let point = this.getRandomEmptyCell();
      if (point?.x != undefined && point?.y != undefined) {
        this.matrix[point.x][point.y] = Math.random() < 0.5 ? 2 : 4;
      }
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
