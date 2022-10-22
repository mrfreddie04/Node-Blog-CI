// const Page = require("./page");

// const test = async () => {
//   const page = await Page.build();
//   //console.log(page.goto)
//   await page.goto('http://localhost:3000/');
// }

// test();
// class Greetings {
//   french() {return "bonjour"}
//   english() {return "hello"}
// }

// class MoreGreetings {
//   german() {return "hallo"}
//   spanish() {return "hola!"}
// }

// const greetings = new Greetings();
// const moreGreetings = new MoreGreetings();

// const proxy = new Proxy(moreGreetings, {
//   get: function(target, property) {
//     console.log("T",target,property)
//     return target[property] || greetings[property]
//   }
// }) 

// // proxy.english;
// // proxy.spanish;
// console.log(proxy.english);
// console.log(proxy.spanish);
// // console.log(proxy.english());
// // console.log(proxy.spanish());
