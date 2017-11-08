[![npm version](https://badge.fury.io/js/rx-countdown.svg)](https://www.npmjs.com/package/rx-countdown)

# rx-countdown
countdown timer using RxJS Observables

## Usage

using RxCountDown as a state container
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

Observable approach
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

## TODO
* create plunk for sample usage
* add unit tests