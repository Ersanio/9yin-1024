import { Component, OnInit } from '@angular/core';
import { Point } from './models/point';
import { Tile } from './models/tile';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private readonly ARROW_LEFT = 37;
  private readonly ARROW_UP = 38;
  private readonly ARROW_RIGHT = 39;
  private readonly ARROW_DOWN = 40;

  ngOnInit(): void {
  }

  private moveTiles() {

  }

  private mergeTiles() {

  }

  private checkLoss() {

  }

  private checkWin() {

  }
}
