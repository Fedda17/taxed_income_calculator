export default function calculate_taxed_income(ral_lorda){
    let tax_imports = {}
    const imp_fiscale = ral_lorda - apply_inps(ral_lorda, tax_imports);
    const irpef_netta = apply_irpef(imp_fiscale, tax_imports);
    return [(imp_fiscale - irpef_netta - apply_addizionali(imp_fiscale, tax_imports)), tax_imports];
}

function apply_inps(ral, taxes){
    //Contributi del dipendente 9.19% per 2026
    //https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2023.10.circolare-numero-88-del-31-10-2023_14306.html
    const tax_import = (ral * 9.19) / 100;
    taxes.inps = tax_import;
    return tax_import;
}

function apply_irpef(imp_fiscale, taxes){
    /* Applicare tassazione graduale in base al reddito:
        Prima ricavo l'ammontare tassato, poi sottraggo l'ammontare con il risultato della formula detrazioni
        https://www.agenziaentrate.gov.it/portale/imposta-sul-reddito-delle-persone-fisiche-irpef-/aliquote-e-calcolo-dell-irpef
    */
    
    let tax_import = 0;
    if (imp_fiscale <= 28000){
        tax_import = imp_fiscale * 23 / 100;
    }
    else if (imp_fiscale > 28000 && imp_fiscale <= 50000){
        // ridotto a 33% con articolo 1, commi 3 e 4, legge n. 199/2025 di legge di bilancio
        tax_import = 6440 + (imp_fiscale - 28000) * 33 / 100;
    }
    else if (imp_fiscale > 50000){
        tax_import = 13700 + (imp_fiscale - 50000) * 43 / 100;
    }

    tax_import -= apply_detrazioni(imp_fiscale);
    
    //La somma non può essere negativa dopo le detrazioni
    tax_import = Math.max(0, tax_import);
    taxes.irpef = tax_import;
    return tax_import;
}

function apply_detrazioni(reddito){
    /* Schema dato da https://www.agenziaentrate.gov.it/portale/documents/20143/8410823/Circolare+lavoro+dipendente+LB2025+DD+IRPEF+n.+4+del+16+maggio+2025.pdf/36979eaa-9fc5-a4ec-a7aa-136497c53f91
    funziona a passi come gli scaglioni, ma con determinate formule
    */
   let detrazione = 0;
   if (reddito <= 15000){
    // Assumiamo che sia a contratto indeterminato
    detrazione = 1955;
   }else if(reddito > 15000 && reddito <= 28000){
    detrazione = 1910 + 1190 * ((28000 - reddito) / 13000);
   }else if(reddito > 28000 && reddito <= 50000){
    detrazione = 1910 * ((50000 - reddito) / 22000);
   }
   // C'è un'altra detrazione a 200.000 euro ma viene applicata solo se i benefici superano il 19% delle detrazioni, prototipo non considera benefici
   return detrazione;
}

function apply_addizionali(reddito, taxes){
    //Supponiamo Lombardia per regionale, è a scaglioni, seguo questo schema https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/addregirpef/addregirpef.php?reg=10
    let regional_tax = 0;
   if (reddito <= 15000){
    regional_tax = reddito * 1.23 / 100;
   }else if(reddito > 15000 && reddito <= 28000){
    regional_tax = 184.50 + ((reddito - 15000) * 1.58 / 100);
   }else if(reddito > 28000 && reddito <= 50000){
    regional_tax = 389.90 + ((reddito - 28000) * 1.72 / 100);
   }else{
    regional_tax = 768.30 + ((reddito - 50000) * 1.73 / 100);
   }
    //Supponiamo Milano come comunale che è il 0.8 dell'imponibile fiscale ora, fonte: https://www.comune.milano.it/argomenti/tributi/addizionale-comunale-irpef
    const comunal_tax = reddito * 0.8 / 100;
    taxes.add_reg = regional_tax;
    taxes.add_com = comunal_tax;
    return regional_tax + comunal_tax;
}