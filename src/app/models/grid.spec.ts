import { Direction } from "./direction";
import { Grid } from "./grid";
import { Point } from "./point";

describe("Grid suite", () => {
  const grid = new Grid(4, 4);
  const leftVector = new Point(-1, 0);
  const rightVector = new Point(1, 0);
  const upVector = new Point(0, -1);
  const downVector = new Point(0, 1);


  it("should setup", () => {
    grid.setupInitialPredefinedGrid([
      [2, 4, 0, 0],
      [0, 0, 0, 2],
      [0, 0, 2, 0],
      [1024, 512, 256, 128],
    ])

    const expectedGrid = [
      [2, 4, 0, 0],
      [0, 0, 0, 2],
      [0, 0, 2, 0],
      [1024, 512, 256, 128],
    ]

    assertGridEqual(grid, expectedGrid);
  });

  [{ expectedLength: 4, expectedValues: [2, 4, 0, 0] },
  { expectedLength: 3, expectedValues: [4, 0, 0] },
  { expectedLength: 2, expectedValues: [0, 0] },
  { expectedLength: 1, expectedValues: [0] }].forEach(params => {
    it(`should get ${params.expectedLength} relevant tiles when moving left`, () => {
      grid.setupInitialPredefinedGrid([
        [2, 4, 0, 0],
        [0, 0, 0, 2],
        [0, 0, 2, 0],
        [1024, 512, 256, 128],
      ])

      const relevantTiles = grid.getRelevantTiles(new Point(4 - params.expectedLength, 0), leftVector);
      expect(relevantTiles.length).toBe(params.expectedLength);
      const relevantTilesValues = relevantTiles.map<number>(x => x.value);
      expect(relevantTilesValues).toEqual(params.expectedValues);
    });
  });

  [{ expectedLength: 4, expectedValues: [2, 2, 2, 64] },
  { expectedLength: 3, expectedValues: [2, 2, 64] },
  { expectedLength: 2, expectedValues: [2, 64] },
  { expectedLength: 1, expectedValues: [64] }].forEach(params => {
    fit(`should get ${params.expectedLength} relevant tiles when moving right`, () => {
      grid.setupInitialPredefinedGrid([
        [64, 2, 2, 2],
        [0, 0, 0, 2],
        [0, 0, 2, 0],
        [1024, 512, 256, 128],
      ])

      const relevantTiles = grid.getRelevantTiles(new Point(4 - params.expectedLength, 0), rightVector);
      expect(relevantTiles.length).toBe(params.expectedLength);
      const relevantTilesValues = relevantTiles.map<number>(x => x.value);
      expect(relevantTilesValues).toEqual(params.expectedValues);
    });
  });

  [{ expectedLength: 4, expectedValues: [0, 2, 8, 1024] },
  { expectedLength: 3, expectedValues: [2, 8, 1024] },
  { expectedLength: 2, expectedValues: [8, 1024] },
  { expectedLength: 1, expectedValues: [1024] }].forEach(params => {
    it(`should get ${params.expectedLength} relevant tiles when moving up`, () => {
      grid.setupInitialPredefinedGrid([
        [0, 4, 0, 0],
        [2, 0, 0, 2],
        [8, 0, 2, 0],
        [1024, 512, 256, 128],
      ])

      const relevantTiles = grid.getRelevantTiles(new Point(0, 4 - params.expectedLength), upVector);
      expect(relevantTiles.length).toBe(params.expectedLength);
      const relevantTilesValues = relevantTiles.map<number>(x => x.value);
      expect(relevantTilesValues).toEqual(params.expectedValues);
    });
  });

  [{ expectedLength: 4, expectedValues: [1024, 8, 2, 0] },
  { expectedLength: 3, expectedValues: [8, 2, 0] },
  { expectedLength: 2, expectedValues: [2, 0] },
  { expectedLength: 1, expectedValues: [0] }].forEach(params => {
    it(`should get ${params.expectedLength} relevant tiles when moving up`, () => {
      grid.setupInitialPredefinedGrid([
        [0, 4, 0, 0],
        [2, 0, 0, 2],
        [8, 0, 2, 0],
        [1024, 512, 256, 128],
      ])

      const relevantTiles = grid.getRelevantTiles(new Point(0, 4 - params.expectedLength), downVector);
      expect(relevantTiles.length).toBe(params.expectedLength);
      const relevantTilesValues = relevantTiles.map<number>(x => x.value);
      expect(relevantTilesValues).toEqual(params.expectedValues);
    });
  });

  it(`should move tiles up`, () => {
    grid.setupInitialPredefinedGrid([
      [2, 0, 0, 2],
      [2, 2, 0, 0],
      [2, 0, 2, 0],
      [2, 0, 0, 2],
    ])

    const expectedGrid = [
      [4, 2, 2, 4],
      [4, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]

    grid.moveTiles(Direction.Up);

    assertGridEqual(grid, expectedGrid);
  });

  it(`should move tiles down`, () => {
    grid.setupInitialPredefinedGrid([
      [2, 0, 0, 2],
      [2, 2, 0, 0],
      [2, 0, 2, 0],
      [2, 0, 0, 2],
    ])

    const expectedGrid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [4, 0, 0, 0],
      [4, 2, 2, 4],
    ]

    grid.moveTiles(Direction.Down);

    assertGridEqual(grid, expectedGrid);
  });

  it(`should move tiles left`, () => {
    grid.setupInitialPredefinedGrid([
      [2, 0, 0, 2],
      [2, 2, 0, 0],
      [2, 0, 2, 0],
      [0, 0, 0, 2],
    ])

    const expectedGrid = [
      [4, 0, 0, 0],
      [4, 0, 0, 0],
      [4, 0, 0, 0],
      [2, 0, 0, 0],
    ]

    grid.moveTiles(Direction.Left);

    assertGridEqual(grid, expectedGrid);
  });

  it(`should move tiles right`, () => {
    grid.setupInitialPredefinedGrid([
      [2, 0, 0, 2],
      [2, 2, 0, 0],
      [2, 0, 2, 0],
      [0, 0, 0, 2],
    ])

    const expectedGrid = [
      [0, 0, 0, 4],
      [0, 0, 0, 4],
      [0, 0, 0, 4],
      [0, 0, 0, 2],
    ]

    grid.moveTiles(Direction.Right);

    assertGridEqual(grid, expectedGrid);
  });

  it(`should move tiles left - more complex`, () => {
    grid.setupInitialPredefinedGrid([
      [8, 4, 64, 4],
      [2, 0, 4, 0],
      [2, 512, 64, 8],
      [128, 256, 4, 16],
    ])

    const expectedGrid = [
      [8, 4, 64, 4],
      [2, 4, 0, 0],
      [2, 512, 64, 8],
      [128, 256, 4, 16],
    ]

    grid.moveTiles(Direction.Left);

    assertGridEqual(grid, expectedGrid);
  });

  it(`should be in a deadlock`, () => {
    grid.setupInitialPredefinedGrid([
      [1, 2, 4, 8],
      [8, 4, 2, 1],
      [1, 2, 4, 8],
      [8, 4, 2, 1],
    ])

    const expectedGrid = [
      [1, 2, 4, 8],
      [8, 4, 2, 1],
      [1, 2, 4, 8],
      [8, 4, 2, 1],
    ]

    grid.moveTiles(Direction.Left);
    grid.moveTiles(Direction.Right);
    grid.moveTiles(Direction.Up);
    grid.moveTiles(Direction.Down);

    assertGridEqual(grid, expectedGrid);
  });

  it(`should move tiles left - more complex`, () => {
    grid.setupInitialPredefinedGrid([
      [1, 2, 4, 8],
      [8, 512, 512, 1],
      [1, 2, 4, 8],
      [8, 4, 2, 1],
    ])

    const expectedGrid = [
      [1, 2, 4, 8],
      [8, 1024, 1, 0],
      [1, 2, 4, 8],
      [8, 4, 2, 1],
    ]

    grid.moveTiles(Direction.Left);

    assertGridEqual(grid, expectedGrid);
  });

  it(`should merge tiles left`, () => {
    grid.setupInitialPredefinedGrid([
      [0, 0, 4, 4],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])

    const expectedGrid = [
      [8, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]

    grid.moveTiles(Direction.Left);

    assertGridEqual(grid, expectedGrid);
  });

  it(`should perform a single merge only - up`, () => {
    grid.setupInitialPredefinedGrid([
      [64, 0, 0, 0],
      [32, 0, 0, 0],
      [16, 0, 0, 0],
      [16, 0, 0, 0],
    ])

    const expectedGrid = [
      [64, 0, 0, 0],
      [32, 0, 0, 0],
      [32, 0, 0, 0],
      [0, 0, 0, 0],
    ]

    grid.moveTiles(Direction.Up);

    assertGridEqual(grid, expectedGrid);
  });

  it(`should move tiles up again`, () => {
    grid.setupInitialPredefinedGrid([
      [0, 0, 0, 0],
      [4, 0, 0, 0],
      [8, 0, 0, 0],
      [4, 0, 0, 0],
    ])

    const expectedGrid = [
      [4, 0, 0, 0],
      [8, 0, 0, 0],
      [4, 0, 0, 0],
      [0, 0, 0, 0],
    ]

    grid.moveTiles(Direction.Up);

    assertGridEqual(grid, expectedGrid);
  });

  it(`should move tiles right - more complex with a gap`, () => {
    grid.setupInitialPredefinedGrid([
      [256, 4, 32, 4],
      [64, 2, 2, 2],
      [8, 64, 0, 4],
      [16, 8, 0, 4],
    ])

    const expectedGrid = [
      [256, 4, 32, 4],
      [0, 64, 2, 4],
      [0, 8, 64, 4],
      [0, 16, 8, 4],
    ]

    grid.moveTiles(Direction.Right);

    assertGridEqual(grid, expectedGrid);
  });
});

function assertGridEqual(grid: Grid, expectedGrid: number[][]) {
  grid.tiles.forEach((row) => {
    row.forEach((col) => {
      expect(col.value).toBe(expectedGrid[col.position.y][col.position.x]);
    });
  });
}
