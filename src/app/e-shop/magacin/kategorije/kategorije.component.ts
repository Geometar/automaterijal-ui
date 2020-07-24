import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kategorije',
  templateUrl: './kategorije.component.html',
  styleUrls: ['./kategorije.component.scss']
})
export class KategorijeComponent implements OnInit {

  public kategorijeV: KategorijaVraper[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.kategorijaUlja();
    this.unDodaciPumpa();
    this.univerzalno();
    this.odrzavanje();
    this.unutrasnjostVozilaPunjac();
  }

  odrzavanje() {
    const odrzavanjeVraper = new KategorijaVraper();

    const samponi = new Kategorije();
    samponi.naslov = 'Šamponi';
    samponi.slikaId = 'assets/slike/kategorije/shampoo.png';
    samponi.url = 'šamponi';
    odrzavanjeVraper.kategorije.push(samponi);

    const paste = new Kategorije();
    paste.naslov = 'Polir paste';
    paste.slikaId = 'assets/slike/kategorije/polir.png';
    paste.url = 'polir_paste';
    odrzavanjeVraper.kategorije.push(paste);

    const sundjeri = new Kategorije();
    sundjeri.naslov = 'Sundjeri';
    sundjeri.slikaId = 'assets/slike/kategorije/sudnjeri.jpg';
    sundjeri.url = 'sundjeri';
    odrzavanjeVraper.kategorije.push(sundjeri);

    const krpe = new Kategorije();
    krpe.naslov = 'Krpe';
    krpe.slikaId = 'assets/slike/kategorije/krpe.jpg';
    krpe.url = 'krpe';
    odrzavanjeVraper.kategorije.push(krpe);

    const pk = new Kategorije();
    pk.naslov = 'Pokrivači';
    pk.slikaId = 'assets/slike/kategorije/pokrivka.jpg';
    pk.url = 'pokrivači';
    odrzavanjeVraper.kategorije.push(pk);
    odrzavanjeVraper.naslov = 'Održavanje vozila';
    this.kategorijeV.push(odrzavanjeVraper);

  }

  univerzalno() {
    const univerzalno = new KategorijaVraper();

    const aditivi = new Kategorije();
    aditivi.naslov = 'Aditivi';
    aditivi.slikaId = 'assets/slike/kategorije/aditivi.jpg';
    aditivi.url = 'aditivi';
    univerzalno.kategorije.push(aditivi);

    const brisaci = new Kategorije();
    brisaci.naslov = 'Brisači';
    brisaci.slikaId = 'assets/slike/kategorije/brisaci.jpg';
    brisaci.url = 'brisači';
    univerzalno.kategorije.push(brisaci);

    const kozmetika = new Kategorije();
    kozmetika.naslov = 'Kozmetika';
    kozmetika.slikaId = 'assets/slike/kategorije/jelkice.jpg';
    kozmetika.url = 'kozmetika';
    kozmetika.podkategorije = ['JELKICE', 'KONZERVE', 'IGRAČKE'];
    univerzalno.kategorije.push(kozmetika);

    const antifriz = new Kategorije();
    antifriz.naslov = 'Antifriz';
    antifriz.slikaId = 'assets/slike/kategorije/antifriz.jpg';
    antifriz.url = 'antifriz';
    univerzalno.kategorije.push(antifriz);

    const hemija = new Kategorije();
    hemija.naslov = 'Hemija';
    hemija.slikaId = 'assets/slike/kategorije/hemija.jpg';
    hemija.url = 'Hemija';
    univerzalno.kategorije.push(hemija);

    const sijalice = new Kategorije();
    sijalice.naslov = 'Sijalice';
    sijalice.slikaId = 'assets/slike/kategorije/sijalice.jpg';
    sijalice.url = 'SIJALICE';
    univerzalno.kategorije.push(sijalice);

    univerzalno.naslov = 'Univerzalno';
    this.kategorijeV.push(univerzalno);
  }

  unutrasnjostVozilaPunjac() {
    const unutrasnjojstVraper = new KategorijaVraper();
    const patosnice = new Kategorije();
    patosnice.naslov = 'Patosnice';
    patosnice.slikaId = 'assets/slike/kategorije/patosnice.jpg';
    patosnice.url = 'patosnice';
    unutrasnjojstVraper.kategorije.push(patosnice);

    const presvlake = new Kategorije();
    presvlake.naslov = 'Presvlake';
    presvlake.slikaId = 'assets/slike/kategorije/presvlake.jpg';
    presvlake.url = 'presvlake';
    unutrasnjojstVraper.kategorije.push(presvlake);

    const obloge = new Kategorije();
    obloge.naslov = 'Obloge';
    obloge.slikaId = 'assets/slike/kategorije/obloge.jpg';
    obloge.url = 'OBLOGE';
    unutrasnjojstVraper.kategorije.push(obloge);

    const drzac = new Kategorije();
    drzac.naslov = 'Drzac';
    drzac.slikaId = 'assets/slike/kategorije/drzac.jpg';
    drzac.url = 'drzac';
    unutrasnjojstVraper.kategorije.push(drzac);

    const punajc = new Kategorije();
    punajc.naslov = 'Punjaci';
    punajc.slikaId = 'assets/slike/kategorije/punjac.jpg';
    punajc.url = 'punjaci';
    unutrasnjojstVraper.kategorije.push(punajc);

    const jastuci = new Kategorije();
    jastuci.naslov = 'Jastuci';
    jastuci.slikaId = 'assets/slike/kategorije/jastuci.jpg';
    jastuci.url = 'jastuci';
    unutrasnjojstVraper.kategorije.push(jastuci);

    const pOgledala = new Kategorije();
    pOgledala.naslov = 'Pomoćna ogledala';
    pOgledala.slikaId = 'assets/slike/kategorije/ogledala.jpg';
    pOgledala.url = 'pomoćna_ogledala';
    unutrasnjojstVraper.kategorije.push(pOgledala);


    const orkGepek = new Kategorije();
    orkGepek.naslov = 'Pregrade za gepek';
    orkGepek.slikaId = 'assets/slike/kategorije/o-gepek.jpg';
    orkGepek.url = 'organizatori_za_gepek';
    unutrasnjojstVraper.kategorije.push(orkGepek);

    const univerzalno = new Kategorije();
    univerzalno.naslov = 'Univerzalno';
    univerzalno.slikaId = 'assets/slike/kategorije/univerzalno.jpg';
    univerzalno.url = 'univerzalno';
    unutrasnjojstVraper.kategorije.push(univerzalno);

    unutrasnjojstVraper.naslov = 'Dodaci za enterijer';
    this.kategorijeV.push(unutrasnjojstVraper);
  }

  unDodaciPumpa() {
    const unDodaci = new KategorijaVraper();

    const kNosaci = new Kategorije();
    kNosaci.naslov = 'Krovni nosači';
    kNosaci.slikaId = 'assets/slike/kategorije/k-nosac.jpg';
    kNosaci.url = 'krovni_nosači';
    unDodaci.kategorije.push(kNosaci);

    const pumpe = new Kategorije();
    pumpe.naslov = 'Pumpe za gume';
    pumpe.slikaId = 'assets/slike/kategorije/p-guna.jpg';
    pumpe.url = 'pumpe_za_gume';
    pumpe.podkategorije = [
      'Električna pumpa',
      'Nožna pumpa'];
    unDodaci.kategorije.push(pumpe);

    const reparacija = new Kategorije();
    reparacija.naslov = 'Reparacije gume';
    reparacija.slikaId = 'assets/slike/kategorije/rep-gume.jpg';
    reparacija.url = 'reparacija_gume';
    unDodaci.kategorije.push(reparacija);

    const oTereta = new Kategorije();
    oTereta.naslov = 'Španer za teret';
    oTereta.slikaId = 'assets/slike/kategorije/s-teret.jpg';
    oTereta.url = 'španer_za_osiguravanje_tereta';
    unDodaci.kategorije.push(oTereta);

    const levak = new Kategorije();
    levak.naslov = 'Levak';
    levak.slikaId = 'assets/slike/kategorije/levak.jpeg';
    levak.url = 'levak';
    unDodaci.kategorije.push(levak);

    const kantice = new Kategorije();
    kantice.naslov = 'Kantice';
    kantice.slikaId = 'assets/slike/kategorije/kantice.jpg';
    kantice.url = 'kantica';
    unDodaci.kategorije.push(kantice);

    const traka = new Kategorije();
    traka.naslov = 'Traka za vuču';
    traka.slikaId = 'assets/slike/kategorije/t-vuca.jpg';
    traka.url = 'TRAKE_ZA_VUČU';
    unDodaci.kategorije.push(traka);

    unDodaci.naslov = 'Dodatna oprema';
    this.kategorijeV.push(unDodaci);
  }

  kategorijaUlja() {
    const uljaVraper = new KategorijaVraper();
    const motornaUlja = new Kategorije();
    motornaUlja.naslov = 'Motorna ulja';
    motornaUlja.slikaId = 'assets/slike/kategorije/m-ulje.jpg';
    motornaUlja.url = 'motorna_ulja';
    uljaVraper.kategorije.push(motornaUlja);

    const menjackoUlje = new Kategorije();
    menjackoUlje.naslov = 'Menjačko ulje';
    menjackoUlje.slikaId = 'assets/slike/kategorije/menjacko-ulje.png';
    menjackoUlje.url = 'menjacka_ulja';
    uljaVraper.kategorije.push(menjackoUlje);

    const antifrim = new Kategorije();
    antifrim.naslov = 'Antifriz';
    antifrim.slikaId = 'assets/slike/kategorije/a-ulje.jpg';
    antifrim.url = 'antifriz';
    uljaVraper.kategorije.push(antifrim);

    const kocionoUlje = new Kategorije();
    kocionoUlje.naslov = 'Kociono ulje';
    kocionoUlje.slikaId = 'assets/slike/kategorije/k-ulje.jpg';
    kocionoUlje.url = 'kociono_ulje';
    uljaVraper.kategorije.push(kocionoUlje);

    const motocikliUlje = new Kategorije();
    motocikliUlje.naslov = 'Dvotaktol ulje';
    motocikliUlje.slikaId = 'assets/slike/kategorije/d-ulje.jpg';
    motocikliUlje.url = 'dvotaktol';
    uljaVraper.kategorije.push(motocikliUlje);

    const industrijskaUlja = new Kategorije();
    industrijskaUlja.naslov = 'Industrijska ulja';
    industrijskaUlja.slikaId = 'assets/slike/kategorije/i-ulje.jpg';
    industrijskaUlja.url = 'industrijska_ulja';
    industrijskaUlja.podkategorije = [
      'Hidraulično ulje',
      'Kompresorsko ulje',
      'Reduktorsko ulje',
      'Transformatorsko ulje',
      'Turbinska ulja',
      'Ulja za pneumatske alate',
      'Ulja za klizne staze',
      'Ulja za prenos toplote'];
    uljaVraper.kategorije.push(industrijskaUlja);

    const oMetala = new Kategorije();
    oMetala.naslov = 'Obrada metala';
    oMetala.slikaId = 'assets/slike/kategorije/o-metala.jpg';
    oMetala.url = 'obrada_metala';
    oMetala.podkategorije = [
      'ANTIKOROZIONA ZAŠTITA',
      'EMULZIJE I RASTVORI',
      'REZNO ULJE',
      'SREDSTVA ZA ČIŠĆENJE I ODMAŠĆIVANJE',
      'ULJE ZA OBRADU DEFORMACIJOM',
      'ULJE ZA ELEKTROEROZIJU',
      'ULJE ZA TERMIČKU OBRADU'];
    uljaVraper.kategorije.push(oMetala);

    uljaVraper.naslov = 'Maziva';
    this.kategorijeV.push(uljaVraper);
  }

  izabranaPodKategorija(kategorija: Kategorije, podkategorija: string) {
    const url = '/kategorije/' + kategorija.url;
    const prethodniUrl = this.router.parseUrl(this.router.url);
    this.router.navigate([url], { queryParams: { grupa: podkategorija, prosliUrl: prethodniUrl.root.children.primary.segments[0].path } });
  }

}

class KategorijaVraper {
  kategorije?: Kategorije[] = [];
  naslov?: string;
  KategorijaVraper() {
  }
}

class Kategorije {
  slikaId?: string;
  naslov?: string;
  url?: string;
  podkategorije?: string[];
}
