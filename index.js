const axios = require("axios");
const cheerio = require("cheerio");
const fs = require('fs');
const url = "https://en.wikipedia.org/wiki/COVID-19_pandemic_by_country_and_territory";

async function getData() {
    const {data} = await axios.get(url);
    const $ = cheerio.load(data);
    const list = [];
    $('.covid19-wrapper tbody tr').each((i, elem)=>{
        if((i > 0)&&(i < 218)){
            const country = $(elem).find('th').text().replaceAll("\n", "");
            const cases = $(elem).find('td').last().text().replaceAll("\n", "");
            const deaths = $(elem).find('td').last().prev().text().replaceAll("\n", "");
            const deaths_perMillion = $(elem).find('td').last().prev().prev().text().replaceAll("\n", "");
            const countries = {country, deaths_perMillion, deaths, cases};
            list.push(countries);
        }
    });
    
    //Show data in console
    console.log(list);
    
    //Create .Json file
    json = JSON.stringify(list);
    fs.writeFile('./covid19.json', json, (err) => {
        if (err) {
            throw err;
        }
        console.log("Done!");
    });
}

getData();