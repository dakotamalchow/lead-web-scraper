import React from "react";
import './app.css';

function App() {
  const [data, setData] = React.useState(null);
  const [zipCodes, setZipCodes] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`http://localhost:3001/api/${zipCodes}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Zip Codes:
          <input type="text" name="zipCodes" value={zipCodes} onChange={(event) => setZipCodes(event.target.value)} />
        </label>
        <input type="submit" />
      </form>

      <div>
        <p>{JSON.stringify(data)}</p>
      </div>
    </div>
  );
}

export default App;
