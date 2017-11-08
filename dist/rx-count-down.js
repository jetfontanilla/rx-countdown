"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/interval");
require("rxjs/add/observable/timer");
require("rxjs/add/observable/never");
require("rxjs/add/operator/map");
require("rxjs/add/operator/finally");
require("rxjs/add/operator/takeUntil");
var RxCountDown = (function () {
    function RxCountDown(durationMs, endDate, intervalMs, format) {
        if (durationMs === void 0) { durationMs = 0; }
        if (endDate === void 0) { endDate = ""; }
        if (intervalMs === void 0) { intervalMs = 1000; }
        if (format === void 0) { format = "mm:ss"; }
        var _this = this;
        this.durationMs = durationMs;
        this.endDate = endDate;
        this.intervalMs = intervalMs;
        this.format = format;
        this.remainingTime = "";
        this.expired = false;
        this.tick();
        if (this.isExpired()) {
            this.timerObservable = Observable_1.Observable.never();
            return;
        }
        this.timerObservable = this.generateTimerObservable();
        this.timerObservable
            .finally(function () {
            _this.complete();
        })
            .subscribe(function () {
            _this.tick();
        });
    }
    RxCountDown.prototype.generateTimerObservable = function () {
        var remainingTimeMs = this.computeRemainingTimeMs(this.endDate, this.durationMs);
        return Observable_1.Observable.interval(this.intervalMs)
            .takeUntil(Observable_1.Observable.timer(remainingTimeMs));
    };
    RxCountDown.prototype.tick = function () {
        var remainingTimeMs = this.computeRemainingTimeMs(this.endDate, this.durationMs);
        this.remainingTime = this.computeRemainingTimeString(remainingTimeMs);
        if (remainingTimeMs <= 0) {
            this.complete();
        }
    };
    RxCountDown.prototype.complete = function () {
        if (this.onCompleteFn) {
            this.onCompleteFn();
        }
        this.setExpired();
    };
    RxCountDown.prototype.computeRemainingTimeString = function (remainingTimeMs) {
        if (remainingTimeMs <= 0) {
            return "";
        }
        return moment(remainingTimeMs).format(this.format);
    };
    RxCountDown.prototype.computeRemainingTimeMs = function (targetDate, durationMs) {
        if (!targetDate && !durationMs) {
            return 0;
        }
        return moment(targetDate).valueOf() - moment().valueOf() + durationMs;
    };
    RxCountDown.prototype.setExpired = function () {
        this.expired = true;
    };
    RxCountDown.prototype.onComplete = function (onCompleteFn) {
        this.onCompleteFn = onCompleteFn;
    };
    RxCountDown.prototype.getRemainingTime = function () {
        return this.remainingTime;
    };
    RxCountDown.prototype.isExpired = function () {
        return this.expired;
    };
    RxCountDown.prototype.subscribe = function (next, error, complete) {
        var _this = this;
        return this.timerObservable
            .map(function () {
            return _this.getRemainingTime();
        })
            .subscribe(next, error, complete);
    };
    return RxCountDown;
}());
exports.RxCountDown = RxCountDown;
//# sourceMappingURL=rx-count-down.js.map