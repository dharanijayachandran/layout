import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hyphen'
})
export class HyphenPipe implements PipeTransform {

  public transform(value: string): string {
    return (value) ? value : ('-');
  }

}
