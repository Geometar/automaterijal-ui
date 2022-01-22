import { Page } from "src/app/e-shop/model/page";

export class IzvestajPage extends Page {
    content: Izvestaj[] = null;
}

export class Izvestaj {
    firmaDto?: Firma;
    komentarDto?: Komentar;
}

export class Firma {
    id?: number;
    mesto?: string;
    ime?: string;
    adresa?: string;
    kontakt?: string;
    sektor?: string;
    osnovniAsortiman?: string;
    konkurent?: string;
    ppid?: number;
}

export class Komentar {
    id?: number;
    komentar?: string;
    firma?: number;
    datumKreiranja?: Date;
    podsetnik?: string;
    ppid?: number;
    komercijalista?: string;
}

export class KreirajIzvestaj {
    firmaId?: number;
    ime?: string;
    mesto?: string;
    adresa?: string;
    kontakt?: string;
    sektor?: string;
    osnovniAsortiman?: string;
    konkurent?: string;
    komentar?: string;
    datumKreiranja?: number;
    podsetnik?: number;
}