import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'empty' })
export class EmptyPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) {
            value = 'N/A';
        }
        return value;
    }
}
