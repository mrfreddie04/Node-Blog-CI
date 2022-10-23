import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchBlog } from '../../actions';

const BlogShow = ({ blogs, fetchBlog }) => {
  const { _id } = useParams();
  const { title, content, imageUrl } = blogs[_id];
  
  useEffect(() => {
    fetchBlog(_id);
  }, [fetchBlog, _id]);

  const renderImage = () => {
    if(imageUrl) {
      return <img src={`https://mct-node-blog-bucket.s3.amazonaws.com/${imageUrl}`} />
    }
  }
  
  return (
    blogs[_id] &&
      <div>
        <h3>{title}</h3>
        <p>{content}</p>
        {renderImage()}
      </div>
  );
}

function mapStateToProps({ blogs }, ownProps) {
  return { blogs };
}

export default connect(mapStateToProps, { fetchBlog })(BlogShow);
