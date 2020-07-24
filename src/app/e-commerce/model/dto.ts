export class Poruka {
    ime?: string;
    prezime?: string;
    firma?: string;
    telefon?: string;
    posta?: string;
    poruka?: string;
}

export class Upit {
    emailTelefon?: string;
    markaModel?: string;
    godiste?: string;
    kubikaza?: string;
    kilovati?: string;
    gorivo?: any;
    pogon?: any;
    interesujeMe?: any;
    drugo?: string;
}


export class VestiNaslovna {
    id?: string;
    naslov?: string;
    opis?: string;
    opisSlika?: string;
    slika?: string;
    vest?: string;
}

export class Vest {
    id?: string;
    naslov?: string;
    slika?: string;
    tekst?: string;
}
