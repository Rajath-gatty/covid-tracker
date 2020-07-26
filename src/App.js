import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl } from '@material-ui/core';
import './App.css';
import InfoBox from './Components/InfoBox';
import LineGraph from './Components/LineGraph';
import Table from './Components/Table';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('Global');
  const [specificCountry, setSpecificCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [countryList, setCountryList] = useState([]);

  useEffect(() => {
    const fetchsingleCountry = async () => {
      if (country === 'Global') {
        await fetch('https://disease.sh/v3/covid-19/all')
          .then(res => res.json())
          .then(data => {
            setSpecificCountry(data)
          })
      } else {
        setLoading(true);
        await fetch(`https://disease.sh/v3/covid-19/countries/${country}`)
          .then(res => res.json())
          .then(data => {
            setSpecificCountry(data);
            setLoading(false);
          })
      }
    }

    fetchsingleCountry();

  }, [country])


  useEffect(() => {
    const fetchCountries = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then(res => res.json())
        .then(data => {
          const countries = data.map(country => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));
          setCountries(countries);
          setCountryList(data);
        })
    }
    fetchCountries();
  }, [])

  const setSingleCountry = (e) => {
    setCountry(e.target.value);
  }

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="container">
          <h2>COVID TRACKER</h2>
        </div>
      </div>
      <div className="container-p container">
        {/* Select Form */}
        <div className="select">
          <FormControl>
            <Select variant="standard" value={country} onChange={setSingleCountry}>
              <MenuItem value="Global">Global</MenuItem>
              {countries.map((country, i) => {
                return <MenuItem key={i} value={country.value}>{country.name}</MenuItem>
              })}
            </Select>
          </FormControl>
        </div>
        <div className="info-wrapper">
          {/* Info cases */}
          <InfoBox
            title="Cases"
            flag={specificCountry.countryInfo ? specificCountry.countryInfo.flag : null}
            subTitle={specificCountry.country}
            cases={specificCountry.cases}
            today={specificCountry.todayCases}
            loading={loading}
            casesType="cases"
          />

          {/* Info Recovered */}
          <InfoBox
            title="Recovered"
            cases={specificCountry.recovered}
            today={specificCountry.todayRecovered}
            updated={specificCountry.updated}
            loading={loading}
            casesType="recovered"
          />

          {/* Info deaths */}
          <InfoBox
            title="Deaths"
            cases={specificCountry.deaths}
            today={specificCountry.todayDeaths}
            loading={loading}
            casesType="deaths" />
        </div>

        <div className="wrapper">
          <div className="graph-wrapper">
            <LineGraph country={specificCountry.country} casesType="cases" graphColor="rgb(255, 211, 16)" />
            <LineGraph country={specificCountry.country} casesType="deaths" graphColor="rgba(255, 0, 0)" />
          </div>
          <div className="list-wrapper">
            <h3 style={{ textAlign: "center" }}>CASES BY COUNTRIES</h3>
            <Table countries={countryList} />
          </div>
        </div>
      </div>
      <footer>
        <p>- Developed by Rajath | &copy; covid tracker </p>
      </footer>
    </div>
  );
}

export default App;
