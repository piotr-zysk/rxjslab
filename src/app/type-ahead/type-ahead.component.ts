import { Component, OnInit } from '@angular/core';
import { FakeApiService } from '../services/fake_api_service';
import { fromEvent, asyncScheduler } from 'rxjs';
import { map, filter, debounceTime, switchMap, mergeMap, distinctUntilChanged, tap, throttleTime, auditTime } from 'rxjs/operators';

@Component({
  selector: 'app-typeahead',
  templateUrl: './type-ahead.component.html',
  styleUrls: [ './type-ahead.component.css' ]
})
export class TypeAheadComponent implements OnInit {
  name = 'Angular';
  items = [];
  clickCounter = 0;
  filteredClickCounter = 0

  constructor(private fakeApi: FakeApiService) {}

  ngOnInit() {
    const typeaheadSubsciprtion = fromEvent(document.getElementById('searchBox'), 'input').pipe(​
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),​
      filter(text => text.length > 1),​
      debounceTime(200),​
      distinctUntilChanged(),​
      switchMap(data => this.fakeApi.getContinents$(data))​
    ).subscribe(data => { this.items = data; });

    const clickSubscription = fromEvent(document.getElementById('clickMeButton'), 'click').pipe(​
      tap(() => console.log('click -> source event ' + ++this.clickCounter + ' at ' + this.fakeApi.getTime())),

      //debounceTime(2000), // przekaz tylko ostatni event po okresie bezczynnosci trwajacym x // np typeahead / podpowiedzi, wszedzie tam gdzie po prostu chcemy przeczekac stan nieustalowny
      throttleTime(2000), // przekaz event niezwlocznie, ignoruj eventy ktore pojawily sie szybciej niz po x od poprzedniego przekazania // np klikanie przycisku do glosowania
      //throttleTime(2000, asyncScheduler, { leading: true, trailing: true }), // obsluz event niezwlocznie, jesli kolejne eventy pojawily sie w ciag x od poprzedniego przekazania, to po x przekaz ostatni z nich // synchronizacja
      //auditTime(2000), // co x czasu przekazuj dalej ostatni event (odczekaj x rowniez przed pierwszym przekazaniem) //scroll, resize ?
      //throttleTime(2000, asyncScheduler, { leading: true, trailing: false }), // default throttleTime strategy
      //throttleTime(2000, asyncScheduler, { leading: false, trailing: true }), // jak auditTime
      //throttleTime(2000, asyncScheduler, { leading: false, trailing: false }), // blokujemy wszystko

      tap(() => console.log('source event ' + this.clickCounter + ' -> target event ' + ++this.filteredClickCounter + ' at ' + this.fakeApi.getTime()))
    ).subscribe();
  }
}

