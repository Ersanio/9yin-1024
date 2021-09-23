import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TileComponent } from './components/tile/tile.component';
import { GridComponent } from './components/grid/grid.component';
import { CustomHammerConfig } from './hammerconfig';

@NgModule({
  declarations: [
    AppComponent,
    TileComponent,
    GridComponent
  ],
  imports: [
    BrowserModule,
    HammerModule
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: CustomHammerConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
