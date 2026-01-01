import { Component, effect, Input, signal, Signal, Output, EventEmitter, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.html',
  styleUrls: ['./timer.css']
})
export class Timer implements OnDestroy {
  @Input() startTime!: Signal<string>;             // From backend — quiz start time
  @Input() currentTimeAtStart!: Date;              // When quiz fully loaded
  @Output() timerEnded = new EventEmitter<void>(); // Emits when time is over

  displayTime = signal('00:00');
  isWarning = signal(false);
  private intervalId: any;

  constructor() {
    effect(() => {
      const time = this.startTime();
      console.log('⏱ Timer received start time:', time);

      if (time && this.currentTimeAtStart) {
        this.startTimer(time, this.currentTimeAtStart);
      }
    });
  }

  private startTimer(startTime: string, currentTimeAtStart: Date) {
    this.stopTimer();

    const startDate = new Date(startTime);
    const nowAtStart = new Date(currentTimeAtStart);

    const totalDuration = 180.4*60; // e.g., 1 hour total quiz duration

    // ✅ Calculate elapsed time till quiz fully loaded
    const elapsedBeforeLoad = Math.floor((nowAtStart.getTime() - startDate.getTime()) / 1000);
    let remainingSeconds = Math.max(0, totalDuration - elapsedBeforeLoad);

    console.log(`⏳ Elapsed before quiz loaded: ${elapsedBeforeLoad}s, Remaining: ${remainingSeconds}s`);

    const updateTimer = () => {
      remainingSeconds = Math.max(0, remainingSeconds - 1);

      this.isWarning.set(remainingSeconds <= 60);
      this.updateDisplay(remainingSeconds);

      if (remainingSeconds <= 0) {
        this.stopTimer();
        this.displayTime.set('00:00');
        this.timerEnded.emit();
      }
    };

    // Start ticking
    updateTimer();
    this.intervalId = setInterval(updateTimer, 1000);
  }

  private updateDisplay(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    this.displayTime.set(`${this.pad(minutes)}:${this.pad(secs)}`);
  }

  private pad(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }

  private stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}
