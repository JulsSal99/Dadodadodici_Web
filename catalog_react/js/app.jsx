function App() {
  const [giochi, setGiochi] = React.useState([]);
  const [filtro, setFiltro] = React.useState("");
  const [giocoSelezionato, setGiocoSelezionato] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const dati = await fetchGames();
        setGiochi(dati);
      } catch (e) {
        console.error(e);
        alert("Errore nel caricamento dei giochi");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtrati = giochi.filter(g => 
    String(g.Titolo ?? "").toLowerCase().includes(String(filtro ?? "").toLowerCase()) ||
    String(g.Tipologia ?? "").toLowerCase().includes(String(filtro ?? "").toLowerCase())
  );


  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>🎲 Giochi in sede</h2>
      </div>

      <div className="row g-2 mb-4 mt-2">
        <div className="col-auto">
          <button className="btn btn-primary">Aggiungi</button>
        </div>
        <div className="col-auto">
          <input
            className="form-control"
            placeholder="🔍 Cerca..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="d-flex align-items-center gap-2">
          <div className="spinner-border text-primary"></div>
          <span>Caricamento...</span>
        </div>
      ) : (
        <GameTable giochi={filtrati} onRowClick={setGiocoSelezionato} />
      )}

      {giocoSelezionato && (
        <GameModal gioco={giocoSelezionato} onClose={() => setGiocoSelezionato(null)} />
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
