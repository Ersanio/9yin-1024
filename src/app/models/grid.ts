import { Direction } from "./direction";
import { Point } from "./point";
import { Tile } from "./tile";

export class Grid {
  public tiles: Tile[][];
  private readonly width: number;
  private readonly height: number;

  constructor(width: number, height: number) {
    this.tiles = [];
    this.width = width;
    this.height = height;
  }

  public setupInitialGrid() {
    this.clearAllTiles();
    this.generateTilesInRandomEmptyTiles(2);
  }

  public setupInitialPredefinedGrid(values: number[][]) {
    this.clearAllTiles();
    this.generatedPredefinedTiles(values);
  }

  public getRelevantTiles(position: Point, vector: Point): Tile[] {
    if (vector.x) {
      return vector.x === -1 ? this.tiles[position.y].slice(position.x) : this.tiles[position.y].slice(position.x).reverse();
    }
    if (vector.y) {
      const tilesColumn: Tile[] = [];
      this.tiles.forEach(row => {
        tilesColumn.push(row.find(tile => tile.position.x === position.x)!);
      });

      return vector.y === -1 ? tilesColumn.slice(position.y) : tilesColumn.reverse().slice(position.y);
    }
    throw new Error("this shouldn't happen");
  }

  public getTile(position: Point): Tile {
    return this.tiles[position.y][position.x];
  }

  public setTile(newTile: Tile) {
    this.tiles[newTile.position.y][newTile.position.x] = newTile;
  }

  public increaseTileTier(position: Point) {
    this.tiles[position.y][position.x].value *= 2;
    this.tiles[position.y][position.x].justPromoted = true;
  }

  public clearTile(position: Point) {
    this.tiles[position.y][position.x].value = 0;
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

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {

        let relevantTiles = this.getRelevantTiles({ x, y }, vector);
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
            relevantTiles = this.getRelevantTiles({ x, y }, vector);
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
            this.increaseTileTier(currentTile.position);
            this.clearTile(relevantTiles[i].position);
            relevantTiles = this.getRelevantTiles({ x, y }, vector);
            moveHasBeenMade = true;
            continue;
          }
        }
      }
    }

    this.unlockAllTiles();
    return moveHasBeenMade;
  }

  private unlockAllTiles() {
    this.tiles.forEach(row => {
      row.forEach(tile => {
        tile.justPromoted = false;
      });
    });
  }

  private clearAllTiles() {
    this.tiles = [];
    for (let y = 0; y < this.height; y++) {
      var row: Tile[] = [];
      for (let x = 0; x < this.width; x++) {
        row.push(new Tile(new Point(x, y), 0));
      }
      this.tiles.push(row);
    }
  }

  private generatedPredefinedTiles(numbers: number[][]) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.tiles[y][x] = new Tile(new Point(x, y), numbers[y][x]);
      }
    }
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
    let emptyTiles = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.tiles[y][x].value === 0) {
          emptyTiles.push(this.tiles[y][x]);
        }
      }
    }
    return emptyTiles;
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
