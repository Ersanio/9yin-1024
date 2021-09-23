import { Component, HostListener, OnInit } from '@angular/core';
import { Direction } from './models/direction';
import { Grid } from './models/grid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  public grid: Grid;

  public victory: boolean;
  public defeat: boolean;

  public get direction(): typeof Direction {
    return Direction;
  }


  ngOnInit(): void {
    this.victory = false;
    this.defeat = false;
    this.grid = new Grid(4, 4, 1024);
  }

  @HostListener('window:keyup', ['$event'])
  private keyEvent(event: KeyboardEvent): void {

    switch (event.key) {
      case 'ArrowLeft':
        this.moveTiles(Direction.Left);
        break;
      case 'ArrowUp':
        this.moveTiles(Direction.Up);
        break;
      case 'ArrowRight':
        this.moveTiles(Direction.Right);
        break;
      case 'ArrowDown':
        this.moveTiles(Direction.Down);
        break;
    }
  }

  public moveTiles(direction: Direction): void {
    const moveHasBeenMade = this.grid.moveTiles(direction);

    if (moveHasBeenMade) {
      this.grid.generateTilesInRandomEmptyTiles(1);
    }

    if (this.grid.checkVictory()) {
      this.victory = true;
    }

    else if (this.grid.checkGameOver()) {
      this.defeat = true;
    }
  }

  // Fix up layout
  // TODO: Add support for mobile swiping. be careful to not refresh the page by accident while swiping down.
  // TODO: BONUS BONUS: Persist score count in local storage
  // TODO: BONUS BONUS BONUS: Animate it all
}
