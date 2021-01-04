export enum SVMap {
  VORGANGSTATUS = 100,                      // VORGANG: Status des Vorgangs
  VORGANGART = 101,                         // VORGANG: Art des Vorgangs

  ADRESSART = 200,                          // PERSON: Adresstypen
  KUNDENART = 201,                          // PERSON: Kundenarten
  GESCHLECHT = 202,                         // PERSON: Geschlechter
  ADELSTITEL = 204,                         // PERSON: Adelstitel
  GESCHAEFTSFAEHIGKEIT,               // PERSON: Geschäftsfähigkeit
  BRANCHE = 207,                            // PERSON: Branchen
  RECHTSFORM,                         // PERSON: Rechtformen
  GUETERSTAND,                        // PERSON: Güterstand
  GEMEINSCHAFTSKONTO,                 // PERSON: Gemeinschaftskonto
  LEGALFORM,                          // PERSON: Legalform
  URKUNDE,                            // PERSON: Urkunden
  NATIONALIDTYP,                      // PERSON: National-ID Typen
  FILIALE,                            // PERSON: Filialen
  PRIMAERBETREUUNG,                   // PERSON: Primärbetreuung
  PRIVAT_FIRMA,                       // PERSON: Privat/Firma
  MOTIV_BEGINN_GB,                    // PERSON: Motiv Beginn GB
  SEGMENT,                            // PERSON: Segmente
  INFO_EINLAGENSICHERUNG,             // PERSON: Info Einlagensicherung
  ANALYSE	,                           // PERSON: Analyse
  JUGENDSCHUTZ = 221,                       // PERSON: Jugendschutz
  MITBETREUUNG,                       // PERSON: Mitbetreuung
  SPEZIALBETREUUNG,                   // PERSON: Spezialbetreuung
  VORSTANDSBETREUUNG = 224,                 // PERSON: Vorstandsbetreuung
  HANDWERK,                           // PERSON: Handwerk
  ABC_ANALYSE,                        // PERSON: ABC-Analyse
  UMSATZSTEUER,                       // PERSON: Umsatzsteuer
  BRIEFANREDE,                        // PERSON: Briefanreden
  EZB_FAEHIGKEIT,                     // PERSON: EZB-Fähigkeit
  BONITAET,                           // PERSON: Bonität
  ORGANSCHAFT,                        // PERSON: Organschaft
  VERBUNDENE_UNTERNEHMEN,             // PERSON: Verbundene Unternehmen
  DATENSCHUTZ,                        // PERSON: Datenschutz
  STEUER_IN_AUSLAND,                  // PERSON: Steuer in AUsland
  MITINHABER,                         // PERSON: Mitinhaber

  KONTAKTTYP	 = 250,                       // KONTAKT: Kontakttypen

  ANSCHRIFTTYP = 260,                       // ANSCHRIFT: Anschrifttypen
  ANREDE = 261,                             // PERSON: Anredekennzeichen
  LAND = 262,                               // PERSON: Länder
  POSTVERMERK	= 263,                        // ANSCHRIFT: Postvermerke
  VERSANDART	,                       // ANSCHRIFT: Versandarten
  ABHOLSTELLE	,                       // ANSCHRIFT: Abholstellen
  STATUS	,                           // ANSCHRIFT: Status der Anschrift
  SPERRE	,                           // ANSCHRIFT + ADRESSE: Sperrkennzeichen
  ADRESSTYP = 268,                          // ANSCHRIFT: Adresstyp

  PERSONZUORDNUNGTYP = 280,                 // PERSONZUORDNUNG: Adresszuordnungstypen
  WAEHRUNG,                           // Währung

  KONTO_PRODUKTART	= 300,                  // KONTO: Produktart
  KONTO_GESCHAEFTSART,                // KONTO: Geschäftsart
  KONTO_ZUSATZBEZEICHNUNG_KZ,         // KONTO: Zusatzbezeichnung Kennzeichen
  KONTO_VERFUEGUNGSREGEL,             // KONTO: Verfügungsregel
  KONTO_FORMALITAETEN,                // KONTO: Formalitäten
  KONTO_ELECTRONICBANKING,            // KONTO: Electronic Banking
  KONTO_INTERNESKONTO_KZ,             // KONTO: Internes Konto
  KONTO_EBBENUTZER,                   // KONTO: EB-Benutzer
  KONTO_WIRTSCHAFTLICHBERECHTIGTER,   // KONTO: Wirtschaftlich Berechtigter
  KONTO_PRODUKTGRUPPE,                // KONTO: Produktgruppe
  KONTO_BILANZSCHLUESSEL,             // KONTO: Bilanzschlüssel
  KONTO_ZUSATZTEXT,                   // KONTO: Zusatztext
  KONTO_VKG,                          // KONTO: VKG
  KONTO_AUSZUGSDRUCK,                 // KONTO: Auszugsdruck
  KONTO_FILIALEKONTO,                 // KONTO: Filiale Konto
  KONTO_ZWEIGSTELLE,                  // KONTO: Zweigstelle
  KONTO_VERSANDTERMIN,                // KONTO: Versandtermin
  KONTO_BELEGDRUCK,                   // KONTO: Belegdruck
  KONTO_KONDITIONSAENDERUNG_MIT,      // KONTO: Konditionsänderung
  KONTO_UMSATZSTEUER,                 // KONTO: Umsatzsteuer
  KONTO_STEUERUNG_ADRESSE_MITTEILUNG,       // KONTO: Steuerung Adresse Mitteilung
  KONTO_STEUERUNG_ERSTELLUNG_MITTEILUNG,    // KONTO: Steuerung Erstellung Mitteilung
  KONTO_STEUERUNG_VERSANDTERMIN_MITTEILUNG, // KONTO: Steuerung Versandtermin Mitteilung
  KONTO_BONITAET1,                    // KONTO: Bonität 1
  KONTO_BONITAET2,                    // KONTO: Bonität 2
  KONTO_BONITAET3,                    // KONTO: Bonität 3
  KONTO_BONITAET4,                    // KONTO: Bonität 4
  KONTO_BONITAET5,                    // KONTO: Bonität 5
  KONTO_KLASSIFIZIERUNG,              // KONTO: Klassifizierung
  KONTO_EIGENFREMD_RECHNUNG,          // KONTO: Eigen/Fremd Rechnung
  KONTO_UMSATZ_SOLLHABEN,             // KONTO: Umsatz Soll/Haben
  KONTO_KONDITIONSSCHLUESSEL,         // KONTO: Konditionsschlüssel
  KONTO_ABRECHNUNG_KAPITAL,           // KONTO: Abrechnung Kapital
  KONTO_ABRECHNUNG_ZINS,              // KONTO: Abrechnung Zins
  KONTO_ZINSRECHNUNG_ART,             // KONTO: Art der zinsrechnung
  KONTO_KONDITION_ART,                // KONTO: Konditionsart
  KONTO_ZINSMODUS,                    // KONTO: Zinsmodus

  KARTE_TYP = 350,                          // KARTE: Kartentyp
  KARTE_ART,                          // KARTE: Art der Karte
  KARTE_ABHOLSTELLE,                  // KARTE: Abholstelle
  KARTE_VERWALTUNG,                   // KARTE: Kartenverwaltung

  DISPO_GRUND = 360,                        // DISPO: Grund

  DAUERAUFTRAG_AUFTRAGSART = 370,           // DAUERAUFTRAG: Auftragsart
  DAUERAUFTRAG_MODUS,                 // DAUERAUFTRAG: Modus

  VOLLMACHT_UMFANG = 420,                   // VOLLMACHT: Umfang der Vollmacht
  VOLLMACHT_ART,                      // VOLLMACHT: Art der Vollmacht
  VOLLMACHT_FUNKTION,                 // VOLLMACHT: Funktion der Vollmacht
  VOLLMACHT_ZEICHNUNGSBERECHTIGUNG,   // VOLLMACHT: Zeichnungsberechtigung

  RATING_KONTOFUEHRUNG = 450,               // RATING: Kontoführung
  RATING_KREDITVERHALTEN,             // RATING: Kreditverhalten
  RATING_EINKOMMEN,                   // RATING: Einkommen
  RATING_KURZLEBIGEKREDITE,           // RATING: Kurzlebige Kredite
  RATING_LIQUIDEMITTEL,               // RATING: Liquide Mittel
  RATING_ERGEBNIS,                    // RATING: Ratingergebnis

  SELBSTAUSKUNFT_BERUF = 500,               // SELBSTAUSKUNFT: Beruf

  FORMULAR_ART = 510,                       // FORMULAR: Formularart
  FORMULAR_PAPIERART,                 // FORMULAR: Papierart
  FORMULAR_AUSFERTIGUNG,              // FORMULAR: Ausfertigung

  LOGBUCH_AKTION = 600,                     // LOGBUCH: Aktion

  NOTIZ_TYP = 610,                          // NOTIZ: Typ
  NOTIZ_ART,                          // NOTIZ: Art
  NOTIZ_PRIORITAET,                   // NOTIZ: Priorität

  KONDITION_KONDITIONSART = 650,            // KONDITION: Konditionsart
  KONDITION_SCHLUESSEL_SOLLZINS,      // KONDITION: Sollzins
  KONDITION_SCHLUESSEL_UEBERZIEHUNGSZINS, // KONDITION: Überziehungszins
  KONDITION_SCHLUESSEL_HABENZINS,     // KONDITION: Habenzins
  KONDITION_PROVISION_GRUNDSERVICE,   // KONDITION: Provision-Grundservice
  KONDITION_BUCHUNGSPOSTEN,           // KONDITION: Buchungsposten
  KONDITION_PORTO_AUSZUEGE,           // KONDITION: Porto Auszüge
  KONDITION_PROVISION_BEREITSTELLUNG, // KONDITION: Bereitstellungsprovision
  KONDITION_STAFFELDRUCK,             // KONDITION: Staffeldruck
  KONDITION_ABRECHNUNG,               // KONDITION: Abrechnung
  KONDITION_ABRECHNUNGSZEITRAUM,      // KONDITION: Abrechnungszeitraum
  KONDITION_ABRECHNUNGSART,           // KONDITION: Abrechnungsart
  KONDITION_ZINSRECHNUNGSART,         // KONDITION: Zinsrechnungsart
  KONDITION_KONVERTIERUNGSART,        // KONDITION: Konvertierungsart
  KONDITION_SPANNART_KONVERTIERUNG,   // KONDITION: Spannart-Konvertierung
  KONDITION_KOMPENSATIONSART,         // KONDITION: Kompensationsart

}

