import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'proizvodnja' })
export class KatalogVreme implements PipeTransform {
    transform(value: string): string {
        if (!value) {
            value = 'N/A';
        } else {
            const godina = value.substr(0, 4);
            const mesec = value.substr(4);
            value = mesec + '-' + godina;
        }
        return value;
    }
}
