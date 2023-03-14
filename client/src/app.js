import React from "react";
import './app.css';

function App() {
  const [data, setData] = React.useState(null);
  const [propertyManagers, setPropertyManagers] = React.useState(false);
  const [realEstateAgents, setRealEstateAgents] = React.useState(false);
  const [zipCodes, setZipCodes] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`http://localhost:3001/api/${zipCodes}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }

  const handlePropertyManagers = (event) => {
    setPropertyManagers(event.target.value);
  }

  const handleRealEstateAgents = (event) => {
    setRealEstateAgents(event.target.value);
  }

  const handleZipCodes = (event) => {
    setZipCodes(event.target.value);
  }

  return (
    <div>
      <h1>Lead Generator</h1>
      <form onSubmit={handleSubmit}>
        <input type="checkbox" id="propertyManagers" name="propertyManagers" value={propertyManagers} onChange={handlePropertyManagers}></input>
        <label htmlFor="propertyManagers">Property Managers</label>
        <input type="checkbox" id="realEstateAgents" name="realEstateAgents" value={realEstateAgents} onChange={handleRealEstateAgents}></input>
        <label htmlFor="realEstateAgents">Real Estate Agents</label>
        <label>
          Zip Codes:
          <input type="text" name="zipCodes" value={zipCodes} onChange={handleZipCodes} />
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
