import { Component } from '@angular/core';
// import { LayoutModule } from '@angular/material/layout';
// import { MatCardModule } from '@angular/material/card';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.scss'],
})
export class WatchListComponent {
  tiles: Tile[] = [
    { text: 'One', cols: 3, rows: 1, color: 'lightblue' },
    { text: 'Two', cols: 1, rows: 2, color: 'lightgreen' },
    { text: 'Three', cols: 1, rows: 1, color: 'lightpink' },
    { text: 'Four', cols: 2, rows: 1, color: '#DDBDF1' },
  ];
  items = [
    {
      name: "1",
    },
    {
      name: "2",
    },
    {
      name: "3",
    },
    {
      name: "4",
    },
  ];
  longText = "alsdfjlaskd fjlsajflaskjfd asdfasdf asf asdf sdfasf asdf  asdf asdfasdf asd asdf asdf asdfasdf asdf asdfasdfasdf laskfjlasfdjlas lasdkfjlasdkjf lsadj flasdjfla sdfjlaskdfalskdfaaaaaa";
}
