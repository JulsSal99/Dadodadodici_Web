/**
 * @description carica i dati di un gioco singolo
 */
export async function genericCaricaGioco(id) {
    const params = new URLSearchParams({
        action: "ottieniGioco",
        Id: id,
    });
    try {
        const res = await fetch(API_URL + "?" + params.toString());
        if (!res.ok) throw new Error("Errore risposta");
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Errore durante il caricamento dati:", error);
        if (typeof mostraMessaggioErrore === "function") {
            mostraMessaggioErrore("Errore: impossibile contattare il server. Riprova più tardi.");
        }
        return null;
    }
}