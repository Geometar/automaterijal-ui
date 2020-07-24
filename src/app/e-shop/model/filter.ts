export class Filter {
    proizvodjacId?: string;
    proizvodjac?: string;
    raspolozivost?: string;
    naStanju?: boolean;
    grupa?: string;
    pretrazitiGrupe?: boolean;

    Filter() {
        this.proizvodjac = '';
        this.raspolozivost = 'Svi artikli';
    }
}
