const puppeteer = require('puppeteer');
const fs = require('fs');

const scrape = async () => {
  // Initiate a browser
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic_by_country_and_territory', { waitUntil: 'domcontentloaded' })

  console.log('here')

  const recordList = await page.$$eval('[aria-label="COVID-19 pandemic by country and territory table"] table#thetable tbody tr', (trows) => {
    let dataObj = {
      data: [],
      asOfDate: ''
    }
    let rowList = []

    trows.forEach(row => {
      let record = { 'country': '', 'cases': '', 'death': '', 'recovered': '' }
      record.country = row.querySelector('a').innerText;
      const tdList = Array.from(row.querySelectorAll('td'), column => column.innerText);
      record.cases = tdList[0];
      record.death = tdList[1];
      record.recovered = tdList[2];

      if (tdList.length >= 3) {
        rowList.push(record)
      } else if (tdList.length == 1) {
        // E.g. As of 8 January 2021 (UTC) · History of cases · History of deaths
        if (tdList[0].length < 100) {
          let tempDate = tdList[0];
          tempDate = tempDate.replace(' · History of cases · History of deaths','');
          dataObj.asOfDate = tempDate;
        }
      }
    });

    dataObj.data = rowList;
    return dataObj;
  })

  browser.close();

  fs.writeFile('./data/covid-19.json', JSON.stringify(recordList, null, 2), (err) => {
    if (err) { console.log(err) }
    else { console.log('Saved Successfully!') }
  })
};

scrape();