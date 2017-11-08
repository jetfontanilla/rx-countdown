[![npm version](https://badge.fury.io/js/rx-countdown.svg)](https://www.npmjs.com/package/rx-countdown)

# rx-countdown
countdown timer using RxJS Observables

## Usage

using RxCountDown as a state container - if you need to query the internal state of the countdown object at a set interval
```javascript
var RxCountDown = require("rx-countdown");
var intervalId;
var countDown = new RxCountDown(5000); // 5 second timer

countDown.onComplete(function() {
   clearInterval(intervalId);
   console.log("DONE!");
});

// query the current state/value of countdown every second
intervalId = setTimeout(function() {
    console.log(countDown.getRemainingTime());
}, 1000);

/*
    "00:05"
    "00:04"
    "00:03"
    "00:02"
    "00:01"
    "00:00"
    "DONE!"
*/

```

sample angular implementation using the state container approach
```typescript
@Component({
    ...
    template: "<span>{{ getRemainingTime() }}</span>"
})
export class AppComponent {
    private countDown: RxCountDown;
    
    constructor() {
        this.countDown = new RxCountDown(5000);
    }

    getRemainingTime(): string {
        return this.countDown.getRemainingTime();
    }
}

```

Observable approach - whenever the internal state changes, you get notified of the new remaining time value
```javascript
var RxCountDown = require("rx-countdown");
var countDown = new RxCountDown(5000); // 5 second timer

countDown.onComplete(function() {
   console.log("DONE!");
});

// subscribe whenever the internal state of the countdown changes
countDown.subscribe(function(remainingTime) {
    console.log(remainingTime);
});

/*
    "00:05"
    "00:04"
    "00:03"
    "00:02"
    "00:01"
    "00:00"
    "DONE!"
*/

```

## Configuration Options
```
var CountDown = new RxCountDown(durationMs[, endDate[, intervalMs[, format]]]);
```


`durationMs: number` - total duration in milliseconds of countdown timer. additive with the endDate parameter. defaults to 0

`endDate: string` - target end date when you want the countdown timer to end. can be combined with durationMs to extend the countdown.

`intervalMs: number` - duration in milliseconds on how frequently the countdown timer should update

`format: string` - [momentjs format](https://momentjs.com/docs/#/displaying/format/) to change how the output remaining time value is displayed. defaults to `"mm:ss"`


## Available Methods

`onComplete(onCompleteFn: () => void): void;` - onComplete allows the user to pass a function that will be executed when the countdown timer is done

`getRemainingTime(): string;` - returns the current remaining time formatted with the current `format` option

`isExpired(): boolean;` - returns false if the countdown is still active, returns true otherwise

`subscribe(next?: (value: string) => void, error?: (error: any) => void, complete?: () => void): Subscription` - allows subscription to internal changes of the countdown timer. whenever the internal state of the countdown timer changes, it would invoke the `next()` function with the updated remaining time. returns an RxJS `Subscription` 

## TODO
* create plunk for sample usage
* add unit tests