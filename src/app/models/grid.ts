import { Direction } from './direction';
import { Move } from './move';
import { Point } from './point';
import { Tile } from './tile';

export class Grid {
  private readonly victoryTile: number;
  private readonly width: number;
  private readonly height: number;

  public tiles: Tile[];

  constructor(width: number, height: number, victoryTile: number) {
    this.victoryTile = victoryTile;
    this.width = width;
    this.height = height;
    this.clearAllTiles();
    this.generateTilesInRandomEmptyCells(2);
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
    return this.tiles.find(tile => tile.position.x === position.x && tile.position.y === position.y)!;
  }

  public swapTiles(first: Point, second: Point): void {
    const tileA = this.getTile(first);
    const tileB = this.getTile(second);
    const temp = tileA.value;
    tileA.value = tileB.value;
    tileB.value = temp;
  }

  public moveTiles(direction: Direction, simulation: boolean = false): Move {
    const vector = this.getVector(direction);
    const currentGrid = [...this.tiles].map<Tile>(tile => new Tile(new Point(tile.position.x, tile.position.y), tile.value));
    const move = new Move(false, 0);

    for (const tile of this.tiles) {
      let relevantTiles = this.getRelevantTiles(tile.position, vector);
      if (relevantTiles.length === 1) {
        continue;
      }

      let destinationTileIndex = 0;
      for (let i = 1; i < relevantTiles.length; i++) {
        const destinationTile = relevantTiles[destinationTileIndex];
        const sourceTile = relevantTiles[i];

        // Destination tile and source tile are both vacant
        // Destination tile is occupied, source tile is vacant
        // Thus, nothing happens
        if ((destinationTile.value === 0 && sourceTile.value === 0)
          || (destinationTile.value !== 0 && sourceTile.value === 0)) {
          continue;
        }

        // Destination tile is vacant, source tile is occupied
        // Thus, move tile into vacant tile
        if (destinationTile.value === 0 && sourceTile.value !== 0) {
          this.swapTiles(destinationTile.position, sourceTile.position);
          relevantTiles = this.getRelevantTiles(tile.position, vector);
          move.moveHasBeenMade = true;
          continue;
        }

        // Destination tile and source tile are occupied but unequal
        // Thus, nothing happens
        if (destinationTile.value !== sourceTile.value) {
          destinationTileIndex = i;
          continue;
        }

        // Destination tile equals source tile, thus a merge is possible
        if (!sourceTile.justPromoted && destinationTile.value === sourceTile.value) {
          this.promoteTile(destinationTile);
          this.clearTile(sourceTile);
          relevantTiles = this.getRelevantTiles(tile.position, vector);
          move.moveHasBeenMade = true;
          if (!simulation) {
            move.scoreIncrease += destinationTile.value;
          }
          continue;
        }
      }
    }
    this.unlockAllTiles();

    if (simulation) {
      this.tiles = currentGrid;
    }

    return move;
  }


  /**
   * Checks if no moves are possible anymore.
   * @returns Whether the game is over or not.
   */
  public checkGameOver(): boolean {
    return !(
      this.moveTiles(Direction.Up, true).moveHasBeenMade ||
      this.moveTiles(Direction.Left, true).moveHasBeenMade ||
      this.moveTiles(Direction.Down, true).moveHasBeenMade ||
      this.moveTiles(Direction.Right, true).moveHasBeenMade);
  }

  public checkVictory(): boolean {
    return this.tiles.findIndex(tile => tile.value >= this.victoryTile) !== -1;
  }

  public generateTilesInRandomEmptyCells(amount: number): void {
    for (let i = 0; i < amount; i++) {
      const tile = this.getRandomEmptyTile();
      if (tile?.position.x !== undefined && tile?.position.y !== undefined) {
        tile.value = Math.random() < 0.5 ? 2 : 4;
      }
    }
  }

  private clearTile(tile: Tile): void {
    tile.value = 0;
  }

  private promoteTile(tile: Tile): void {
    tile.value *= 2;
    tile.justPromoted = true;
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
