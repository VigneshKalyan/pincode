import React, { useState } from 'react';

function App() {
  const [pincode, setPincode] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePincodeChange = (event) => {
    setPincode(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setFilteredData(data.filter((item) => item.PostOffice[0].Name.toLowerCase().includes(event.target.value.toLowerCase())));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (pincode.length !== 6) {
      setError('Pincode should be 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setData(data[0].PostOffice);
        setFilteredData(data[0].PostOffice);
        setIsLoading(false);
      })
      .catch((error) => {
        setError('Error fetching data');
        setIsLoading(false);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Pincode:
          <input type="text" value={pincode} onChange={handlePincodeChange} />
        </label>
        <button type="submit">Lookup</button>
      </form>
      {isLoading && <div className="loader">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {filteredData.length === 0 && !isLoading && <div>No data found</div>}
      {filteredData.length > 0 && (
        <div>
          <label>
            Filter by Post Office Name:
            <input type="text" value={filter} onChange={handleFilterChange} />
          </label>
          <ul>
            {filteredData.map((item) => (
              <li key={item.Pincode}>
                <div>Post office name: {item.Name}</div>
                <div>Pincode: {item.Pincode}</div>
                <div>District: {item.District}</div>
                <div>State: {item.State}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
