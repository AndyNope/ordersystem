import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'space'
})
export class SpacePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value.replace('CHF', 'CHF ');
}

}