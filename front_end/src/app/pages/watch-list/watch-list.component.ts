import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { NavigationExtras, Router } from '@angular/router';
import { IWatchList, WatchListService } from 'src/app/core/services/watchList.service';
import { ISearch } from 'src/app/core/services/search.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { UserService, IUser } from 'src/app/core/services/user.service';

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
    private router: Router,
    private watchListService: WatchListService,
    private userService: UserService) {
  }

  ngOnInit(): void {
    console.log('---ngOnInit---');
    
    // retrieve current user from user service
    this.userService.getCurrentUser().subscribe(
      (user: IUser) => {
        this.updateUIState(user, null);
        this.getWatchList(user);
    });
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

  private getWatchList(user: IUser): void {
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
    this.updateUIState(null, state.watchList);
    this.updateUIWatchListByPage(state.pageSize, state.pageIndex);
  }

  private updateUIState(user: IUser | null, watchList: IWatchList | null): void {
    this.loading = false;
    this.updateUIUser(user);
    this.updateUIWatchList(watchList);
  }

  private updateUIUser(user: IUser | null): void {
    if (user) {
      this.userName = `${user.firstName} ${user.lastName}`;
    } else {
      this.userName = "None";
    }
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

  public onSearchNavigate(record: ISearch): void {
    var { search, ...narrowCriteria} = record.criteria;

    let navigationExtras: NavigationExtras = {
      queryParams: {
        searchCriteria: JSON.stringify(narrowCriteria)
      }
    }

    this.router.navigate(['/search'], navigationExtras);
  }
}
