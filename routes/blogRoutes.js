const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const cleanCache  = require("../middlewares/cleanCache");

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    const userId = req.user.id;
    // const cachedBlogs = await client.get(userId);

    // if(cachedBlogs) {
    //   console.log("From Cache");
    //   return res.send(JSON.parse(cachedBlogs));
    // } 

    // console.log("From DB");
    const blogs = await Blog
      .find({ _user: userId })
      .cache({ key: userId});

    res.send(blogs);
    //await client.set(userId, JSON.stringify(blogs));
    
  });

  app.post('/api/blogs', requireLogin, cleanCache, async (req, res) => {
    const userId = req.user.id;
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: userId
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
