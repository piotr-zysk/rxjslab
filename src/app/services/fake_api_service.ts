import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class FakeApiService {
  getContinentsErrorProbabilityPercent = 50;
  getTranslationsErrorProbabilityPercent = 50;
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
      let delayedQuery: any;
      console.log('getContinents$(' + path + ') [' + index + '] - subscribed after ' + this.getTimeSpan() + 's');

      if (this.randomError(this.getContinentsErrorProbabilityPercent)) {
        delayedQuery = setTimeout(() => {
          console.log('getContinents$(' + path + ') [' + index + '] - throwed error after ' + this.getTimeSpan() + 's');
          observer.error('error thrown by getContinents()');
        }, 1000);
      }
      else {
        delayedQuery = setTimeout(() => {
          const result = this.getMatchingContinents(path);
          observer.next(result);
          console.log(result);
          console.log('getContinents$(' + path + ') [' + index + '] - value return after ' + this.getTimeSpan() + 's');
          observer.complete();
          console.log('getContinents$(' + path + ') [' + index + '] - completed ater ' + this.getTimeSpan() + 's');
        }, 2000);
      }
      return function unsubscribe() {
          clearTimeout(delayedQuery);
          console.log('getContinents$(' + path + ') [' + index + '] - unsubscribed after ' + this.getTimeSpan() + 's');
        }.bind(this);
    });
  }

  public getTranslations$(continents: string[]): Observable<string[]> {
    return new Observable<string[]>(observer => {
      this.checkStartTime();
      const index = this.getTranslationsCounter++;
      let delayedQuery: any;
      console.log('getTranslations$(' + continents.join(',') + ') [' + this.getTranslationsCounter + '] - subscribed after ' + this.getTimeSpan() + 's');

      if (this.randomError(this.getTranslationsErrorProbabilityPercent)) {
        delayedQuery = setTimeout(() => {
          console.log('getTranslations$(' + continents.join(',') + ') [' + this.getTranslationsCounter + '] - throwed error after ' + this.getTimeSpan() + 's');
          observer.error('error thrown by getContinents()');
        }, 2000);
      }
      else {
        delayedQuery = setTimeout(() => {
          const result = this.getTranslatedContinents(continents);
          observer.next(result);
          console.log(result);
          console.log('getTranslations$(' + continents.join(',') + ') [' + this.getTranslationsCounter + '] - value return after ' + this.getTimeSpan() + 's');
          observer.complete();
          console.log('getTranslations$(' + continents.join(',') + ') [' + this.getTranslationsCounter + '] - completed after ' + this.getTimeSpan() + 's');
        }, 2000);
      }

      return function unsubscribe() {
          clearTimeout(delayedQuery);
          console.log('getTranslations$(' + continents.join(',') + ') [' + this.getTranslationsCounter + '] - unsubscribed after ' + this.getTimeSpan() + 's');
        }.bind(this);
    });
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

  private getTime() {
    return new Date().toISOString().substring(11, 23);
  }

  private getMatchingContinents(searchKey: string): string[] {
    return this.getContinents().filter(el => el.indexOf(searchKey) > -1);
  }

  private getTranslatedContinents(continents: string[]): string[] {
    const result = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < continents.length; i++) {
        result.push(this.getTranslatedContinent(continents[i]));
    }
    return result;
  }

  private getTranslatedContinent(continent: string): string {
    for (const item of this.translations) {
        if (item.en === continent)
            return item.pl;
    }
  }

  private randomError(errorProbability: number): boolean {
    return Math.random() * 100 < errorProbability;
  }
}
