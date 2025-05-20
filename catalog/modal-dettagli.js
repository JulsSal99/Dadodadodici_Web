async function mostraDettagli(Id) {
    const record = await genericCaricaGioco(Id);
    if (!record || !record.success || !record.record) {
        mostraMessaggioErrore("Errore: dati del gioco non disponibili.");
        return;
    }

    const contenuto = document.getElementById("contenuto-modale");
    const gioco = record.record; // estrai l'oggetto effettivo

    document.getElementById("modaleDettagliLabel").textContent = `Dettagli: ${gioco.Titolo} (${gioco.Autore})`;

    contenuto.innerHTML = `
      <form id="formDettagli">
        ${creaInput("Note", "Note", gioco.Note)}
        ${creaInput("Tag Tipologia", "Titolo", gioco.Titolo)}
        ${creaInput("Autore", "Autore", gioco.Autore)}
        ${creaInput("Tipologia", "Tipologia", gioco.Tipologia)}
        ${creaInput("Difficolta", "Difficolta", gioco.Difficolta)}
        ${creaInput("Fascia Età", "FasciaEta", gioco.FasciaEta)}
        ${creaCheckbox("Consigliato", "Consigliato", gioco.Consigliato)}
        ${creaCheckbox("Esplicito", "Esplicito", gioco.Esplicito)}
        <div class="mt-3 d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-warning" id="modificaBtn">Modifica</button>
          <button type="button" class="btn btn-sm btn-danger" id="eliminaBtn">Elimina</button>
          <button type="button" class="btn btn-success d-none" id="salvaBtn">Salva</button>
        </div>
      </form>
    `;

    const form = contenuto.querySelector("#formDettagli");
    const modificaBtn = form.querySelector("#modificaBtn");
    const salvaBtn = form.querySelector("#salvaBtn");
    const eliminaBtn = form.querySelector("#eliminaBtn");

    modificaBtn.addEventListener("click", () => {
        form.querySelectorAll("input").forEach(input => input.disabled = false);
        modificaBtn.classList.add("d-none");
        salvaBtn.classList.remove("d-none");
    });

    eliminaBtn.addEventListener("click", async () => {
        setLoading(true, "Sterminando i dalek..");
        await elimina(gioco.Id); // Id corretto
        setLoading(false);
    });

    salvaBtn.addEventListener("click", async () => {
        setLoading(true, "Salvando la principessa..");
        await salva(gioco); // aggiorna con i nuovi valori se necessario
        setLoading(false);
    });

    new bootstrap.Modal(document.getElementById('modaleDettagli')).show();
}


/**
 * @description carica i dati di un gioco singolo
 */
async function genericCaricaGioco(id) {
    setLoading(true, "Verso il castello..");
    try {
        const url = `${API_URL}?action=ottieniGioco&IdGioco=${encodeURIComponent(id)}`;
        const res = await fetch(url, { method: "GET" }); // Google Apps Script accetta solo GET
        if (!res.ok) throw new Error("Errore risposta");
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Errore durante il caricamento dati:", res);
        if (typeof mostraMessaggioErrore === "function") {
            mostraMessaggioErrore("Errore: impossibile contattare il server. Riprova più tardi.");
        }
        return null;
    } finally {
      setLoading(false);
    }
}

async function salva(id) {
    const aggiornato = {
        Id: record.Id,
        Note: form.Note.value,
        Titolo: form.Titolo.value,
        Autore: form.Autore.value,
        Tipologia: form.Tipologia.value,
        Difficolta: form.Difficolta.value,
        FasciaEta: form.FasciaEta.value,
        Consigliato: form.Consigliato.checked,
        Esplicito: form.Esplicito.checked
    };

    try {
        await fetch(`${API_URL}?riga=${record.riga}`, {
            method: "PUT",
            body: JSON.stringify(aggiornato)
        });
        const modalEl = bootstrap.Modal.getInstance(document.getElementById('modaleDettagli'));
        modalEl.hide();
        caricaDati(); // Ricarica i dati in tabella
    } catch (error) {
        mostraMessaggioErrore("Errore durante il salvataggio.");
    };
}

async function elimina(id) {
    if (!confirm("Sei sicuro di voler eliminare questa riga?")) return;
    try {
        const url = `${API_URL}?action=cancellaGioco&Id=${encodeURIComponent(id)}`;
        console.log(url);
        const res = await fetch(url, { method: "GET" }); // Google Apps Script accetta solo GET
        const text = await res.text();
        console.log("Risposta eliminazione:", text);
        caricaDati();
    } catch (error) {
        console.error(error);
        mostraMessaggioErrore("Errore durante l'eliminazione.");
    }
}

function creaInput(label, name, value = "") {
    return `
      <div class="mb-2">
        <label class="form-label"><strong>${label}</strong></label>
        <input type="text" class="form-control" name="${name}" value="${value}" disabled>
      </div>
    `;
}

function creaCheckbox(label, name, checked = false) {
    return `
      <div class="form-check mb-2">
        <input type="checkbox" class="form-check-input" name="${name}" ${checked ? "checked" : ""} disabled>
        <label class="form-check-label"><strong>${label}</strong></label>
      </div>
    `;
}
  