import React from "react";
import './app.css';

function App() {
  const [leads, setLeads] = React.useState([]);
  const [propertyManagers, setPropertyManagers] = React.useState(false);
  const [realEstateAgents, setRealEstateAgents] = React.useState(false);
  const [zipCodes, setZipCodes] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`http://localhost:3001/api?zipCodes=${zipCodes}&propertyManagers=${propertyManagers}&realEstateAgents=${realEstateAgents}`)
      .then((res) => res.json())
      .then((data) => setLeads(data));
  }

  const handlePropertyManagers = () => {
    setPropertyManagers(!propertyManagers);
    console.log(propertyManagers);
  }

  const handleRealEstateAgents = () => {
    setRealEstateAgents(!realEstateAgents);
  }

  const handleZipCodes = (event) => {
    setZipCodes(event.target.value);
  }

  return (
    <div>
      <h1>Lead Generator</h1>
      <form onSubmit={handleSubmit}>
        <input type="checkbox" id="propertyManagers" name="propertyManagers" checked={propertyManagers} onChange={handlePropertyManagers}></input>
        <label htmlFor="propertyManagers">Property Managers</label>
        <input type="checkbox" id="realEstateAgents" name="realEstateAgents" checked={realEstateAgents} onChange={handleRealEstateAgents}></input>
        <label htmlFor="realEstateAgents">Real Estate Agents</label>
        <label>
          Zip Codes:
          <input type="text" name="zipCodes" value={zipCodes} onChange={handleZipCodes} />
        </label>
        <input type="submit" />
      </form>

      <table>
        <thead>
          <tr>
            <td>Representative Name</td>
            <td>Company Name</td>
            <td>Phone Number</td>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr>
              <td>{lead.representativeName}</td>
              <td>{lead.companyName}</td>
              <td>{lead.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
