import { Component, effect, Input, signal, Signal, Output, EventEmitter, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.html',
  styleUrls: ['./timer.css']
})
export class Timer implements OnDestroy {
  @Input() startTime!: Signal<string>;
  @Output() timerEnded = new EventEmitter<void>(); // Event to notify parent

  displayTime = signal('00:00');
  isWarning = signal(false); // Turns true in last 1 minute
  private intervalId: any;

  constructor() {
    effect(() => {
      const time = this.startTime();
      console.log('Timer received start time:', time);
      if (time) {
        this.startTimer(time);
      }
    });
  }

  private startTimer(startTime: string) {
    this.stopTimer();

    const startDate = new Date(startTime);
    const totalDuration = 1*60; // 1 minute 20 seconds in seconds (for testing)

    const updateTimer = () => {
      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - startDate.getTime()) / 1000);
      const remainingSeconds = Math.max(0, totalDuration - elapsedSeconds);

      // Turn red if last 1 minute
      this.isWarning.set(remainingSeconds <= 60);

      this.updateDisplay(remainingSeconds);

      if (remainingSeconds <= 0) {
        this.stopTimer();
        this.displayTime.set('00:00');
        this.timerEnded.emit(); // Notify parent
      }
    };

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
