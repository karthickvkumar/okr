import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'format'
})
export class FormatPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): string {
    return moment(value.end).format("DD MMMM");
  }

}
