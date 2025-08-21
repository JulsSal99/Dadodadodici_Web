function GameModal({ gioco, onClose }) {
  if (!gioco) return null;

  const difficoltaImg = {
    "facile": "/icons/speedometer_small_easy.png",
    "medio": "/icons/speedometer_small_medium.png",
    "difficile": "/icons/speedometer_small_hard.png",
    "cinghiale": "/icons/boar_medium.png"
  };

  const diffKey = String(gioco.Difficolta ?? "").toLowerCase();

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Dettagli: {gioco.Titolo} ({gioco.Autore})</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <ul className="list-group">
              <li className="list-group-item"><strong>Titolo:</strong> {gioco.Titolo}</li>
              <li className="list-group-item"><strong>Autore:</strong> {gioco.Autore}</li>
              <li className="list-group-item"><strong>Proprietario:</strong> {gioco.Proprietario || "-"}</li>
              <li className="list-group-item"><strong>Tipologia:</strong> {gioco.Tipologia || "-"}</li>
              <li className="list-group-item">
                <strong>Difficoltà:</strong> {gioco.Difficolta || "-"}{" "}
                {difficoltaImg[diffKey] && (
                  <img src={difficoltaImg[diffKey]} alt={gioco.Difficolta} style={{ width: "48px", marginLeft: "8px" }} />
                )}
              </li>
              <li className="list-group-item"><strong>Fascia Età:</strong> {gioco.FasciaEta || "-"}</li>
              <li className="list-group-item">
                <strong>Consigliato:</strong> {gioco.Consigliato ? "Sì" : "No"}{" "}
                {gioco.Consigliato && (
                  <img src="/icons/certified-icon-small.ico" alt="Consigliato" style={{ width: "24px", marginLeft: "4px" }} />
                )}
              </li>
              <li className="list-group-item">
                <strong>Esplicito:</strong> {gioco.Esplicito ? "Sì" : "No"}{" "}
                {gioco.Esplicito && (
                  <img src="/icons/pegi-18-small.png" alt="Esplicito" style={{ width: "24px", marginLeft: "4px" }} />
                )}
              </li>
              <li className="list-group-item"><strong>Note:</strong> {gioco.Note || "-"}</li>
            </ul>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Chiudi</button>
          </div>
        </div>
      </div>
    </div>
  );
}