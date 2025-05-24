console.log("v01: caricata 09/05/2025 21:16");
const API_URL = "https://script.google.com/macros/s/AKfycbygmykV1SAIWmnG43mL4dEBpj2PEfkijlmCsDGBiAQ0loGfQ_iHRkB6AaQ_E3NC---JSg/exec";
let dati = [];
(async function () {
  setLoading(true, "Chiamo casa madre..");
  await controllaStatoAPI();
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
    try {
        const res = await fetch(API_URL + "?version=true");
        if (!res.ok) throw new Error("Errore");
        const data = await res.json();
        if (data.version) {
            stato.textContent = "🟢";
            stato.title = `API OK - Versione ${data.version}`;
        } else {
            throw new Error("Formato inatteso");
        }
    } catch (e) {
        stato.textContent = "🔴";
        stato.title = "Errore nel contattare l'API";
    }
}

function mostraMessaggioErrore(testo) {
    const toastEl = document.getElementById('toastErrore');
    const toastBody = document.getElementById('testoToastErrore');
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
        console.error("Errore durante il caricamento dati:", error);
        mostraMessaggioErrore("Errore: impossibile contattare il server. Riprova più tardi.");
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

    lista.forEach(r => {
        const tr = document.createElement("tr");
        tr.classList.add("riga-principale");
        tr.innerHTML = `
          <td class="text-truncate">${r.Titolo}</td>
          <td class="text-truncate">${r.Tipologia || ''}</td>
          <td class="text-truncate">${r.Difficolta}</td>
          <td style="white-space: nowrap; width: 1%;" class="ps-0 pe-0">
            <img 
                src="../icons/certified-icon-small.ico" 
                alt="Consigliato"
                style="${r.Consigliato ? '' : 'visibility:hidden'}"
            />
            <img 
                src="../icons/pegi-18-small.png" 
                alt="Esplicito" 
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

            const next = tr.nextElementSibling;
            if (next && next.classList.contains("dettagli-header")) {
                // Animazione chiusura: togli classe show
                next.classList.remove("show");
                next.nextElementSibling.classList.remove("show");

                // Rimuovi dopo la durata della transizione
                setTimeout(() => {
                    if (next.nextElementSibling) next.nextElementSibling.remove();
                    next.remove();
                }, 400);

                return;
            }

            // Riga intestazioni
            const headerTr = document.createElement("tr");
            headerTr.classList.add("dettagli-valori");
            headerTr.innerHTML = `
                <td rowspan="2" style="white-space: nowrap; width: 1%; text-align: left;">
                    <button class="btn btn-sm btn-info" onclick='mostraDettagli(${r.Id})'>
                        <img src="../icons/monitor-expand-small.ico" alt="Dettagli" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;" />
                        Dettagli
                    </button>
                </td>
                <td colspan="3" class="text-truncate"><b>Proprietario: </b> ${r.Proprietario || ''}</td>
            `;

            // Riga valori
            const valueTr = document.createElement("tr");
            valueTr.classList.add("dettagli-valori");
            valueTr.innerHTML = `
                <td colspan="3" class="text-truncate"><b>Autore: </b>${r.Autore}</td>
            `;

            tr.after(valueTr);
            tr.after(headerTr);

            // Forza il reflow per attivare la transizione
            headerTr.offsetHeight;
            valueTr.offsetHeight;

            // Aggiungi classe show per animare l'apparizione
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