import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/core/services/auth.service';
import { IWatchList, WatchListService } from 'src/app/core/services/watchList.service';

@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.scss'],
})
export class WatchListComponent {
  watchList: IWatchList | null = null;
  totalCount: number = 0;
  pageSearches: string[] = [];
  pageIndex: number = 0;
  pageSizeList: number[] = [5, 10, 25, 100]
  pageSize: number = this.pageSizeList[0];

  constructor(private authService: AuthService,
    private watchListService: WatchListService) {
  }

  ngOnInit(): void {
    let user = this.authService.getCurrentUser();
    // TODO: get userId from user
    let userId: string = "645152ad99d4ed3965a94438";
    this.watchListService.getByUserId(userId).subscribe(response => {
      this.updateState(response);
    });
  }

  ngOnDestroy(): void {

  }

  ngAfterViewInit(): void {
    // this.updateState(this.watchList);
  }

  onPageChanged(event: PageEvent): void {
    this.updateSearchesByPage(event.pageSize, event.pageIndex);
  }

  private updateState(watchList: IWatchList | null): void {
    console.log(watchList);
    if (!watchList) {
      return;
    }
    this.watchList = watchList;
    this.totalCount = watchList.searches.length;
    this.updateSearchesByPage(this.pageSize, 0);
  }

  private updateSearchesByPage(pageSize: number, pageIndex: number): void {
    if (!this.watchList) {
      this.pageSearches = [];
      this.pageIndex = 0;
      this.pageSize = pageSize;
      return;
    }
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pageSearches = this.watchList!.searches.slice(start, end);
    console.log(this.pageSearches);
  }
}
