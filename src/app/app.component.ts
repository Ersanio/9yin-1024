import { Component, OnInit } from '@angular/core';
import { Point } from './models/point';
import { Tile } from './models/tile';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private readonly ARROW_LEFT = 37;
  private readonly ARROW_UP = 38;
  private readonly ARROW_RIGHT = 39;
  private readonly ARROW_DOWN = 40;

  public matrix =
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];


  ngOnInit(): void {
    this.setupInitialGrid();
  }

  private setupInitialGrid() {
    for (let i = 0; i < 2; i++) {
      this.generateTileInRandomEmptySlot();
    }
  }

  private generateTileInRandomEmptySlot() {
    let point = this.getRandomEmptySlot();
    if(point?.x != undefined && point?.y != undefined) {
      this.matrix[point?.x][point?.y] = Math.random() < 0.5 ? 2 : 4;
    }
  }

  private getRandomEmptySlot(): Point | undefined {
    let slots = this.getAllEmptySlots();
    if (slots.length) {
      return slots[Math.floor(Math.random() * slots.length)];
    } else {
      return undefined;
    }
  }

  private getAllEmptySlots(): Point[] {
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

  private moveTiles() {

  }

  private mergeTiles() {

  }

  private checkLoss() {

  }

  private checkWin() {

  }
}
