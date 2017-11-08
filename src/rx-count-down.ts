import * as moment from "moment";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import "rxjs/add/observable/interval";
import "rxjs/add/observable/timer";
import "rxjs/add/observable/never";
import "rxjs/add/operator/map";
import "rxjs/add/operator/finally";
import "rxjs/add/operator/takeUntil";

export class RxCountDown {
    private remainingTime: string = "";
    private timerObservable: Observable<number>;
    private onCompleteFn: () => void;
    private expired: boolean = false;

    constructor(private durationMs: number = 0,
                private endDate: string = "",
                private intervalMs: number = 1000,
                private format: string = "mm:ss") {

        this.tick();
        if (this.isExpired()) {
            this.timerObservable = Observable.never();
            return;
        }

        this.timerObservable = this.generateTimerObservable();
        this.timerObservable
            .finally(() => {
                this.complete();
            })
            .subscribe(() => {
                this.tick();
            });
    }

    private generateTimerObservable(): Observable<number> {
        let remainingTimeMs = this.computeRemainingTimeMs(this.endDate, this.durationMs);
        return Observable.interval(this.intervalMs)
            .takeUntil(Observable.timer(remainingTimeMs));
    }

    private tick(): void {
        let remainingTimeMs = this.computeRemainingTimeMs(this.endDate, this.durationMs);
        this.remainingTime = this.computeRemainingTimeString(remainingTimeMs);

        if (remainingTimeMs <= 0) {
            this.complete();
        }
    }

    private complete(): void {
        if (this.onCompleteFn) {
            this.onCompleteFn();
        }
        this.setExpired();
    }

    private computeRemainingTimeString(remainingTimeMs: number): string {
        if (remainingTimeMs <= 0) {
            return "";
        }
        return moment(remainingTimeMs).format(this.format);
    }

    private computeRemainingTimeMs(targetDate: string, durationMs: number): number {
        if (!targetDate && !durationMs) {
            return 0;
        }
        return moment(targetDate).valueOf() - moment().valueOf() + durationMs;
    }

    private setExpired(): void {
        this.expired = true;
    }

    onComplete(onCompleteFn: () => void): void {
        this.onCompleteFn = onCompleteFn;
    }

    getRemainingTime(): string {
        return this.remainingTime;
    }

    isExpired(): boolean {
        return this.expired;
    }

    subscribe(next?: (value: string) => void,
              error?: (error: any) => void,
              complete?: () => void): Subscription {

        return this.timerObservable
            .map(() => {
                return this.getRemainingTime();
            })
            .subscribe(next, error, complete);
    }
}
