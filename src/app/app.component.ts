import { Component, HostListener, OnInit } from '@angular/core';
import { Direction } from './models/direction';
import { Grid } from './models/grid';
import { SaveState } from './models/savestate';
import { SavestateManagerService } from './services/savestate-manager.service';

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

  constructor(private savestateManager: SavestateManagerService) {}

  ngOnInit(): void {
    this.loadGame();
  }

  public loadGame(): void {
    if (this.savestateManager.hasSaveGame()) {
      this.resumeGame();
    } else {
      this.startNewGame();
    }
  }

  public startNewGame(): void {
    this.victory = false;
    this.defeat = false;
    this.deleteSaveState();
    this.grid = new Grid(4, 4, 1024);
    this.grid.highScore = this.savestateManager.getSavedHighScore();
    this.updateSaveState();
  }

  private resumeGame(): void {
    this.victory = false;
    this.defeat = false;
    this.grid = new Grid(4, 4, 1024);
    const saveState = this.savestateManager.loadGame();
    this.grid.tiles = [...saveState.currentTiles];
    this.grid.currentScore = saveState.currentScore;
    this.grid.currentMoves = saveState.currentMoves;
    this.grid.highScore = saveState.highScore;
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
    if (this.defeat || this.victory) {
      return;
    }

    const moveHasBeenMade = this.grid.moveTiles(direction);

    if (moveHasBeenMade) {
      this.grid.generateTilesInRandomEmptyTiles(1);
      this.updateSaveState();
    }

    if (this.grid.checkVictory()) {
      this.victory = true;
      this.deleteSaveState();
    } else if (this.grid.checkGameOver()) {
      this.defeat = true;
      this.deleteSaveState();
    }
  }

  private deleteSaveState(): void {
    this.savestateManager.deleteGame();
  }

  private updateSaveState(): void {
    const saveState = new SaveState(
      this.grid.tiles,
      this.grid.currentScore,
      this.grid.highScore,
      this.grid.currentMoves
    );
    this.savestateManager.saveGame(saveState);
  }

  // TODO: save progress in local storage
  // TODO: BONUS BONUS: Persist score count in local storage
  // TODO: BONUS BONUS BONUS: Animate it all
}
