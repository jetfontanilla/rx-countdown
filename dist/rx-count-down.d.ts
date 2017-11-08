import { Subscription } from "rxjs/Subscription";
import "rxjs/add/observable/interval";
import "rxjs/add/observable/timer";
import "rxjs/add/observable/never";
import "rxjs/add/operator/map";
import "rxjs/add/operator/takeUntil";
export declare class RxCountDown {
    private durationMs;
    private endDate;
    private intervalMs;
    private format;
    private remainingTime;
    private timerObservable;
    private onCompleteFn;
    private expired;
    constructor(durationMs?: number, endDate?: string, intervalMs?: number, format?: string);
    private generateTimerObservable();
    private tick();
    private computeRemainingTimeString(remainingTimeMs);
    private computeRemainingTimeMs(targetDate, durationMs);
    private setExpired();
    onComplete(onCompleteFn: () => void): void;
    getRemainingTime(): string;
    isExpired(): boolean;
    subscribe(next?: (value: string) => void, error?: (error: any) => void, complete?: () => void): Subscription;
}
