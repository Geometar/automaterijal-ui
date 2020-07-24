export class Kategorija {
    ikonaId?: string;
    naslov?: string;
    url?: string;
    param?: string;
}

export class Brend {
    urlSlikeLogo?: string;
    urlSlikePozadina?: string;
    url?: string;
    ime?: string;
    opis?: string;
}

export class Konastante {
    kategorije: Kategorija[] = [];
    grupe: Kategorija[] = [];
    brendovi: Brend[] = [];
    constructor() {
        const maziva = new Kategorija();
        maziva.ikonaId = 'list';
        maziva.url = '/kategorije/maziva';
        maziva.naslov = 'Maziva';
        this.kategorije.push(maziva);

        const filteri = new Kategorija();
        filteri.ikonaId = 'list';
        filteri.url = '/kategorije/filteri';
        filteri.naslov = 'Filteri';
        this.kategorije.push(filteri);

        const oVozila = new Kategorija();
        oVozila.ikonaId = 'list';
        oVozila.url = '/kategorije/održavanje_vozila';
        oVozila.naslov = 'Održavanje vozila';
        this.kategorije.push(oVozila);

        const komzetika = new Kategorija();
        komzetika.ikonaId = 'list';
        komzetika.url = '/kategorije/kozmetika';
        komzetika.naslov = 'Kozmetika';
        this.kategorije.push(komzetika);

        const aditivi = new Kategorija();
        aditivi.ikonaId = 'list';
        aditivi.url = '/kategorije/aditivi';
        aditivi.naslov = 'Aditivi';
        this.kategorije.push(aditivi);


        const elektrika = new Kategorija();
        elektrika.ikonaId = 'list';
        elektrika.url = '/kategorije/elektrika';
        elektrika.naslov = 'Elektrika';
        this.kategorije.push(elektrika);

        const uVozila = new Kategorija();
        uVozila.ikonaId = 'list';
        uVozila.url = '/kategorije/unutrašnjost_vozila';
        uVozila.naslov = 'Unutrašnjost vozila';
        this.kategorije.push(uVozila);

        const hemija = new Kategorija();
        hemija.ikonaId = 'list';
        hemija.url = '/kategorije/hemija';
        hemija.naslov = 'Hemija';
        this.kategorije.push(hemija);

        const pumpeZaGume = new Kategorija();
        pumpeZaGume.ikonaId = 'list';
        pumpeZaGume.url = '/kategorije/pumpe_za_gume';
        pumpeZaGume.naslov = 'Pumpe za gume';
        this.kategorije.push(pumpeZaGume);

        const iUlja = new Kategorija();
        iUlja.ikonaId = 'list';
        iUlja.url = '/kategorije/industrijska_ulja';
        iUlja.naslov = 'Industrijska ulja';
        this.kategorije.push(iUlja);

        ///////////////////////
        const mUlja = new Kategorija();
        mUlja.ikonaId = 'label';
        mUlja.url = '/kategorije/MOTORNA_ULJA';
        mUlja.naslov = 'Motorna ulja';
        this.grupe.push(mUlja);

        const kUlje = new Kategorija();
        kUlje.ikonaId = 'label';
        kUlje.url = '/kategorije/KOCIONO_ULJE';
        kUlje.naslov = 'Kočiono ulje';
        this.grupe.push(kUlje);

        const dvotaktol = new Kategorija();
        dvotaktol.ikonaId = 'label';
        dvotaktol.url = '/kategorije/DVOTAKTOL';
        dvotaktol.naslov = 'Dvotaktol';
        this.grupe.push(dvotaktol);

        const pPaste = new Kategorija();
        pPaste.ikonaId = 'label';
        pPaste.url = '/kategorije/POLIR_PASTE';
        pPaste.naslov = 'Polir paste';
        this.grupe.push(pPaste);

        const akumulatori = new Kategorija();
        akumulatori.ikonaId = 'label';
        akumulatori.url = '/kategorije/AKUMULATORI';
        akumulatori.naslov = 'Akumulatori';
        this.grupe.push(akumulatori);

        const sijalice = new Kategorija();
        sijalice.ikonaId = 'label';
        sijalice.url = '/kategorije/SIJALICE';
        sijalice.naslov = 'Sijalice';
        this.grupe.push(sijalice);

        const patosnice = new Kategorija();
        patosnice.ikonaId = 'label';
        patosnice.url = '/kategorije/PATOSNICE';
        patosnice.naslov = 'Patosnice';
        this.grupe.push(patosnice);

        const pTelefon = new Kategorija();
        pTelefon.ikonaId = 'label';
        pTelefon.url = '/kategorije/PUNJACI';
        pTelefon.naslov = 'Punjači za telefon';
        this.grupe.push(pTelefon);

        const brisači = new Kategorija();
        brisači.ikonaId = 'label';
        brisači.url = '/kategorije/BRISAČI';
        brisači.naslov = 'Brisači';
        this.grupe.push(brisači);

        const jelkice = new Kategorija();
        jelkice.ikonaId = 'label';
        jelkice.url = '/kategorije/JELKICE';
        jelkice.naslov = 'Jelkice';
        this.grupe.push(jelkice);

        ///////////////////////
        const slikeLogo = 'assets/slike/brendovi/logo/';
        const slikePozadine = 'assets/slike/brendovi/pagepaper/';
        const txtUrl = 'assets/html/brand/';
        const febi = new Brend();
        febi.ime = 'Febi';
        febi.url = txtUrl + 'febi.txt';
        febi.urlSlikeLogo = slikeLogo + 'febi.png';
        febi.urlSlikePozadina = slikePozadine + 'febi.png';
        this.brendovi.push(febi);

        const shell = new Brend();
        shell.ime = 'Shell';
        shell.url = txtUrl + 'shell.txt';
        shell.urlSlikeLogo = slikeLogo + 'shell.png';
        shell.urlSlikePozadina = slikePozadine + 'shell.png';
        this.brendovi.push(shell);

        const mahle = new Brend();
        mahle.ime = 'Mahle';
        mahle.url = txtUrl + 'mahle.txt';
        mahle.urlSlikeLogo = slikeLogo + 'mahle.png';
        mahle.urlSlikePozadina = slikePozadine + 'mahle.png';
        this.brendovi.push(mahle);

        const vr = new Brend();
        vr.ime = 'Victor Reinz';
        vr.url = txtUrl + 'vr.txt';
        vr.urlSlikeLogo = slikeLogo + 'vik.png';
        vr.urlSlikePozadina = slikePozadine + 'victor-reinz.png';
        this.brendovi.push(vr);

        const pier = new Brend();
        pier.ime = 'Motor Service';
        pier.url = txtUrl + 'pier.txt';
        pier.urlSlikeLogo = slikeLogo + 'pirb.png';
        pier.urlSlikePozadina = slikePozadine + 'pb.png';
        this.brendovi.push(pier);

        const bottari = new Brend();
        bottari.ime = 'Bottari';
        bottari.url = txtUrl + 'bottari.txt';
        bottari.urlSlikeLogo = slikeLogo + 'bottari.png';
        bottari.urlSlikePozadina = slikePozadine + 'bottari.png';
        this.brendovi.push(bottari);

        const bp = new Brend();
        bp.ime = 'Blue Print';
        bp.url = txtUrl + 'bp.txt';
        bp.urlSlikeLogo = slikeLogo + 'bp.png';
        bp.urlSlikePozadina = slikePozadine + 'blueprint.png';
        this.brendovi.push(bp);

        const wix = new Brend();
        wix.ime = 'Wix';
        wix.url = txtUrl + 'wix.txt';
        wix.urlSlikeLogo = slikeLogo + 'wix.png';
        wix.urlSlikePozadina = slikePozadine + 'wix.jpg';
        this.brendovi.push(wix);
    }
}
