import { Component, OnInit } from '@angular/core';
import { FakeApiService } from '../services/fake_api_service';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, switchMap, mergeMap, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-typeahead',
  templateUrl: './type-ahead.component.html',
  styleUrls: [ './type-ahead.component.css' ]
})
export class TypeAheadComponent implements OnInit {
  name = 'Angular';
  items = [];

  constructor(private fakeApi: FakeApiService) {}

  ngOnInit() {
    const typeahead = fromEvent(document.getElementById('searchBox'), 'input').pipe(​
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),​
      filter(text => text.length > 1),​
      debounceTime(200),​
      distinctUntilChanged(),​
      switchMap(data => this.fakeApi.getContinents$(data))​
    ).subscribe(data => { this.items = data; });;​
  }

}

