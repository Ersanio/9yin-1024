import { Component, Input, OnInit } from '@angular/core';
import { Tile } from 'src/app/models/tile';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent {
  public readonly gapX: number = 13;
  public readonly gapY: number = 14;
  public readonly heightX: number = 90;
  public readonly heightY: number = 90;

  @Input()
  public tile: Tile;

  public getStyle(): any {
    return {
      'transform': 'translate(' + this.getTileX() + 'px, ' + this.getTileY() + 'px)',
      'background-image': 'url(assets/' + this.tile.value +'.png)'
     }
  }

  public getTileX(): number {
    return (this.tile.position.x * this.heightX) + (this.tile.position.x * this.gapX);
  }

  public getTileY(): number {
    return (this.tile.position.y * this.heightY) + (this.tile.position.y * this.gapY);
  }
}
