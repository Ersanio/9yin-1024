import { Direction } from './direction';
import { Point } from './point';
import { Tile } from './tile';

export class Grid {
  private readonly victoryTile: number;
  private readonly width: number;
  private readonly height: number;

  public tiles: Tile[];
  public currentScore: number;
  public currentMoves: number;
  public highScore: number;

  constructor(width: number, height: number, victoryTile: number) {
    this.victoryTile = victoryTile;
    this.width = width;
    this.height = height;
    this.currentScore = 0;
    this.highScore = 0;
    this.currentMoves = 0;
    this.clearAllTiles();
    this.generateTilesInRandomEmptyTiles(2);
  }

  public setupInitialPredefinedGrid(values: number[][]): void {
    this.generatedPredefinedTiles(values);
  }

  public getRelevantTiles(position: Point, vector: Point): Tile[] {
    if (vector.x) {
      return vector.x === -1 ?
        this.tiles.filter(tile => tile.position.y === position.y).slice(position.x) :
        [...this.tiles.filter(tile => tile.position.y === position.y)].reverse().slice(position.x);
    }

    if (vector.y) {
      const tilesColumn = this.tiles.filter(tile => tile.position.x === position.x);
      return vector.y === -1 ? tilesColumn.slice(position.y) : tilesColumn.reverse().slice(position.y);
    }
    throw new Error('this shouldn\'t happen');
  }

  public getTile(position: Point): Tile {
    if (this.isPositionOutOfBounds(position)) {
      throw new Error('Requested tile is out of bounds');
    }
    return this.tiles.find(tile => tile.position.x === position.x && tile.position.y === position.y)!
  }

  public swapTiles(first: Point, second: Point): void {
    const tileA = this.getTile(first);
    const tileB = this.getTile(second);
    const temp = tileA.value;
    tileA.value = tileB.value;
    tileB.value = temp;
  }

  public moveTiles(direction: Direction, simulation: boolean = false): boolean {
    const vector = this.getVector(direction);
    const currentGrid = [...this.tiles].map<Tile>(tile => new Tile(new Point(tile.position.x, tile.position.y), tile.value));
    let moveHasBeenMade = false;

    for (const tile of this.tiles) {
      let relevantTiles = this.getRelevantTiles(tile.position, vector);
      if (relevantTiles.length === 1) {
        continue;
      }

      let currentTileIndex = 0;
      for (let i = 1; i < relevantTiles.length; i++) {
        const currentTile = relevantTiles[currentTileIndex];

        // Current tile and next tile are both vacant, or
        // Current tile is occupied, next tile is vacant
        if ((currentTile.value === 0 && relevantTiles[i].value === 0)
          || (currentTile.value !== 0 && relevantTiles[i].value === 0)) {
          continue;
        }

        // Current tile is vacant, next tile is occupied
        if (currentTile.value === 0 && relevantTiles[i].value !== 0) {
          this.swapTiles(currentTile.position, relevantTiles[i].position);
          relevantTiles = this.getRelevantTiles(tile.position, vector);
          moveHasBeenMade = true;
          continue;
        }

        // Current tile and next tile are occupied but unequal
        if (currentTile.value !== relevantTiles[i].value) {
          currentTileIndex = i;
          continue;
        }

        // Current tile equals next tile, thus a merge is possible
        if (!relevantTiles[i].justPromoted && currentTile.value === relevantTiles[i].value) {
          this.promoteTile(currentTile);
          this.clearTile(relevantTiles[i]);
          relevantTiles = this.getRelevantTiles(tile.position, vector);
          moveHasBeenMade = true;
          if (!simulation) {
            this.currentScore += currentTile.value;
          }
          continue;
        }
      }
    }
    this.unlockAllTiles();

    if (!simulation && moveHasBeenMade) {
      this.currentMoves++;
      if (this.currentScore >= this.highScore) {
        this.highScore = this.currentScore;
      }
    }
    else {
      this.tiles = currentGrid;
    }

    return moveHasBeenMade;
  }

  private clearTile(tile: Tile) {
    tile.value = 0;
  }

  private promoteTile(tile: Tile) {
    tile.value *= 2;
    tile.justPromoted = true;
  }

  /**
   * Checks if no moves are possible anymore.
   * @returns Whether the game is over or not.
   */
  public checkGameOver(): boolean {
    return !(
      this.moveTiles(Direction.Up, true) ||
      this.moveTiles(Direction.Left, true) ||
      this.moveTiles(Direction.Down, true) ||
      this.moveTiles(Direction.Right, true));
  }

  public checkVictory(): boolean {
    return this.tiles.findIndex(tile => tile.value >= this.victoryTile) !== -1;
  }

  public generateTilesInRandomEmptyTiles(amount: number): void {
    for (let i = 0; i < amount; i++) {
      const tile = this.getRandomEmptyTile();
      if (tile?.position.x !== undefined && tile?.position.y !== undefined) {
        tile.value = Math.random() < 0.5 ? 2 : 4;
      }
    }
  }

  private isPositionOutOfBounds(position: Point): boolean {
    return !((position.x >= 0 && position.x < this.width) && (position.y >= 0 && position.y < this.height));
  }

  private unlockAllTiles(): void {
    this.tiles.forEach(tile => {
      tile.justPromoted = false;
    });
  }

  private clearAllTiles(): void {
    this.tiles = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.tiles.push(new Tile(new Point(x, y), 0));
      }
    }
  }

  private generatedPredefinedTiles(numbers: number[][]): void {
    numbers.forEach((row, y) => {
      row.forEach((value, x) => {
        const tile = new Tile(new Point(x, y), value);
        this.tiles[y * this.height + x] = tile;
      });
    });
  }

  private getRandomEmptyTile(): Tile | undefined {
    const emptyTiles = this.getAllEmptyTiles();
    if (emptyTiles.length) {
      return emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    } else {
      return undefined;
    }
  }

  private getAllEmptyTiles(): Tile[] {
    return this.tiles.filter(tile => tile.value === 0);
  }

  private getVector(direction: Direction): Point {
    switch (direction) {
      case Direction.Left: return new Point(-1, 0);
      case Direction.Right: return new Point(1, 0);
      case Direction.Up: return new Point(0, -1);
      case Direction.Down: return new Point(0, 1);
      default: throw new Error('Invalid direction');
    }
  }
}
