import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { concatMap, map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { IWatchList, WatchListService } from 'src/app/core/services/watchList.service';
import { ISearch, SearchService } from 'src/app/core/services/search.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.scss'],
})
export class WatchListComponent {
  // raw data, fetch from backend
  watchList: IWatchList | null = null;
  // data binding
  userName: string = "";
  totalCount: number = 0;
  pageSearches: ISearch[] = [];
  loading: boolean = true;
  notifyByEmails: Record<string, boolean> = {};
  notifyBySMSs: Record<string, boolean> = {};
  // ui state
  pageIndex: number = 0;
  pageSizeList: number[] = [5, 10, 25, 100]
  pageSize: number = this.pageSizeList[0];
  // temp state
  needScrollToBottom: boolean = false;

  constructor(
    private authService: AuthService,
    private watchListService: WatchListService,
    private searchService: SearchService) {

  }

  ngOnInit(): void {
    console.log('---ngOnInit---');
    const user = this.getCurrentUser()
    this.updateUIState(user, null);
    this.queryByUser(user);
  }

  ngOnDestroy(): void {
    console.log('---ngOnDestroy---');
    this.saveState();
  }

  ngAfterViewInit(): void {
    console.log('---ngAfterViewInit---');
  }

  ngAfterViewChecked(): void {
    if (this.needScrollToBottom) {
      this.needScrollToBottom = false;
      this.scrollToBottom();
    }
  }

  onPageChanged(event: PageEvent): void {
    this.updateUIWatchListByPage(event.pageSize, event.pageIndex);
    this.saveState();
    this.needScrollToBottom = true;
  }

  onNotifyByEmailChanged(event: MatCheckboxChange, searchId: string): void {
    console.log(this.notifyByEmails[searchId], event.checked);
  }

  onNotifyBySMSChanged(event: MatCheckboxChange, searchId: string): void {
    console.log(this.notifyBySMSs[searchId], event.checked);
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    console.log('---onPopState---');
    const state = history.state;
    this.restoreState(state);
  }

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  scrollToBottom() {
    const element = this.scrollContainer.nativeElement;
    element.scrollTop = element.scrollHeight;
    console.log(element.scrollHeight);
  }

  private getCurrentUser(): any {
    // TODO: After the login mechanism is completed, here the current user is retrieved through the AuthService.
    // return this.authService.getCurrentUser();

    // TODO: currently use mock data.
    const userJSON = {
      id: '5e6da5a1-dd55-4661-8527-1b41473358ce',
      fullName: 'Ward Bogan',
      pictureUri: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/886.jpg'
    };
    return userJSON;
  }

  private queryByUser(user: any): void {
    this.loading = true;
    this.watchListService.getByUserId(user.id).subscribe((watchList: IWatchList) => {
      console.log(watchList.searches);
      this.updateUIState(user, watchList);
      this.saveState();
    });
  }

  private saveState() {
    const state = {
      'pageIndex': this.pageIndex,
      'pageSize': this.pageSize,
      'watchList': this.watchList,
    };
    const title = document.title;
    const url = window.location.href;
    window.history.pushState(state, title, url);
  }

  private restoreState(state: any) {
    this.updateUIState(this.getCurrentUser(), state.watchList);
    this.updateUIWatchListByPage(state.pageSize, state.pageIndex);
  }

  private updateUIState(user: any, watchList: IWatchList | null): void {
    this.loading = false;
    this.updateUIUser(user);
    this.updateUIWatchList(watchList);
  }

  private updateUIUser(user: any): void {
    this.userName = user.fullName;
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
    this.pageSearches = (this.watchList.searches as ISearch[]).slice(start, end);
  }
}
