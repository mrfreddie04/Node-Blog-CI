import axios from 'axios';
import { FETCH_USER, FETCH_BLOGS, FETCH_BLOG } from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitBlog = (values, file, navigate) => async dispatch => {
  //get presigned URL for the image
  const ext = file.name.split(".").pop();
  const uploadConfig = await axios.post('/api/upload', {type: file.type, ext: ext});
  const { url, key } = uploadConfig.data;

  //upload image to AWS
  const upload = await axios.put(url, file, {
    headers: {
      'Content-Type': file.type
    }
  });

  //add blog to the DB
  const res = await axios.post('/api/blogs', {...values, imageUrl: key});

  //console.log("Blog posted", res.data);

  navigate('/blogs');
  dispatch({ type: FETCH_BLOG, payload: res.data });
};

export const fetchBlogs = () => async dispatch => {
  const res = await axios.get('/api/blogs');

  dispatch({ type: FETCH_BLOGS, payload: res.data });
};

export const fetchBlog = id => async dispatch => {
  const res = await axios.get(`/api/blogs/${id}`);

  dispatch({ type: FETCH_BLOG, payload: res.data });
};
