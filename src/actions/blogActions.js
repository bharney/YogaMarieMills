import blogApi from '../API/mockBlogApi';

export function loadBlogSuccess(blogs) {
  return { type: 'LOAD_BLOG_SUCCESS', blogs };
}

export function createBlogSuccess(blog) {
  return { type: 'CREATE_BLOG_SUCCESS', blog };
}

export function updateBlogSuccess(blog) {
  return { type: 'UPDATE_BLOG_SUCCESS', blog };
}

export function deleteBlogSuccess() {
  return { type: 'DELETE_BLOG_SUCCESS' };
}

export function loadBlog() {
  return function (dispatch) {
    return blogApi.getAllBlogs().then(blogs => {
      dispatch(loadBlogSuccess(blogs));
    }).catch(error => {
      throw (error);
    });
  };
}

export function deleteBlog(blog) {
  return function (dispatch) {
    return blogApi.deleteBlog(blog).then(() => {
      dispatch(deleteBlogSuccess());
      return blogApi.getAllBlogs().then(blogs => {
        dispatch(loadBlogSuccess(blogs));
      });
    }).catch(error => {
      throw (error);
    });
  };
}

export function saveBlog(blog) {
  return function (dispatch) {
    return blogApi.saveBlog(blog).then(savedBlog => {
      blog.id ? dispatch(updateBlogSuccess(savedBlog)) :
        dispatch(createBlogSuccess(savedBlog));
    }).catch(error => {
      throw (error);
    });
  };
}
