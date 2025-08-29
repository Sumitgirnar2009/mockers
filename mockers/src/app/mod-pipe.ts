import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mod'
})
export class ModPipe implements PipeTransform {
  transform(value: number, divisor: number): number {
    if (divisor === 0) return value;
    let result = value % divisor;
    return result === 0 ? divisor : result; // So that 50 instead of 0
  }
}
