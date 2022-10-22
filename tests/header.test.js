//const puppeteer = require('puppeteer');
// const sessionFactory = require("./factories/session.factory");
// const userFactory = require("./factories/user.factory");
const { mongoDisconnect } = require("./helpers/mongo");
const pageFactory = require("./factories/page.factory");

let page;
//const userId = "634f070ba5ffcb2e7090ddf3";
// beforeAll(async () => {
//   await mongoConnect();
// });

afterAll(async () => {
  await mongoDisconnect(); 
});

beforeEach( async () => {
  page = await pageFactory();
  await page.goto('http://localhost:3000/');
})

afterEach(async () => {
  await page.browser.close();
})

test("Header contains Blogster logo text", async () => {
  const text = await page.getContentsOf(".nav-wrapper a.brand-logo");
  //const text = await page.$eval(".nav-wrapper a.brand-logo", el => el.innerHTML);
  expect(text).toEqual("Blogster")
});

test("Clicking 'Login' starts OAuth flow", async () => {
  await page.click(".nav-wrapper a[href='/auth/google']");
  //assert that the redirect url contains accounts.google.com
  const pageUrl = await page.url();
  //console.log(pageUrl);
  expect(pageUrl).toMatch(/accounts\.google\.com/);
  //expect(pageUrl).toEqual(expect.stringContaining("accounts.google.com"));
});

test("When signed in shows logout button", async () => {
  await page.login();
  
  //const text = await page.$eval(".nav-wrapper a[href='/auth/logout']", el => el.innerHTML);
  const text = await page.getContentsOf(".nav-wrapper a[href='/auth/logout']");
  expect(text).toEqual("Logout");
});

