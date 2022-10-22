const puppeteer = require('puppeteer');
const sessionFactory = require("../factories/session.factory");
const userFactory = require("../factories/user.factory");

class Page {
  async initialize() {
    this.browser = await puppeteer.launch({
      headless: false
    });
    this.page = await browser.newPage();   
  }
  
  static async build() {
    const page = new Page();
    await page.initialize();
    
    const proxyPage = new Proxy(page.page, {
      get: function(target, property) {
        console.log("T", property);
        return target[property] || target.page[property] || target.browser[property];
      }
    }); 
    
    return proxyPage;		
  }
} 
	
class CustomPage {
  constructor(browser, page) {
    this.browser = browser;
    this.page = page;
  }
  
  static async build() {
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();   

    const customPage = new CustomPage(browser, page);
    
    const proxyPage = new Proxy(customPage, {
      get: function(target, property) {
        const prop = target[property] || target.page[property] || target.browser[property];
        if(property.includes("goto"))
          console.log("PROP",property, prop);
        return prop;
      }
    }); 
    
    return proxyPage;		
  }
} 

class ExtendedPage {
  constructor(browser, page) {
    this.browser = browser;
    this.page = page;
  }
  
  static async build() {
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();   

    const extendedPage = new ExtendedPage(browser, page);
    
    return extendedPage;		
  }

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
  
    await this.page.setCookie({name: "session", value: session});
    await this.page.setCookie({name: "session.sig", value: sig});
    //refresh the page to send cookies to the server
    await this.page.goto('http://localhost:3000/');
    
    await this.page.waitForSelector(".nav-wrapper a[href='/auth/logout']", { timeout: 2000});    
  }
} 
	
module.exports = ExtendedPage;