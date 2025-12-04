import {Component, Input, OnInit} from '@angular/core';

export enum MarginSizes {
  Small = 'small',
  Default = 'default',
  Big = 'big'
}

@Component({
    selector: 'app-margin',
    templateUrl: './margin.component.html',
    styleUrls: ['./margin.component.css'],
    standalone: false
})
export class MarginComponent implements OnInit {

  @Input() size: MarginSizes;

  constructor() {
    this.size = MarginSizes.Default;
  }

  ngOnInit(): void {
    if (!MarginSizes.hasOwnProperty(this.size)){
      this.size = MarginSizes.Default;
    }
  }

  get cssClass(): string {
    return this.size.toLowerCase();
  }

}

