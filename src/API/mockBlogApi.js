import 'whatwg-fetch'
import { getToken } from '../actions/authTokenActions';

class BlogApi {
    static getAllBlogs() {
        return new Promise((resolve) => {
            fetch('http://localhost:3000/api/blogs').then(function (response) {
                return response.json();
            }).then(function (blogs) {
                resolve(Object.assign([], blogs));
            });
        });
    }

    static saveBlog(blog) {
        blog = Object.assign({}, blog);
        return new Promise((resolve, reject) => {
            const minBlogTitleLength = 1;
            if (blog.title.length < minBlogTitleLength) {
                reject(`Name must be at least ${minBlogTitleLength} characters.`);
            }

            if (blog.id) {
                fetch('http://localhost:3000/api/blogs', {
                    method: 'put',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + getToken()
                    },
                    body: JSON.stringify(blog)
                }).then(function (response) {
                    return response.json();
                }).then(function (blog) {
                    resolve(blog)
                }).catch(function (error) {
                    console.log('Request failed', error);
                });
            } else {
                fetch('http://localhost:3000/api/blogs', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + getToken()
                    },
                    body: JSON.stringify(blog)
                }).then(function (response) {
                    return response.json();
                }).then(function (blog) {
                    resolve(blog)
                }).catch(function (error) {
                    console.log('Request failed', error);
                });
            }
        });
    }

    static deleteBlog(blogId) {
        return new Promise((resolve) => {
            if (confirm("Are you sure you want to delete this blog forever?")) {
                if (blogId) {
                    fetch('http://localhost:3000/api/blogs/' + blogId, {
                        method: 'delete',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + getToken()
                        }
                    }).then(function () {
                        resolve(console.log("blog deleted."));
                    }).catch(function (error) {
                        console.log('Delete failed', error);
                    });
                }
            }
        });
    }
}

export default BlogApi;