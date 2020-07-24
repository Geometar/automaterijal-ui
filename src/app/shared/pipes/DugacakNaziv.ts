import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dugacakNaziv' })
export class DugacakNaziv implements PipeTransform {
    transform(value: string): string {
        if (!value) {
            value = 'N/A';
        } else {
            if (value.length > 18) {
                value = value.substring(0, 21) + '...';
            }
        }
        return value;
    }
}
