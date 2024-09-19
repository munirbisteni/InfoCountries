var express = require('express');
const axios = require('axios');
var router = express.Router();

router.get('/', async (req, res) => {
  try{
      const response = await axios.get('https://date.nager.at/api/v3/AvailableCountries');
      res.json(response.data)
  
    }
    catch (error){
      res.status(500).json({ message: 'Erro ao obetr os dados', error: error.message});
    }
  })
  
  router.get('/countryInfo/:id', async (req, res) => {
    var id = req.params.id;
    try{
      const countryInfo = await axios.get(`https://date.nager.at/api/v3/CountryInfo/${id}`);
      var data = countryInfo.data;
      var commonNames = data.borders.map(border =>([
          border.countryCode,
          border.commonName
      ]));
      var response = {countryName: data.commonName, neighbours: commonNames}
      res.json(response)
    }
    catch (error){
      res.status(500).json({ message: 'Error to get data', error: error.message});
    }
  })
  
  router.get('/countryInfo/population/:countryName', async (req, res) => {
    const country = req.params.countryName;
    try{
      const response = await axios.post(`https://countriesnow.space/api/v0.1/countries/population`, {country: country});
      var countryPopulation = response.data;
      res.json(countryPopulation.data.populationCounts)
    }
    catch (error){
      res.status(500).json({ message: 'Error to get data', error: error.message});
    }
  })
  
  router.get('/countryInfo/flag/:id', async (req, res) => {
    var id = req.params.id;
    try{
      const response = await axios.get(`https://countriesnow.space/api/v0.1/countries/flag/images`);
      var flagImages = response.data;
      var countryInfo = flagImages.data.find(item => item.iso2 === id);
      res.json(countryInfo.flag)
      
    }
    catch (error){
      res.status(500).json({ message: 'Error to get data', error: error.message});
  }
})
  
  module.exports = router;