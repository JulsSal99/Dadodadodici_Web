function GameRow({ gioco, onClick }) {
  const difficoltaImg = {
    "facile": "speedometer_small_easy.png",
    "medio": "speedometer_small_medium.png",
    "difficile": "speedometer_small_hard.png",
    "cinghiale": "boar_medium.png"
  };

  const diffKey = String(gioco.Difficolta ?? "").toLowerCase();

  return (
    <tr className="riga-principale" onClick={() => onClick(gioco)}>
      <td>{gioco.Titolo}</td>
      <td>{gioco.Tipologia || ""}</td>
      <td className="ps-0 pe-2 text-end" style={{ whiteSpace: "nowrap", width: "1%" }}>
        {difficoltaImg[diffKey] && (
          <img src={`../../icons/${difficoltaImg[diffKey]}`} alt={gioco.Difficolta} style={{ width: "48px" }} />
        )}
        <img
          src="../../icons/certified-icon-small.ico"
          alt="Consigliato"
          style={{ visibility: gioco.Consigliato ? "visible" : "hidden" }}
        />
        <img
          src="../../icons/pegi-18-small.png"
          alt="Esplicito"
          width="48"
          style={{ visibility: gioco.Esplicito ? "visible" : "hidden" }}
        />
        {gioco.FasciaEta && (
          <span className="fascia-eta-wrapper">
            <span className="fascia-eta-content"><b>{gioco.FasciaEta}+</b></span>
          </span>
        )}
      </td>
    </tr>
  );
}
