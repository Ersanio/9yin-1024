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
  public currentScore: number;
  public highScore: number;
  public currentMoves: number;

  public get direction(): typeof Direction {
    return Direction;
  }

  constructor(private savestateManager: SavestateManagerService) { }

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
    this.currentMoves = 0;
    this.currentScore = 0;
    this.highScore = this.savestateManager.getSavedHighScore();
    this.deleteSaveState();
    this.grid = new Grid(4, 4, 1024);
    this.updateSaveState();
  }

  private resumeGame(): void {
    this.grid = new Grid(4, 4, 1024);
    const saveState = this.savestateManager.loadGame();
    this.grid.tiles = saveState.currentTiles;
    this.currentScore = saveState.currentScore;
    this.currentMoves = saveState.currentMoves;
    this.highScore = saveState.highScore;
  }

  @HostListener('window:keydown', ['$event'])
  private keyDownEvent(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
    }
  }

  @HostListener('window:keyup', ['$event'])
  private keyUpEvent(event: KeyboardEvent): void {

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

    const moveData = this.grid.moveTiles(direction);

    if (moveData.moveHasBeenMade) {
      this.currentMoves++;
      this.currentScore += moveData.scoreIncrease;
      if (this.currentScore >= this.highScore) {
        this.highScore = this.currentScore;
      }

      this.grid.generateTilesInRandomEmptyCells(1);
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

  /**
   * Deletes all save data except for high score.
   */
  private deleteSaveState(): void {
    this.savestateManager.deleteGame();
  }

  private updateSaveState(): void {
    const saveState = new SaveState(
      this.grid.tiles,
      this.currentScore,
      this.highScore,
      this.currentMoves
    );
    this.savestateManager.saveGame(saveState);
  }

  // TODO: BONUS BONUS BONUS: Animate it all
}
