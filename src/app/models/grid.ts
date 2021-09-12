import { Direction } from "./direction";
import { Point } from "./point";
import { Tile } from "./tile";

export class Grid {
  public tiles: Tile[];
  private readonly width: number;
  private readonly height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.clearAllTiles();
  }

  public setupInitialGrid() {
    this.generateTilesInRandomEmptyTiles(2);
  }

  public setupInitialPredefinedGrid(values: number[][]) {
    this.generatedPredefinedTiles(values);
  }

  public getRelevantTiles(position: Point, vector: Point): Tile[] {
    if (vector.x) {
      return vector.x === -1 ? this.tiles.filter(tile => tile.position.y === position.y).slice(position.x) : [...this.tiles.filter(tile => tile.position.y === position.y)].reverse().slice(position.x);
    }

    if (vector.y) {
      const tilesColumn = this.tiles.filter(tile => tile.position.x === position.x);
      return vector.y === -1 ? tilesColumn.slice(position.y) : tilesColumn.reverse().slice(position.y);
    }
    throw new Error("this shouldn't happen");
  }

  public getTile(position: Point): Tile {
    if (this.isPositionOutOfBounds(position)) {
      throw new Error("Requested tile is out of bounds");
    }
    return this.tiles.find(tile => tile.position.x === position.x && tile.position.y === position.y)!;
  }

  public setTile(newTile: Tile) {
    if (this.isPositionOutOfBounds(newTile.position)) {
      throw new Error("Requested tile is out of bounds");
    }
    const index = this.tiles.findIndex(tile => tile.position.x === newTile.position.x && tile.position.y === newTile.position.y);
    if (index === -1) {
      throw new Error("Requested cell to set could not be found");
    }
    this.tiles[index] = newTile;
  }

  public clearTile(position: Point) {
    const tile = new Tile(position, 0);
    this.setTile(tile);
  }

  public swapTiles(first: Point, second: Point) {
    let tileA = this.getTile(first);
    let tileB = this.getTile(second);
    const temp = tileA.value;
    tileA.value = tileB.value;
    tileB.value = temp;

    this.setTile(tileB);
    this.setTile(tileA);
  }

  moveTiles(direction: Direction): boolean {
    const vector = this.getVector(direction);
    let moveHasBeenMade = false;

    for (let tile of this.tiles) {
      let relevantTiles = this.getRelevantTiles(tile.position, vector);
      if (relevantTiles.length === 1) {
        continue;
      }

      let currentTileIndex = 0;
      for (let i = 1; i < relevantTiles.length; i++) {
        const currentTile = relevantTiles[currentTileIndex];

        // Current tile and next tile are both vacant
        if (currentTile.value === 0 && relevantTiles[i].value === 0) {
          continue;
        }

        // Current tile is occupied, next tile is vacant
        if (currentTile.value !== 0 && relevantTiles[i].value === 0) {
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
          currentTile.promote();
          this.clearTile(relevantTiles[i].position);
          relevantTiles = this.getRelevantTiles(tile.position, vector);
          moveHasBeenMade = true;
          continue;
        }
      }
    }
    this.unlockAllTiles();
    return moveHasBeenMade;
  }

  private isPositionOutOfBounds(position: Point): boolean {
    return !((position.x >= 0 && position.x < this.width) && (position.y >= 0 && position.y < this.height));
  }

  private unlockAllTiles() {
    this.tiles.forEach(tile => {
      tile.justPromoted = false;
    });
  }

  private clearAllTiles() {
    this.tiles = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.tiles.push(new Tile(new Point(x, y), 0));
      }
    }
  }

  private generatedPredefinedTiles(numbers: number[][]) {
    numbers.forEach((row, y) => {
      row.forEach((value, x) => {
        const tile = new Tile(new Point(x, y), value);
        this.setTile(tile);
      })
    })
  }

  public generateTilesInRandomEmptyTiles(amount: number) {
    for (let i = 0; i < amount; i++) {
      let tile = this.getRandomEmptyTile();
      if (tile?.position.x !== undefined && tile?.position.y !== undefined) {
        tile.value = Math.random() < 0.5 ? 2 : 4;
      }
    }
  }

  private getRandomEmptyTile(): Tile | undefined {
    let emptyTiles = this.getAllEmptyTiles();
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
