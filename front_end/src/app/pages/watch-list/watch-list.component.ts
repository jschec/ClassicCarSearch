import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { NavigationExtras, Router } from '@angular/router';
import { IWatchListMinified, IWatchListPopulated, WatchListService } from 'src/app/services/watchList.service';
import { ISearch, SearchService } from 'src/app/services/search.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { getMatAutocompleteMissingPanelError } from '@angular/material/autocomplete';
import { UserService, IUser } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.scss'],
})
export class WatchListComponent {
  // raw data, fetch from backend
  watchList: IWatchListPopulated | null = null;
  user: IUser | null = null;
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
    private searchService: SearchService,
    private userService: UserService,
    private snackBar: MatSnackBar) {
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

  onSearchNavigate(record: ISearch): void {
    var { search, ...narrowCriteria } = record.criteria;

    let navigationExtras: NavigationExtras = {
      queryParams: {
        searchCriteria: JSON.stringify(narrowCriteria)
      }
    }

    this.router.navigate(['/search'], navigationExtras);
  }

  onRemoveSearch(searchId: string): void {
    this.loading = true;
    this.watchListService.getByWatchListId(this.watchList!.id).subscribe((watchList: IWatchListMinified) => {
      const originalCount = watchList.searches.length;
      watchList.searches = watchList.searches.filter(item => item !== searchId);
      if (watchList.searches.length != originalCount) {
        this.watchListService.updateWatchList(watchList.id as string, watchList).subscribe((newWatchList: IWatchListMinified) => {
          this.watchList!.searches = this.watchList?.searches.filter(item => item.id !== searchId) as ISearch[];
          this.updateUIState(this.user, this.watchList);
          this.snackBar.open("Successfully removed search record!", "close");
        });
      } else {
        this.watchList!.searches = this.watchList?.searches.filter(item => item.id !== searchId) as ISearch[];
        this.updateUIState(this.user, this.watchList);
        this.snackBar.open("Successfully removed search record!", "close");
      }
    });
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

  getMeanPrice(search: ISearch): number {
    let priceArr: Array<number> = [];
    search.results.forEach((result) => {
      priceArr.push(result.price);
    })

    const sum = priceArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const mean = sum / priceArr.length;

    return mean;
  }

  getMedianPrice(search: ISearch): number {
    let priceArr: Array<number> = [];
    search.results.forEach((result) => {
      priceArr.push(result.price);
    })

    // Sort the array in ascending order
    const sortedArr = priceArr.sort((a, b) => a - b);
    const length = sortedArr.length;
    if (length === 0) {
      return 0;
    }

    const middleIndex = Math.floor(length / 2);
    if (length % 2 === 0) {
      // Array length is even
      return (sortedArr[middleIndex - 1] + sortedArr[middleIndex]) / 2;
    } else {
      // Array length is odd
      return sortedArr[middleIndex];
    }
  }

  hasCriteriaRegion(search: ISearch): boolean {
    if (search.criteria?.region) {
      return search.criteria?.region.length > 0;
    }
    return false;
  }

  hasExteriorCondition(search: ISearch): boolean {
    if (search.criteria?.exteriorCondition) {
      return search.criteria?.exteriorCondition.length > 0;
    }
    return false;
  }

  hasMechanicalCondition(search: ISearch): boolean {
    if (search.criteria?.mechanicalCondition) {
      return search.criteria?.mechanicalCondition.length > 0;
    }
    return false;
  }

  getCriteriaRegion(search: ISearch): string {
    if (search.criteria?.region) {
      return search.criteria?.region.join(",");
    }
    return "";
  }

  getExteriorCondition(search: ISearch): string {
    if (search.criteria?.exteriorCondition) {
      return search.criteria?.exteriorCondition.join(",");
    }
    return "";
  }

  getMechanicalCondition(search: ISearch): string {
    if (search.criteria?.mechanicalCondition) {
      return search.criteria?.mechanicalCondition.join(",");
    }
    return "";
  }

  getMedianPriceText(search: ISearch): string {
    return this.formatPriceText(this.getMedianPrice(search));
  }

  getMeanPriceText(search: ISearch): string {
    return this.formatPriceText(this.getMeanPrice(search));
  }

  getMedianDateText(search: ISearch): number {
    let priceArr: Array<number> = [];
    search.results.forEach((result) => {
      priceArr.push(new Date(result.listDate.toString()).getTime());
    })

    // Sort the array in ascending order
    const sortedArr = priceArr.sort((a, b) => a - b);
    const length = sortedArr.length;
    if (length === 0) {
      return 0;
    }

    const middleIndex = Math.floor(length / 2);
    if (length % 2 === 0) {
      // Array length is even
      return this.calculateDaysPassed((sortedArr[middleIndex - 1] + sortedArr[middleIndex]) / 2);
    } else {
      // Array length is odd
      return this.calculateDaysPassed(sortedArr[middleIndex]);
    }
  }

  private calculateDaysPassed(timestamp: number): number {
    const currentDate = new Date();
    const currentTimestamp = currentDate.getTime();

    const timeDiff = currentTimestamp - timestamp;
    const daysPassed = Math.floor(timeDiff / (24 * 60 * 60 * 1000));

    return daysPassed;
  }

  private formatPriceText(num: number): string {
    return num.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }

  private getWatchList(user: IUser): void {
    this.loading = true;
    this.watchListService.getByUserId(user.id).subscribe((watchList: IWatchListPopulated) => {
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
      'user': this.user,
    };
    const title = document.title;
    const url = window.location.href;
    window.history.pushState(state, title, url);
  }

  private restoreState(state: any) {
    this.updateUIState(state.user, state.watchList);
    this.updateUIWatchListByPage(state.pageSize, state.pageIndex);
  }

  private updateUIState(user: IUser | null, watchList: IWatchListPopulated | null): void {
    this.loading = false;
    this.updateUIUser(user);
    this.updateUIWatchList(watchList);
  }

  private updateUIUser(user: IUser | null): void {
    this.user = user;
    if (user) {
      this.userName = `${user.firstName} ${user.lastName}`;
    } else {
      this.userName = "None";
    }
  }

  private updateUIWatchList(watchList: IWatchListPopulated | null): void {
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
