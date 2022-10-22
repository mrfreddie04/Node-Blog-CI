const puppeteer = require('puppeteer');
const sessionFactory = require("./session.factory");
const userFactory = require("./user.factory");

async function pageFactory() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();   
  
  page.browser = browser;
  page.login = login;//.bind(page);
  page.getContentsOf = getContentsOf;
  page.get = get;
  page.post = post;  
  page.execRequests = execRequests;

  return page;
}

async function login() {
  const user = await userFactory();
  const { session, sig } = sessionFactory(user);

  //const pageUrl = await page.url();

  await this.setCookie({name: "session", value: session});
  await this.setCookie({name: "session.sig", value: sig});
  //refresh the page to send cookies to the server & redirect to properpages - as per our app logic
  await this.goto('http://localhost:3000/blogs');
  
  await this.waitForSelector(".nav-wrapper a[href='/auth/logout']", { timeout: 2000});   
  //await this.goto('http://localhost:3000/blogs'); 
  //await this.goto(pageUrl); //redirect to the originally requested page
}

async function getContentsOf(selector) {
  return this.$eval(selector, el => el.innerHTML);
}

async function get(path) {
  return this.evaluate((_path) => {
    return fetch(_path, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => res.json());      
  },path);
}

async function post( path, data = {}) {
  return this.evaluate((_path, _data) => {
    return fetch(_path, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(_data)
    }).then(res => res.json());      
  }, path, data)  
}

async function execRequests(actions) {
  return await Promise.all(
    actions.map(({method, path, data}) => {
      return this[method](path, data);
    })
  );
}

module.exports = pageFactory;