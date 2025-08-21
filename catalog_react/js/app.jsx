function App() {
  return (
    <div>
      <h3>Catalogo Giochi</h3>
      <Messaggio testo="Questo è un messaggio da un componente React separato!" />
      <h4>🎲 Demo 3D</h4>
      <Cube3D />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
