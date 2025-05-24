async function creaGioco() {
    const contenuto = document.getElementById("contenuto-modale");
    document.getElementById("modaleDettagliLabel").textContent = `Crea gioco`;

    const initGioco = {
        Id: undefined,
        Note: undefined,
        Titolo: undefined,
        Autore: undefined,
        Proprietario: undefined,
        Tipologia: undefined,
        Difficolta: undefined,
        FasciaEta: undefined,
        Consigliato: undefined,
        Esplicito: undefined
    };

    creaCampiInput(contenuto, initGioco, true);

    new bootstrap.Modal(document.getElementById('modaleDettagli')).show();
}

async function mostraDettagli(Id) {
    const record = await genericCaricaGioco(Id);
    if (!record || !record.success || !record.record) {
        mostraMessaggioErrore("Errore: dati del gioco non disponibili.");
        return;
    }

    const contenuto = document.getElementById("contenuto-modale");
    const gioco = record.record; // estrai l'oggetto effettivo

    document.getElementById("modaleDettagliLabel").textContent = `Dettagli: ${gioco.Titolo} (${gioco.Autore})`;

    creaCampiInput(contenuto, gioco, false);

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

async function salva(id, form) {
    setLoading(true, "Salvando la principessa..");
    const aggiornato = {
        Id: id,
        Note: form.Note.value,
        Titolo: form.Titolo.value,
        Autore: form.Autore.value,
        Proprietario: form.Proprietario?.value || "",
        Tipologia: form.Tipologia.value,
        Difficolta: form.Difficolta.value,
        FasciaEta: form.FasciaEta.value,
        Consigliato: form.Consigliato.checked,
        Esplicito: form.Esplicito.checked
    };

    try {
        const url = `${API_URL}?action=salvaGioco`;
        const formData = new URLSearchParams();
        formData.append("payload", JSON.stringify(aggiornato));

        await fetch(url, {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        const modalEl = bootstrap.Modal.getInstance(document.getElementById('modaleDettagli'));
        modalEl.hide();
        caricaDati(); // Ricarica i dati in tabella
        mostraMessaggioSuccesso("Verso l'infinito e...");
    } catch (error) {
        mostraMessaggioErrore("Errore durante il salvataggio.");
    } finally {
      setLoading(false);
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

function creaCampiInput(contenuto, gioco, modificabile){
    contenuto.innerHTML = `
      <form id="formDettagli">
        ${creaInput("Titolo", "Titolo", gioco.Titolo)}
        ${creaInput("Autore", "Autore", gioco.Autore)}
        ${creaInput("Proprietario", "Autore", gioco.Proprietario)}
        ${creaInput("Tipologia", "Tipologia", gioco.Tipologia)}
        ${creaInput("Difficolta", "Difficolta", gioco.Difficolta)}
        ${creaInput("Fascia Età", "FasciaEta", gioco.FasciaEta)}
        <div class="row">
          ${creaCheckbox("Consigliato", "Consigliato", gioco.Consigliato, "../icons/certified-icon-small.ico")}
          ${creaCheckbox("Esplicito", "Esplicito", gioco.Esplicito, "../icons/pegi-18-small.png")}
        </div>
        ${creaInput("Note", "Note", gioco.Note)}
        <div class="mt-3 d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-warning" id="modificaBtn">Modifica</button>
          <button type="button" class="btn btn-sm btn-danger" id="eliminaBtn">Elimina</button>
          <button type="button" class="btn btn-success d-none" id="salvaBtn">Salva</button>
        </div>
      </form>
    `;

    
    const form = contenuto.querySelector("#formDettagli");
    const salvaBtn = form.querySelector("#salvaBtn");
    salvaBtn.addEventListener("click", async () => {
        await salva(gioco.Id, form); // Passa il form
    });

    const modificaBtn = form.querySelector("#modificaBtn")
    const eliminaBtn = form.querySelector("#eliminaBtn");
    if (!modificabile){
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
    } else {
        form.querySelectorAll("input").forEach(input => input.disabled = false);
        modificaBtn.classList.add("d-none");
        eliminaBtn.classList.add("d-none");
        salvaBtn.classList.remove("d-none");
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

function creaCheckbox(label, name, checked = false, imgPath = null) {
  if (!imgPath) {
    return `
      <div class="form-check mb-2">
        <input type="checkbox" class="form-check-input" name="${name}" ${checked ? "checked" : ""} disabled>
        <label class="form-check-label"><strong>${label}</strong></label>
      </div>
    `;
  } else {
      return `
      <div class="d-flex align-items-center" style="width: calc(50% - 1rem);">
        <input type="checkbox" class="d-none" id="${name}" name="${name}" ${checked ? "checked" : ""} disabled>
        <label for="${name}" class="checkbox-button me-2" style="background-image: url('${imgPath}');"></label> 
        <label class="form-check-label mb-0"><strong>${label}</strong></label>
      </div>
  `;

  }
}
