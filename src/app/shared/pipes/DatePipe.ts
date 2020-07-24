import { Pipe, PipeTransform } from '@angular/core';
import { mesec } from '../../e-shop/model/konstante';

@Pipe({ name: 'datum' })
export class DatePipe implements PipeTransform {
    transform(value: string): string {
        if (!value) {
            value = 'N/A';
        } else {
            const datumNVremeiz = value.split('T');
            const datumNiz = datumNVremeiz[0].split('-');
            datumNiz[1] = mesec['mesec_' + datumNiz[1]];
            value = datumNiz[2] + '-' +  datumNiz[1] + '-' + datumNiz[0] + ' ' + datumNVremeiz[1].substr(0, 5);
        }
        return value;
    }
}
