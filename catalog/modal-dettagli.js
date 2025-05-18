function mostraDettagli(record) {
    const contenuto = document.getElementById("contenuto-modale");
    document.getElementById("modaleDettagliLabel").textContent = `Dettagli: ${record.Titolo} (${record.Autore})`;

    contenuto.innerHTML = `
      <ul class="list-group">
        <li class="list-group-item"><strong>Note:</strong> ${record.Note || '—'}</li>
        <li class="list-group-item"><strong>Tag Tipologia:</strong> ${record.Titolo || '—'}</li>
        <li class="list-group-item"><strong>Autore:</strong> ${record.Autore || '—'}</li>
        <li class="list-group-item"><strong>Tipologia:</strong> ${record.Tipologia || '—'}</li>
        <li class="list-group-item"><strong>Difficoltà:</strong> ${record.Difficolta || '—'}</li>
        <li class="list-group-item"><strong>Fascia Età:</strong> ${record.FasciaEta || '—'}</li>
        <li class="list-group-item"><strong>Consigliato:</strong> ${record.Consigliato ? 'Sì' : 'No'}</li>
        <li class="list-group-item"><strong>Esplicito:</strong> ${record.Esplicito ? 'Sì' : 'No'}</li>
      </ul>
    `;

    // Mostra la modale
    const modale = new bootstrap.Modal(document.getElementById('modaleDettagli'));
    modale.show();
}
