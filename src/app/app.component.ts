import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { GridComponent } from './components/grid/grid.component';
import { Direction } from './models/direction';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  ngOnInit(): void {
  }

  @ViewChild(GridComponent)
  private gridComponent!: GridComponent;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    switch (event.key) {
      case "ArrowLeft":
        this.moveTiles(Direction.Left);
        break;
      case "ArrowUp":
        this.moveTiles(Direction.Up);
        break;
      case "ArrowRight":
        this.moveTiles(Direction.Right);
        break;
      case "ArrowDown":
        this.moveTiles(Direction.Down);
        break;
    }
  }

  private moveTiles(direction: Direction) {
    this.gridComponent.moveTiles(direction);
  }

  private mergeTiles() {

  }

  private checkLoss() {

  }

  private checkWin() {

  }
}
