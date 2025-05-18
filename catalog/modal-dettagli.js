function mostraDettagli(record) {
    const contenuto = document.getElementById("contenuto-modale");
    document.getElementById("modaleDettagliLabel").textContent = `Dettagli: ${record.Titolo} (${record.Autore})`;

    contenuto.innerHTML = `
      <form id="formDettagli">
        ${creaInput("Note", "Note", record.Note)}
        ${creaInput("Tag Tipologia", "Titolo", record.Titolo)}
        ${creaInput("Autore", "Autore", record.Autore)}
        ${creaInput("Tipologia", "Tipologia", record.Tipologia)}
        ${creaInput("Difficolta", "Difficolta", record.Difficolta)}
        ${creaInput("Fascia Età", "FasciaEta", record.FasciaEta)}
        ${creaCheckbox("Consigliato", "Consigliato", record.Consigliato)}
        ${creaCheckbox("Esplicito", "Esplicito", record.Esplicito)}
        <div class="mt-3 d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-warning" id="modificaBtn">Modifica</button>
          <button type="button" class="btn btn-success d-none" id="salvaBtn">Salva</button>
        </div>
      </form>
      <button class="btn btn-sm btn-danger" onclick="elimina(${record.Id})">Elimina</button>
    `;

    const form = contenuto.querySelector("#formDettagli");
    const modificaBtn = form.querySelector("#modificaBtn");
    const salvaBtn = form.querySelector("#salvaBtn");

    modificaBtn.addEventListener("click", () => {
        form.querySelectorAll("input").forEach(input => input.disabled = false);
        modificaBtn.classList.add("d-none");
        salvaBtn.classList.remove("d-none");
    });

    salvaBtn.addEventListener("click", async () => {
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
        }
    });

    new bootstrap.Modal(document.getElementById('modaleDettagli')).show();
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
