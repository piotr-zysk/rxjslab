import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class FakeApiService {
  getContinentsCounter = 0;
  getTranslationsCounter = 0;
  startTime: Date;

  private translations =
  [
    {en: 'africa', pl: 'Afryka'},
    {en: 'antarctica', pl: 'AAntarktyka'},
    {en: 'asia', pl: 'Azja'},
    {en: 'australia', pl: 'Australia'},
    {en: 'europe', pl: 'Europa'},
    {en: 'north america', pl: 'Ameryka Północna'},
    {en: 'south america', pl: 'Ameryka Południowa'}
  ];

  constructor() { }

  public getContinents$(path: string): Observable<string[]> {
    return new Observable<string[]>(observer => {
      this.checkStartTime();
      const index = this.getContinentsCounter++;
      console.log('getContinents$(' + path + ') [' + index + '] - subscribed after ' + this.getTimeSpan() + 's');
      const runDelayedQuery = setTimeout(() => {
        observer.next(this.getMatchingContinents(path));
        console.log('getContinents$(' + path + ') [' + index + '] - value return after ' + this.getTimeSpan() + 's');
        observer.complete();
        console.log('getContinents$(' + path + ') [' + index + '] - completed ater ' + this.getTimeSpan() + 's');
      }, 2000);
      return function unsubscribe() {
          clearTimeout(runDelayedQuery);
          console.log('getContinents$(' + path + ') [' + index + '] - unsubscribed after ' + this.getTimeSpan() + 's');
        }.bind(this);
    });
  }

  getTime() {
    return new Date().toISOString().substring(11, 23);
  }

  private zeroFill(num, len) {
    return (Array(len).join('0') + num).slice(-len);
  }

  private checkStartTime(): void {
    if (!this.startTime)
      this.startTime = new Date();
  }

  private getTimeSpan(): string {
    const totalMs = (new Date()).valueOf() - this.startTime.valueOf();
    const s = Math.floor(totalMs / 1000);
    const sWithSep = s ? s + '.' : '';
    const ms = this.zeroFill(totalMs % 1000, 3);
    return sWithSep + ms;
  }

  private getContinents(): string[] {
    return this.translations.map(el => el.en);
  }

  private getMatchingContinents(searchKey: string): string[] {
    return this.getContinents().filter(el => el.indexOf(searchKey) > -1);
  }

}
