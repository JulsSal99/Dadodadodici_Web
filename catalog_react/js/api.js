const API_URL = "https://script.google.com/macros/s/AKfycbygmykV1SAIWmnG43mL4dEBpj2PEfkijlmCsDGBiAQ0loGfQ_iHRkB6AaQ_E3NC---JSg/exec";

async function fetchGames() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Errore fetch");
  let dati = await res.json();
  return dati.map((r, i) => ({ ...r, riga: i + 2 }));
}

async function fetchGame(id) {
  const url = `${API_URL}?action=ottieniGioco&IdGioco=${encodeURIComponent(id)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Errore fetch singolo gioco");
  return await res.json();
}

async function saveGame(game) {
  const url = `${API_URL}?action=salvaGioco`;
  const formData = new URLSearchParams();
  formData.append("payload", JSON.stringify(game));
  const res = await fetch(url, {
    method: "POST",
    body: formData,
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });
  return await res.json();
}
