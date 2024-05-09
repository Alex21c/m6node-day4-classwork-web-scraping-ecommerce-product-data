import puppeteer from 'puppeteer';
import * as xlsx from 'xlsx';
// Product Name
// Price
// Availability (In Stock/Out of Stock)
// Product Rating (if available)


async function init(){
  // let URL = 'https://alex21c.github.io/sampleScrapingData/20gmGoldBar.html';

  // requesting from amazon: gold coin 10gm 
  let URL = 'https://www.amazon.in/s?k=gold+coin+10gm&crid=17DMYS2GBHH7M&sprefix=gold+coin+10g%2Caps%2C237&ref=nb_sb_noss_1';

  const browser = await puppeteer.launch({headless: false});
  try {
    // launch a browser and open a new blank tab
      const page = await browser.newPage();

    // set the screen size
        await page.setViewport({width: 1920, height: 1080});
    
    // open a url inside that new tab
      await page.goto(URL);
    
    // fetching 
    // const paragraphs = await page.$$eval('p', elements => elements.map(el => el.textContent));
    // console.log(paragraphs);

    let products = await page.$$eval('div.a-section.a-spacing-base.a-text-center', e=>e.map((element)=>{
      let productName =  element.querySelector('span.a-size-base-plus.a-color-base.a-text-normal').textContent;
      let price = element.querySelector('span.a-price>span>span.a-price-whole');
        price = price ? Number(price.textContent.replaceAll(',', "")) : undefined;

      let priceSymbol = element.querySelector('span.a-price>span>span.a-price-symbol');
      priceSymbol = priceSymbol ? priceSymbol.textContent : undefined;

      let brand = element.querySelector('h2.a-size-mini.s-line-clamp-1>span.a-size-base-plus.a-color-base').textContent;
      // let currencySymbol = element.querySelector('span.a-price-symbol').textContent;
      
      let rating = element.querySelector('a.a-popover-trigger.a-declarative>i.a-icon.a-icon-star-small.a-star-small-4-5.aok-align-bottom>span.a-icon-alt');
      rating = rating ? rating.textContent.replace(' out of 5 stars', "") : undefined;
      
      let mrp = element.querySelector('span.a-price.a-text-price>span.a-offscreen');
      mrp = mrp ? mrp.textContent : undefined;      
        let product = {
          productName,
          brand,
          'ratingOutOf5': rating,
          mrp,
          price,
          priceSymbol

        };

      return product;


      
    }));

    console.log(products);
    
    // now i want to save it into the excel file
    // Create a new workbook
    try {
      let sheet = xlsx.utils.json_to_sheet(products);
      let workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, sheet, 'sheet1');
  
        xlsx.writeFile(workbook, 'products.xlsx');
        console.log('Data saved into products.xlsx file Successfully!');
      
    } catch (error) {
      console.log('ERROR saving data into excel file. ', error);
    }


    
    
    

      
    
  } catch (error) {
    console.log('There is an error, ', error);
  }finally{
    // closing the browser
      setTimeout(async ()=>{

        await browser.close();
      },5000)
  }


}

init();

learningToWriteFile();
function learningToWriteFile(){
  let products =[
    {
      'name': "10gm 999.9 gold",
      'price': 80000
    }
  ];

  try {
    let sheet = xlsx.utils.json_to_sheet(products);
    let workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, sheet, 'sheet1');

      xlsx.writeFile(workbook, 'products.xlsx');
    
  } catch (error) {
    console.log('ERROR saving data into excel file. ', error);
  }

}


