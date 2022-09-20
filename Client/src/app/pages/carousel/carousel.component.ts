import { Component, HostListener, ViewChild, ElementRef } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { FunctionsService } from "src/app/services/functions.service";

@Component({
  selector: "app-carousel",
  templateUrl: "./carousel.component.html",
  styleUrls: ["./carousel.component.css"]
})
export class CarouselComponent {
  content: any;
  totalCards: number = this.countObj();
  currentPage: number = 1;
  pagePosition: string = "0%";
  cardsPerPage: number = 0
  totalPages: number = 0
  overflowWidth: string | any
  cardWidth: string | any
  containerWidth: number = 0
  @ViewChild("container", { static: true, read: ElementRef })
  private container = {} as ElementRef;
  loading = false;
  @HostListener("window:resize") windowResize() {
    let newCardsPerPage = this.getCardsPerPage();
    if (newCardsPerPage != this.cardsPerPage) {
      this.cardsPerPage = newCardsPerPage;
      this.initializeSlider();
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
        this.populatePagePosition();
      }
    }
  }

  constructor(
    public api: ApiService,
    public fun: FunctionsService,
  ) { }

  ngOnInit() {
    this.cardsPerPage = this.getCardsPerPage();
    this.initializeSlider();
  }

  countObj() {
    let count = 0;
    for (let properties in this.content) {
      count += 1
    }
    return count;
  }

  initializeSlider() {
    this.totalPages = Math.ceil(this.totalCards / this.cardsPerPage);
    this.overflowWidth = `calc(${this.totalPages * 100}% + ${this.totalPages *
      20}px)`;
    this.cardWidth = `calc((${100 / this.totalPages}% - ${this.cardsPerPage *
      20}px) / ${this.cardsPerPage})`;
  }

  getCardsPerPage() {
    return Math.floor(this.container.nativeElement.offsetWidth / 250); 
  }

  changePage(incrementor: number) {
    this.currentPage += incrementor;
    this.populatePagePosition();
  }

  populatePagePosition() {
    this.pagePosition = `calc(${-100 * (this.currentPage - 1)}% - ${10 *
      (this.currentPage - 1)}px)`;
  }

  getFeature() {
    this.loading = true;
    this.api.get(`feature`)
      .subscribe({next: (response: any) => {
        this.loading = false;
        this.content = response;
      }, error: (e) => {
        this.loading = false;
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }});
  }
}
