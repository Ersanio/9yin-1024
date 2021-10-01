import { Point } from './point';

export class Tile {
  constructor(
    public position: Point,
    public value: number,
    public justPromoted: boolean = false) { }
}
