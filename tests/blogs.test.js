const pageFactory = require("./factories/page.factory");
const { mongoDisconnect } = require("./helpers/mongo");

let page;

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

describe("When not logged in", () => {
  const actions = [
    { 
      method: "post",
      path: "/api/blogs",
      data: { title: 'Unauthorized blog', content: 'Unauthorized content'}
    },
    { 
      method: "get",
      path: "/api/blogs"
    }
  ]

  test("Executing blog related APIs results in error", async () => {
    const results = await page.execRequests(actions);
    results.forEach(result => {
      expect(result).toEqual(expect.objectContaining({
        error: 'You must log in!'
      }));
    });
    // for(let i = 0; i < actions.length; i++) {
    //   const {method, path, data} = actions[i];
    //   const response = await page[method](path, data);
    //   expect(response).toEqual(expect.objectContaining({
    //     error: 'You must log in!'
    //   }));
    // }
  });    

  // test("Creating a post results in an error", async () => {
  //   const response = await page.post(
  //     '/api/blogs',
  //     { title: 'Unauthorized blog', content: 'Unauthorized content'}
  //   );

  //   expect(response).toEqual(expect.objectContaining({
  //     error: 'You must log in!'
  //   }));
  // });

  // test("Viewing a post results in an error", async () => {
  //   const response = await page.get('/api/blogs')

  //   expect(response).toEqual(expect.objectContaining({
  //     error: 'You must log in!'
  //   }));
  // });  
}) 

describe("When logged in", () => {
  beforeEach( async() => {
    //common setup - log in & go to blog creation form
    await page.login();
    await page.click(".fixed-action-btn a[href='/blogs/new'].btn-floating");
  });

  test("Can access Blog Create Form", async () => {
    //check url
    const pageUrl = await page.url();
    expect(pageUrl).toMatch(/\/blogs\/new/);  
  
    //check if new blog form appeared on the screen
    const text = await page.getContentsOf("form .title label");
    expect(text).toEqual("Blog Title");
  });  

  describe("When using invalid inputs", () => {
    beforeEach( async () => {
      //no inputs
      //submit
      await page.click("form button[type='submit']");
    });

    test("The form shows error message", async () => {
      const titleError = await page.getContentsOf("form .title .red-text");
      const contentError = await page.getContentsOf("form .content .red-text");
      expect(titleError).toEqual("You must provide a value");
      expect(contentError).toEqual("You must provide a value");
    });
  });

  describe("When using valid form inputs", () => {
    beforeEach( async () => {
      //valid inputs
      //await page.click("form input[names='title']");
      await page.type("form input[name='title']", "My test blog");
      //await page.click("form input[names='content']");
      await page.type("form input[name='content']", "My test blog content");
      //submit
      await page.click("form button[type='submit']");
    });

    test("Submitting takes user to review screen", async () => {
      const titleSaveBlog = await page.getContentsOf("form button.green");
      expect(titleSaveBlog).toMatch(/^Save Blog/);
      const confirmText = await page.getContentsOf("form h5");
      expect(confirmText ).toEqual("Please confirm your entries");
    });

    describe("Submitting then saving", () => {
      beforeEach( async() => {
        await Promise.all([
          page.click("form button.green"),
          page.waitForNavigation()
        ]);  
      })

      test("Adds blog to index page", async () => {
        //check url
        const pageUrl = await page.url();
        expect(pageUrl).toMatch(/\/blogs$/);       

        //check blog - should be only one card - we have a brand new user created by this test
        const title = await page.getContentsOf(".card-content span.card-title");
        const content = await page.getContentsOf(".card-content p");
        expect(title).toEqual("My test blog");
        expect(content).toEqual("My test blog content");
      });        
    }) 
  
  });  
})

// test.only("When logged in, can access Blog Create Form", async () => {
//   //login and navigate to /blogs  
//   await page.login();
  
//   //click ADD button
//   await page.click(".fixed-action-btn a[href='/blogs/new'].btn-floating");
//   const pageUrl = await page.url();
//   expect(pageUrl).toMatch(/\/blogs\/new/);  

//   //check if new blog form appeared on the screen
//   const text = await page.getContentsOf("form .title label");
//   expect(text).toEqual("Blog Title");
// });