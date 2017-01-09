import blogApi from '../API/mockBlogApi';

export function loadBlogSuccess(blogs) {
    return { type: 'LOAD_BLOG_SUCCESS', blogs};
}

export function loadBlog() {
    return function (dispatch) {
        return blogApi.getAllBlogs().then(blogs => {
            dispatch(loadBlogSuccess(blogs));
    }).catch(error => {
      throw(error);
    });
  };
}
