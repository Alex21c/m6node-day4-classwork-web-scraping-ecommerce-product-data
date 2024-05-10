import puppeteer from 'puppeteer';
import * as xlsx from 'xlsx';
// Product Name
// Price
// Availability (In Stock/Out of Stock)
// Product Rating (if available)

function storeProductsIntoExcelFile(products){
        // now i want to filter all those products whose name is empty
        products = products.filter(product=> product['Product Name'] !== '' && product['Product Name'] !== 'Check each product page for other buying options.'
       )
        console.log('products are ' , products);
      
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
}
async function init(){
  // requesting from amazon: gold coin 10gm 
  // let URL = 'https://alex21c.github.io/sampleScrapingData/20gmGoldBar.html';
  // macbook air
  // let URL = 'https://alex21c.github.io/sampleScrapingData/macbookAir.html';
  let URL = 'https://www.amazon.in/s?k=gold+coin+10gm&crid=1BB41V3YA4OAD&sprefix=gold+coin+10g%2Caps%2C220&ref=nb_sb_noss_1';

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

    // works well with gold & silver queries
      let products = await page.$$eval('div.a-section.a-spacing-base.a-text-center', e=>e.map((element)=>{
        let productName =  element.querySelector('span.a-size-base-plus.a-color-base.a-text-normal').textContent;
        let price = element.querySelector('span.a-price>span>span.a-price-whole');
        let availability =  'In Stock';
          if(price){
            price = Number(price.textContent.replaceAll(',', ""));
          }else{
            price = undefined;
            availability = 'Out of Stock';
          }
    

        let priceSymbol = element.querySelector('span.a-price>span>span.a-price-symbol');
        priceSymbol = priceSymbol ? priceSymbol.textContent : undefined;

        let brand = element.querySelector('h2.a-size-mini.s-line-clamp-1>span.a-size-base-plus.a-color-base').textContent;
        // let currencySymbol = element.querySelector('span.a-price-symbol').textContent;
        
        let rating = element.querySelector('a.a-popover-trigger.a-declarative>i.a-icon.a-icon-star-small.a-star-small-4-5.aok-align-bottom>span.a-icon-alt');
        rating = rating ? Number(rating.textContent.replace(' out of 5 stars', "")) : '';

        let totalReviews = element.querySelector('span.a-size-base.s-underline-text');
          totalReviews = totalReviews ? totalReviews.textContent : '';

        let mrp = element.querySelector('span.a-price.a-text-price>span.a-offscreen');
        mrp = mrp ? Number(mrp.textContent.replace('₹',"").replaceAll(',', "")) : undefined;  
    
          let product = {
            'Rating': rating,
            'TotalReviews': totalReviews,            
            'Availability (In Stock/Out of Stock)': availability,
            "Product Name" :  productName,
            'Currency': priceSymbol,
            "MRP": mrp, 
            "Price": price,           
            'Brand': brand
          };

        return product;


        
      }));

    if(products.length === 0 ){
      console.log('its empty')
      // 2nd approach: for macbook air like queries
      let products = await page.$$eval('div.s-result-item', e=>e.map((element)=>{
        let productName =  element.querySelector('span.a-text-normal');
        productName = productName ? productName.textContent : "";
        let price = element.querySelector('span.a-price>span>span.a-price-whole');
        let availability =  'In Stock';
          if(price){
            price = Number(price.textContent.replaceAll(',', ""));
          }else{
            price = undefined;
            availability = 'Out of Stock';
          }
    

        let priceSymbol = element.querySelector('span.a-price>span>span.a-price-symbol');
        priceSymbol = priceSymbol ? priceSymbol.textContent : undefined;

        let brand = element.querySelector('h2.a-size-mini.s-line-clamp-1>span.a-size-base-plus.a-color-base');
        brand = brand ? brand.textContent : "";
        
        
        let rating = element.querySelector('a.a-popover-trigger.a-declarative>i.a-icon.a-icon-star-small.a-star-small-4-5.aok-align-bottom>span.a-icon-alt');
        rating = rating ? Number(rating.textContent.replace(' out of 5 stars', "")) : '';

        let totalReviews = element.querySelector('span.a-size-base.s-underline-text');
          totalReviews = totalReviews ? totalReviews.textContent : undefined;
        
        let mrp = element.querySelector('span.a-price.a-text-price>span.a-offscreen');
        mrp = mrp ? Number(mrp.textContent.replace('₹',"").replaceAll(',', "")) : undefined;      
          let product = {
            'Rating': rating,
            'TotalReviews': totalReviews,
            'Availability (In Stock/Out of Stock)': availability,
            "Product Name" :  productName,
            'Currency': priceSymbol,
            "MRP": mrp, 
            "Price": price,           
            'Brand': brand
          };

        return product;


        
      }));



    }

    console.log('products are ' , products);
    storeProductsIntoExcelFile(products);



  
    
  } catch (error) {
    console.log('There is an error, ', error);
  }finally{
    // closing the browser
      setTimeout(async ()=>{

        await browser.close();
      },3000)
  }


}

init();

// learningToWriteFile();
// function learningToWriteFile(){
//   let products =[
//     {
//       'name': "10gm 999.9 gold",
//       'price': 80000
//     }
//   ];

//   try {
//     let sheet = xlsx.utils.json_to_sheet(products);
//     let workbook = xlsx.utils.book_new();
//       xlsx.utils.book_append_sheet(workbook, sheet, 'sheet1');

//       xlsx.writeFile(workbook, 'products.xlsx');
    
//   } catch (error) {
//     console.log('ERROR saving data into excel file. ', error);
//   }

// }


