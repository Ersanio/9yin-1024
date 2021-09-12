import { Point } from './point';

export class Tile {
  constructor(
    public position: Point,
    public value: number,
    public justPromoted: boolean = false) { }

  public promote() {
    this.value *= 2;
    this.justPromoted = true;
  }

  clear() {
    this.value = 0;
  }
}
