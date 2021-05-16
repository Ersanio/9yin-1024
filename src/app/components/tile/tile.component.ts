import { Component, Input, OnInit } from '@angular/core';

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

  @Input()
  public posX: number = 0;

  @Input()
  public posY: number = 0;

  @Input()
  public value: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  public getStyle(): any {
    return {
      'transform': 'translate(' + this.getTileX() + 'px, ' + this.getTileY() + 'px)',
      'background-image': 'url(assets/' + this.value +'.png)'
     }
  }

  public getTileX(): number {
    return (this.posX * this.heightX) + (this.posX * this.gapX);
  }

  public getTileY(): number {
    return (this.posY * this.heightY) + (this.posY * this.gapY);
  }
}
