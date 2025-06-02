console.log("v01: caricata 09/05/2025 21:16");
const API_URL = "https://script.google.com/macros/s/AKfycbygmykV1SAIWmnG43mL4dEBpj2PEfkijlmCsDGBiAQ0loGfQ_iHRkB6AaQ_E3NC---JSg/exec";
let dati = [];
(async function () {
  setLoading(true, "Riempio la libreria di giochi...");
  await caricaDati(); 
  setLoading(false);

  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  if (isMobile) {
    console.log("Sei su un dispositivo mobile");
  }
})();

function setLoading(isLoading, testo = "Caricamento...") {
  const loader = document.getElementById("loader");
  const loaderText = document.getElementById("loader-text");

  loader.style.display = isLoading ? "flex" : "none";
  if (testo) loaderText.textContent = testo;
}


async function controllaStatoAPI() {
    const stato = document.getElementById("stato-api");
    // try {
        const res = await fetch(API_URL + "?version=true");
        if (!res.ok) throw new Error("Errore");
        const data = await res.json();
        if (!data.version) {
            throw new Error("Formato inatteso");
        } 
        // else {
        //     // stato.textContent = "🟢";
        //     // stato.title = `API OK - Versione ${data.version}`;
        // }
    // } catch (e) {
    //     // stato.textContent = "🔴";
    //     // stato.title = "Errore nel contattare l'API";
    // }
}

function mostraMessaggioErrore(testo) {
    const toastEl = document.getElementById('toast-head');
    toastEl.classList.add('bg-danger');
    toastEl.setAttribute('aria-live', 'assertive');
    const toastBody = document.getElementById('testoToast');
    toastBody.textContent = testo;

    const toast = new bootstrap.Toast(toastEl, { delay: 5000 });
    toast.show();
}

function mostraMessaggioSuccesso(testo) {
    const toastEl = document.getElementById('toast-head');
    toastEl.classList.add('bg-success');
    toastEl.setAttribute('aria-live', 'polite');
    const toastBody = document.getElementById('testoToast');
    toastBody.textContent = testo;

    const toast = new bootstrap.Toast(toastEl, { delay: 5000 });
    toast.show();
}


/**
 * @description carica i dati all'accesso
 * 
 * */
async function caricaDati() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Errore risposta");
        dati = await res.json();
        dati = dati.map((r, i) => ({ ...r, riga: i + 2 }));
        mostra(dati);
    } catch (error) {
        try {
            setLoading(true, "Chiamo casa madre..");
            await controllaStatoAPI(); 
            console.error("Errore durante il caricamento dati:", error);
            mostraMessaggioErrore("Errore: Errore durante il caricamento dati.");
        } catch (apiErr) {
            console.error("Controllo stato API fallito:", apiErr);
            mostraMessaggioErrore("Errore: impossibile contattare il server. Riprova più tardi.");
        }
    }
}

/**
 * 
 * @param {*} lista
 * @description popola "tabella-body". Chiamato una sola volta
 */
function mostra(lista) {
    const tbody = document.getElementById("tabella-body");
    tbody.innerHTML = "";

    const difficoltaImg = {
        "facile": "speedometer_small_easy.png",
        "medio": "speedometer_small_medium.png",
        "difficile": "speedometer_small_hard.png",
        "cinghiale": "boar_medium.png"
    };

    lista.forEach(r => {
        const tr = document.createElement("tr");
        tr.classList.add("riga-principale");

        const difficoltaKey = String(r.Difficolta || "").toLowerCase();
        let difficoltaContent = ``;
        if (difficoltaImg[difficoltaKey]) {
            difficoltaContent = `
                <div class="d-flex align-items-center">
                    <img src="/icons/${difficoltaImg[difficoltaKey]}" alt="${r.Difficolta}" style="height: 42px; margin-right: 8px;">
                </div>
            `;
        }

        tr.innerHTML = `
        <td>
            <div style="white-space: nowrap; overflow-x: auto;">
                ${r.Titolo}
            <div>
        </td>
        <td>
            <div style="white-space: nowrap; overflow-x: auto;">
                ${r.Tipologia || ''}
            <div>
        </td>
        <td class="text-truncate">${difficoltaContent}</td>
        <td class="ps-0 pe-2 text-end" style="white-space: nowrap; width: 1%;">
            <img 
                src="../icons/certified-icon-small.ico" 
                alt="Consigliato"
                title="Consigliato"
                style="${r.Consigliato ? '' : 'visibility:hidden'}"
            />
            <img 
                src="../icons/pegi-18-small.png" 
                alt="Esplicito" 
                title="Esplicito"
                width="48" 
                style="${r.Esplicito ? '' : 'visibility:hidden'}"
            />
            <span class="fascia-eta" style="${r.FasciaEta ? '' : 'visibility:hidden'}" title="Fascia di età">
                ${r.FasciaEta || ''}+
            </span>
        </td>
        `;

        tr.addEventListener("click", function (e) {
            if (e.target.tagName === "BUTTON") return;

            // Se la riga dettagli è già aperta subito dopo questa riga, chiudila
            const next = tr.nextElementSibling;
            if (next && next.classList.contains("dettagli-header")) {
                next.classList.remove("show");
                next.nextElementSibling.classList.remove("show");

                setTimeout(() => {
                    if (next.nextElementSibling) next.nextElementSibling.remove();
                    next.remove();
                }, 400);

                return;
            }

            // Chiudi tutte le altre righe dettagli aperte
            const dettagliHeaders = tbody.querySelectorAll("tr.dettagli-header");
            dettagliHeaders.forEach(header => {
                header.classList.remove("show");
                const valTr = header.nextElementSibling;
                if (valTr) valTr.classList.remove("show");
                setTimeout(() => {
                    if (valTr) valTr.remove();
                    header.remove();
                }, 400);
            });


            const headerTr = document.createElement("tr");
            headerTr.classList.add("dettagli-header");
            headerTr.innerHTML = `
                <td colspan="100%" class="p-2">
                    <div class="d-flex align-items-start gap-3">
                        <button class="btn btn-sm btn-info mt-1" onclick='mostraDettagli(${r.Id})'>
                            <img src="../icons/monitor-expand-small.ico" alt="Dettagli"
                            style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;" />
                            Dettagli
                        </button>

                        <div class="d-flex flex-column">
                            <div class="d-flex">
                                <div class="me-2 fw-bold" style="min-width: 100px;">Proprietario:</div>
                                <div class="text-truncate">${r.Proprietario || ''}</div>
                            </div>
                            <div class="d-flex">
                                <div class="me-2 fw-bold" style="min-width: 100px;">Autore:</div>
                                <div class="text-truncate">${r.Autore || ''}</div>
                            </div>
                            <div class="d-flex flex-wrap">
                                <div class="me-2 fw-bold" style="min-width: 100px;">Note:</div>
                                <div class="text-break">${r.Note || ''}</div>
                            </div>
                        </div>
                    </div>
                </td>
            `;




            const valueTr = document.createElement("tr");
            valueTr.classList.add("dettagli-valori");

            tr.after(valueTr);
            tr.after(headerTr);

            // Forza reflow per animazioni
            headerTr.offsetHeight;
            valueTr.offsetHeight;

            // Aggiungi classe per mostrare (animazione)
            headerTr.classList.add("show");
            valueTr.classList.add("show");
        });

        tbody.appendChild(tr);
    });
}


/**
 * @description: Filtra i dati in base a una parola generica
 * 
 * */
function filtra() {
    const q = document.getElementById("filtro").value.toLowerCase().trim();

    if (!q) {
        mostra(dati); // Se il campo è vuoto, mostra tutti
        return;
    }

    const queryParts = q.split(',').map(s => s.trim()).filter(Boolean);

    const filtrati = dati.filter(r =>
        queryParts.every(part =>
            r.Titolo?.toLowerCase().includes(part) ||
            r.Tipologia?.toLowerCase().includes(part) ||
            r.Autore?.toLowerCase().includes(part) ||
            r.Proprietario?.toLowerCase().includes(part) ||
            r.Difficolta?.toLowerCase().includes(part) ||
            r.Note?.toLowerCase().includes(part) ||
            r.FasciaEta?.toString().includes(part) ||
            (r.Esplicito ? ('18+'.includes(part) || 'esplicito'.includes(part)) : ''.includes(part)) ||
            (r.Consigliato ? 'consigliato'.includes(part) : ''.includes(part))
        )
    );

    mostra(filtrati);
}

async function aggiungi() {
    window.location.href = `catalogEdit.html`;
}

function modifica(id) {
    // Reindirizza alla pagina di modifica, passando l'id nell'URL
    window.location.href = `catalogEdit.html?id=${encodeURIComponent(id)}`;
}