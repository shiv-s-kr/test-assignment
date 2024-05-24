import React, { useEffect, useState } from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Chart from 'chart.js/auto';
import "leaflet/dist/leaflet.css";
import "../Css/ChartsAndMaps.css";
import Header from './Header';

// Create a custom transparent marker icon
const customIcon = L.icon({
  iconUrl: 'https://img.icons8.com/?size=100&id=3ZYRWNSKGmq5&format=png&color=000000', // Path to the transparent image
  iconSize: [35, 51], // Adjust the size if necessary
  iconAnchor: [12, 41], // Adjust the anchor point if necessary
  popupAnchor: [1, -34], // Adjust the popup anchor point if necessary
});

const fetchChartData = async () => {
  return await axios.get('https://disease.sh/v3/covid-19/historical/all?lastdays=all');
};

const fetchWorldWide = async () => {
  return await axios.get('https://disease.sh/v3/covid-19/all');
};

const ChartsAndMaps = () => {
  const [chartData, setChartData] = useState({});
  const [countryData, setCountryData] = useState([]);
  const [worldWideData, setWorldWideData] = useState({});
  const [windWidth, setWindwidth] = useState({ wid: window.innerWidth });

  const fetchCountryData = async () => {
    const res = await axios.get('https://disease.sh/v3/covid-19/countries');
    const data = res.data;

    const countryData = data.map((country) => ({
      name: country.country,
      lat: country.countryInfo.lat,
      long: country.countryInfo.long,
      active: country.active,
      recovered: country.recovered,
      deaths: country.deaths,
    }));

    setCountryData(countryData);
  };

  useEffect(() => {
    fetchChartData().then((res) => setChartData({
      labels: Object.keys(res.data.cases),
      datasets: [
        {
          label: "COVID-19 Cases",
          data: Object.values(res.data.cases),
          backgroundColor: "red",
        }
      ]
    }));

    fetchCountryData();

    fetchWorldWide().then((res) => setWorldWideData(res.data));
    
  }, []);

  useEffect(() => {
    const chartConfig = {
      type: 'line',
      data: chartData,
    };

    const myChart = new Chart(document.getElementById('myChart'), chartConfig);
    return () => {
      myChart.destroy();
    };
  }, [chartData]);

  return (
    <div>
      <Header></Header>
      <Heading ></Heading>
      

      <div id="charts_page_div">
        {window.innerWidth > 900 ? (
          <Box padding={"10px"} w={"19%"} boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}>
            <Box><Link style={{ textDecoration: "none", fontSize: "20px", fontWeight: "bold" }} to="/">Contacts</Link></Box>
            <br />
            <br />
            <Box><Link style={{ textDecoration: "none", fontSize: "20px", fontWeight: "bold" }} to="/chartsandmaps">Charts & Maps</Link></Box>
          </Box>
        ) : (
          <Flex justifyContent={"space-evenly"} w={"100%"} margin={'auto'} marginBottom={"20px"} p={"10px 0px"} boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}>
            <Box><Link style={{ textDecoration: "none", fontSize: "20px", fontWeight: "bold" }} to="/">Contacts</Link></Box>
            <Box><Link style={{ textDecoration: "none", fontSize: "20px", fontWeight: "bold" }} to="/chartsandmaps">Charts & Maps</Link></Box>
          </Flex>
        )}
        <Box padding={"30px"} margin={'auto'} w={"79%"} boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"} border={"1px solid gray"}>
          <Heading className='text-primary mb-4'>COVID-19 Dashboard</Heading>

          <Box>
            <div class="card text-start">
              <div class="card-body">
                <h4 class="card-title">World Wide</h4>
                <p class="card-text">
                  <table className='table'>
                    <tr>
                      <th>Today Cases</th>
                      <th>Today Deaths</th>
                      <th>Today Recovered</th>
                    </tr>
                    <tr>
                      <td>{worldWideData.todayCases}</td>
                        <td> {worldWideData.todayDeaths}</td>
                          <td>{worldWideData.todayRecovered}</td>
                    </tr>
                  </table>
                  <table className='table'>
                    <tr>
                      <th>Total Cases</th>
                      <th>Total Deaths</th>
                      <th>Total Recovered</th>

                    </tr>
                    <tr>
                      <td>{worldWideData.cases}</td>
                      <td>{worldWideData.deaths}</td>
                      <td>{worldWideData.recovered}</td>

                    </tr>
                  </table>
                </p>
              </div>
            </div>
            
          </Box>

          <Box className='card mt-4 p-2'>
            {window.innerWidth > 900 ? (
              <canvas id="myChart" width="800" height="300"></canvas>
            ) : (
              <canvas id="myChart" width="400" height="300"></canvas>
            )}
          </Box>

          <br />
          <br />

          <Box className='card mt-4 p-2'>
            <MapContainer center={[0, 0]} zoom={2}>
              <TileLayer url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=NLe8DG6CVIhkI4PpAXR1" />
              {countryData.map((country) => (
                <Marker key={country.name} position={[country.lat, country.long]} icon={customIcon}>
                  <Popup>
                    <h4>Name: {country.name}</h4>
                    <p>Active Cases: {country.active}</p>
                    <p>Recovered Cases: {country.recovered}</p>
                    <p>Deaths: {country.deaths}</p>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default ChartsAndMaps;
