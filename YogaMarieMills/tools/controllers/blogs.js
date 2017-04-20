import express from 'express';
import sql from 'mssql';
import secret from '../../secrets';
import jwt from 'jwt-simple';
import moment from 'moment';

let blogRoutes = function () {

    const blogRouter = express.Router();
    const dbconfig = "mssql://Application:!Testing123@BPHSERVER/YogaMarieMills";

    blogRouter.route('/blogs')
        .post(function (req, res) {
            if (!req.headers.authorization) {
                return res.status(401).send({ message: "You are not authorized" })
            }
            const authorization = JSON.parse(req.headers.authorization.slice(7));
            const payload = jwt.decode(authorization.token, secret);
            if (!payload.sub) {
                return res.status(401).send({ message: "You are not authorized" })
            }
            if (moment().unix() > payload.exp) {
                return res.status(401).send({ message: "You are not authorized" })
            }
            let blog = (req.body);
            const sqlInsertBlog = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlInsertBlog);
                request.input('title', sql.VarChar, blog.title);
                request.input('short', sql.VarChar, blog.short);
                request.input('description', sql.VarChar, blog.description);
                request.input('image', sql.VarChar, blog.image);
                request.query(
                    `INSERT INTO Blogs (title, short, description, image, href, type, component)
                     VALUES (@title, @short, @description, @image, '', 'blog', 'BlogPage');
                     SELECT SCOPE_IDENTITY() as id`
                ).then(function (recordset) {
                    blog.id = recordset[0].id;
                    blog.type = 'blog'
                    blog.component = 'BlogPage'
                    res.status(201).send(blog)
                }).catch(function (err) {
                    console.log("blogs: " + err);
                });
            });
        })
        .put(function (req, res) {
            if (!req.headers.authorization) {
                return res.status(401).send({ message: "You are not authorized" })
            }
            const authorization = JSON.parse(req.headers.authorization.slice(7));
            const payload = jwt.decode(authorization.token, secret);
            if (!payload.sub) {
                return res.status(401).send({ message: "You are not authorized" })
            }
            if (moment().unix() > payload.exp) {
                return res.status(401).send({ message: "You are not authorized" })
            }
            let blog = (req.body);
            const sqlUpdateBlog = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlUpdateBlog);
                request.input('id', sql.Int, blog.id);
                request.input('title', sql.VarChar, blog.title);
                request.input('short', sql.VarChar, blog.short);
                request.input('description', sql.VarChar, blog.description);
                request.input('image', sql.VarChar, blog.image);
                request.input('href', sql.VarChar, blog.href);
                request.input('type', sql.VarChar, blog.type);
                request.input('component', sql.VarChar, blog.component);
                request.query(
                    `UPDATE Blogs
                    SET title = @title
                    ,short = @short
                    ,description = @description
                    ,image = @image
                    ,href = @href
                    ,type = @type
                    ,component = @component
                    ,postDate = sysdatetimeoffset()
                    WHERE id = @id`
                ).then(res.status(201).send(blog)).catch(function (err) {
                    console.log("update blog: " + err);
                });
            });
        })
        .delete(function (req, res) {
            if (!req.headers.authorization) {
                return res.status(401).send({ message: "You are not authorized" })
            }
            const authorization = JSON.parse(req.headers.authorization.slice(7));
            const payload = jwt.decode(authorization.token, secret);
            if (!payload.sub) {
                return res.status(401).send({ message: "You are not authorized" })
            }
            if (moment().unix() > payload.exp) {
                return res.status(401).send({ message: "You are not authorized" })
            }
            const sqlDeleteBlog = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlDeleteBlog);
                request.input('id', sql.Int, req.body.id);
                request.query(
                    `DELETE FROM Blogs
                     WHERE id = @id`
                ).then(res.status(201).send("Blog has been deleted.")).catch(function (err) {
                    console.log("delete blog: " + err);
                });
            });
        })
        .get(function (req, res) {
            const sqlBlogs = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlBlogs);
                request.query(`SELECT id
                            ,title
                            ,short
                            ,description
                            ,image
                            ,href
                            ,type
                            ,component
                            ,CONVERT(VARCHAR, postDate, 107) as postDate
                            FROM Blogs
                            ORDER BY postDate DESC`
                ).then(function (recordset) {
                    res.json(recordset);
                }).catch(function (err) {
                    console.log("blogs: " + err);
                });
            });
        });

    blogRouter.route('/blogs/:blogId')
        .get(function (req, res) {
            const sqlBlog = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlBlog);
                request.input('id', sql.Int, req.params.blogId);
                request.query(`SELECT id
                            ,title
                            ,short
                            ,description
                            ,image
                            ,href
                            ,type
                            ,component
                            ,CONVERT(VARCHAR, postDate, 107) as postDate
                            FROM Blogs
                            WHERE id = @id`
                ).then(function (recordset) {
                    if (recordset.length > 0) {
                        res.json(recordset);
                    }
                    else {
                        res.status(500).send("No Blog found with this ID.");
                    }
                }).catch(function (err) {
                    console.log("blog: " + err);
                });
            });
        })
        .delete(function (req, res) {
            if (!req.headers.authorization) {
                return res.status(401).send({ message: "You are not authorized" })
            }
            const authorization = JSON.parse(req.headers.authorization.slice(7));
            const payload = jwt.decode(authorization.token, secret);
            if (!payload.sub) {
                return res.status(401).send({ message: "You are not authorized" })
            }
            if (moment().unix() > payload.exp) {
                return res.status(401).send({ message: "You are not authorized" })
            }
            const sqlDeleteBlog = new sql.Connection(dbconfig, function () {
                let request = new sql.Request(sqlDeleteBlog);
                request.input('id', sql.Int, req.params.blogId);
                request.query(
                    `DELETE FROM Blogs
                     WHERE id = @id`
                ).then(res.status(201).send("Blog has been deleted.")).catch(function (err) {
                    console.log("delete blog: " + err);
                });
            });
        });

    return blogRouter;
};

module.exports = blogRoutes;

export default blogRoutes;
