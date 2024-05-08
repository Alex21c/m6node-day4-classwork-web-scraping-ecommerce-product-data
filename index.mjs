import puppeteer from 'puppeteer';
// Product Name
// Price
// Availability (In Stock/Out of Stock)
// Product Rating (if available)


async function init(){
  let URL = 'https://alex21c.github.io/sampleScrapingData/20gmGoldBar.html';
  const browser = await puppeteer.launch({headless: true});
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
      priceSymbol = priceSymbol ? price.textContent : undefined;

      let brand = element.querySelector('h2.a-size-mini.s-line-clamp-1>span.a-size-base-plus.a-color-base').textContent;
      // let currencySymbol = element.querySelector('span.a-price-symbol').textContent;
      let rating = element.querySelector('a.a-popover-trigger.a-declarative>i.a-icon.a-icon-star-small.a-star-small-4-5.aok-align-bottom>span.a-icon-alt');
      rating = rating ? rating.textContent : undefined;
      let mrp = element.querySelector('span.a-price.a-text-price>span.a-offscreen');
      mrp = mrp ? mrp.textContent : undefined;      
        let product = {
          productName,
          brand,
          rating,
          mrp,
          price,
          priceSymbol

        };

      return product;


      
    }));

    console.log(products)

    //work on currency symbol onwards

    
    
    

      
    
  } catch (error) {
    console.log('There is an error, ', error);
  }finally{
    // closing the browser
      setTimeout(async ()=>{

        await browser.close();
      },500)
  }


}

init();


