import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {}

  public changePageTo(way: string): void {

    if (way === 'itinerary') {
      this.router.navigate(['itinerary'])
    }

    if (way === 'strategic-point') {
      this.router.navigate(['strategic-point'])
    }

    if (way === 'gps') {
      this.router.navigate(['gps'])
    }

  }
}
