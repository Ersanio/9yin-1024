import { Injectable } from '@angular/core';
import { SaveState } from '../models/savestate';

@Injectable({
  providedIn: 'root'
})
export class SavestateManagerService {
  private readonly currentScoreKey = 'currentScore';
  private readonly highScoreKey = 'highScore';
  private readonly currentMovesKey = 'currentMoves';
  private readonly currentTilesKey = 'currentTiles';

  private readonly expectedKeys = [this.currentScoreKey, this.currentMovesKey, this.currentTilesKey, this.highScoreKey];

  public hasSaveGame(): boolean {
    return (this.expectedKeys.filter(key => !localStorage.getItem(key)).length === 0);
  }

  public saveGame(saveState: SaveState): void {
    localStorage.setItem(this.currentTilesKey, JSON.stringify(saveState.currentTiles));
    localStorage.setItem(this.currentScoreKey, `${saveState.currentScore}`);
    localStorage.setItem(this.highScoreKey, `${saveState.highScore}`);
    localStorage.setItem(this.currentMovesKey, `${saveState.currentMoves}`);
  }

  public loadGame(): SaveState {
      return new SaveState(
        JSON.parse(localStorage.getItem(this.currentTilesKey)!),
        Number.parseInt(localStorage.getItem(this.currentScoreKey)!, 10),
        Number.parseInt(localStorage.getItem(this.highScoreKey)!, 10),
        Number.parseInt(localStorage.getItem(this.currentMovesKey)!, 10)
      );
  }

  public deleteGame(): void {
    localStorage.removeItem(this.currentTilesKey);
    localStorage.removeItem(this.currentMovesKey);
    localStorage.removeItem(this.currentScoreKey);
  }

  getSavedHighScore(): number {
    return Number.parseInt(localStorage.getItem(this.highScoreKey) ?? '0', 10);
  }
}
