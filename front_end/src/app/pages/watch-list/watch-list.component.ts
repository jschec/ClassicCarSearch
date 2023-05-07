import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { of, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { ISearch, IWatchList, WatchListService } from 'src/app/core/services/watchList.service';

@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.scss'],
})
export class WatchListComponent {
  // raw data, fetch from backend
  watchList: IWatchList | null = null;
  // Objects for UI data binding, because our current WatchList object, the searches record is a complete list in the object, so it is currently unable to provide the back-end page-turning request, and the page-turning implementation is managed on the front-end.
  userName: string = "";
  totalCount: number = 0;
  pageSearches: string[] = [];
  pageIndex: number = 0;
  pageSizeList: number[] = [5, 10, 25, 100]
  pageSize: number = this.pageSizeList[0];

  constructor(private authService: AuthService,
    private watchListService: WatchListService) {
  }

  ngOnInit(): void {
    // get login user from auth service.
    let user = this.authService.getCurrentUser();
    this.updateUIState(user, null);

    // TODO: get userId from user
    let userId: string = "645152ad99d4ed3965a94438";
    this.watchListService.getByUserId(userId).subscribe(response => {
      this.updateUIState(user, response);
    });
  }

  ngOnDestroy(): void {

  }

  ngAfterViewInit(): void {
    //
  }

  onPageChanged(event: PageEvent): void {
    this.updateUIWatchListByPage(event.pageSize, event.pageIndex);
  }

  private updateUIState(user: any, watchList: IWatchList | null): void {
    this.updateUIUser(user);
    this.updateUIWatchList(watchList);
  }

  private updateUIUser(user: any): void {
    // TODO: auth service
    this.userName = "Zhihai";
  }

  private updateUIWatchList(watchList: IWatchList | null): void {
    if (!watchList) {
      return;
    }
    this.watchList = watchList;
    this.totalCount = watchList.searches.length;
    this.updateUIWatchListByPage(this.pageSize, 0);
  }

  private updateUIWatchListByPage(pageSize: number, pageIndex: number): void {
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
  }
}
