import { Tile } from './tile';

export class SaveState {
  constructor(public currentTiles: Tile[], public currentScore: number, public highScore: number, public currentMoves: number) {}
}
