function GameTable({ giochi, onRowClick }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover table-el-giochi">
        <thead className="table-dark">
          <tr>
            <th>Titolo</th>
            <th>Tipologia</th>
            <th>Difficoltà/Tag</th>
          </tr>
        </thead>
        <tbody>
          {giochi.map((g) => (
            <GameRow key={g.Id} gioco={g} onClick={onRowClick} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
