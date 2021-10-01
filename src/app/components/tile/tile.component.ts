import { Component, Input, OnInit } from '@angular/core';
import { Tile } from 'src/app/models/tile';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {

  public readonly gapX: number = 13;
  public readonly gapY: number = 14;
  public readonly heightX: number = 90;
  public readonly heightY: number = 90;

  private gameScale: number;
  private tileSize: number;

  @Input()
  public tile: Tile;

  public ngOnInit(): void {
    this.gameScale = Number.parseFloat(getComputedStyle(document.querySelector(':root') as Element).getPropertyValue('--scale-game'));
    this.tileSize = Number.parseInt(getComputedStyle(document.querySelector(':root') as Element).getPropertyValue('--tile-size'), 10);
  }

  public getStyle(): any {
    return {
      transform: 'translate(' + this.getTileX() + 'px, ' + this.getTileY() + 'px)',
      'background-position-x': `-${(Math.log2(this.tile.value) - 1) * (this.tileSize * this.gameScale)}px`,
    };
  }

  public getTileX(): number {
    return ((this.tile.position.x * this.heightX) + (this.tile.position.x * this.gapX)) * this.gameScale;
  }

  public getTileY(): number {
    return ((this.tile.position.y * this.heightY) + (this.tile.position.y * this.gapY)) * this.gameScale;
  }
}
