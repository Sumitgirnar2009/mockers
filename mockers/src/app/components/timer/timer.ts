import { Component, effect, Input, signal, Signal, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-timer',
  imports: [],
  templateUrl: './timer.html',
  styleUrl: './timer.css'
})
export class Timer implements OnDestroy {
  @Input() startTime!: Signal<string>;
  
  displayTime = signal('00:00');
  private intervalId: any;
  
  constructor() {
    effect(() => {
      const time = this.startTime();
      if (time) {
        console.log("Timer started with time:", time);
        this.startTimer(time);
      }
    });
  }

  private startTimer(startTime: string) {
    this.stopTimer(); // Clear any existing timer
    
    // Parse the ISO string with timezone - this handles Indian timezone correctly
    const startDate = new Date(startTime);
    const totalDuration = 180 * 60; // 180 minutes in seconds

    console.log("Parsed start date:", startDate);
    console.log("Local time:", new Date().toString());

    const updateTimer = () => {
      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - startDate.getTime()) / 1000);
      const remainingSeconds = Math.max(0, totalDuration - elapsedSeconds);
      
      this.updateDisplay(remainingSeconds);

      if (remainingSeconds <= 0) {
        this.stopTimer();
        this.displayTime.set('00:00');
        console.log('Timer completed!');
        // You can emit an event here if needed
        // this.timerComplete.emit();
      }
    };

    // Update immediately and every second
    updateTimer();
    this.intervalId = setInterval(updateTimer, 1000);
  }

  private updateDisplay(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      this.displayTime.set(`${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)}`);
    } else {
      this.displayTime.set(`${this.pad(minutes)}:${this.pad(secs)}`);
    }
  }

  private pad(num: number): string {
    return num < 10 ? `0${num}` : `${num.toString()}`;
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