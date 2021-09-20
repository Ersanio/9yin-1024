import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
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

  ngOnInit(): void {
    this.victory = false;
    this.defeat = false;
    this.grid = new Grid(4, 4, 1024);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

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

  private moveTiles(direction: Direction) {
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

  // TODO: Make tiles a single spritesheet and use CSS magic to render each tile. Fixes newly introduced tiers appearing as blank for a sec
  // TODO: metadata information for Discord and WhatsApp
  // TODO: Add support for mobile swiping. be careful to not refresh the page by accident while swiping down.
  // TODO: BONUS BONUS: Persist score count in local storage
  // TODO: BONUS BONUS BONUS: Animate it all
}
