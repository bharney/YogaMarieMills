import express from 'express';
import {secret} from '../../secrets';
import jwt from 'jwt-simple';
import moment from 'moment';
import { executeQuery } from '../sqlQuery';

let blogRoutes = function () {

    const blogRouter = express.Router();

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
            executeQuery(
                `INSERT INTO Blogs (title, short, description, image, href, type, component)
                 VALUES (@title, @short, @description, @image, '', 'blog', 'BlogPage');
                 SELECT SCOPE_IDENTITY() as id`,
                function (request, sql) {
                    request.input('title', sql.VarChar, blog.title);
                    request.input('short', sql.VarChar, blog.short);
                    request.input('description', sql.VarChar, blog.description);
                    request.input('image', sql.VarChar, blog.image);
                }
            ).then(function (recordset) {
                if (recordset && recordset.length > 0) {
                    blog.id = recordset[0].id;
                }
                blog.type = 'blog';
                blog.component = 'BlogPage';
                res.status(201).send(blog);
            }).catch(function (err) {
                console.log("blogs: " + err);
                res.status(500).send("Unable to save blog.");
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
            executeQuery(
                `UPDATE Blogs
                SET title = @title
                ,short = @short
                ,description = @description
                ,image = @image
                ,href = @href
                ,type = @type
                ,component = @component
                ,postDate = sysdatetimeoffset()
                WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, blog.id);
                    request.input('title', sql.VarChar, blog.title);
                    request.input('short', sql.VarChar, blog.short);
                    request.input('description', sql.VarChar, blog.description);
                    request.input('image', sql.VarChar, blog.image);
                    request.input('href', sql.VarChar, blog.href);
                    request.input('type', sql.VarChar, blog.type);
                    request.input('component', sql.VarChar, blog.component);
                }
            ).then(function () {
                res.status(201).send(blog);
            }).catch(function (err) {
                console.log("update blog: " + err);
                res.status(500).send("Unable to update blog.");
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
            executeQuery(
                `DELETE FROM Blogs
                 WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.body.id);
                }
            ).then(function () {
                res.status(201).send("Blog has been deleted.");
            }).catch(function (err) {
                console.log("delete blog: " + err);
                res.status(500).send("Unable to delete blog.");
            });
        })
        .get(function (req, res) {
            executeQuery(`SELECT id
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
                    res.status(500).send("Unable to load blogs.");
                });
        });

    blogRouter.route('/blogs/:blogId')
        .get(function (req, res) {
            executeQuery(`SELECT id
                            ,title
                            ,short
                            ,description
                            ,image
                            ,href
                            ,type
                            ,component
                            ,CONVERT(VARCHAR, postDate, 107) as postDate
                            FROM Blogs
                            WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.params.blogId);
                }
            ).then(function (recordset) {
                    if (recordset.length > 0) {
                        res.json(recordset);
                    }
                    else {
                        res.status(500).send("No Blog found with this ID.");
                    }
                }).catch(function (err) {
                    console.log("blog: " + err);
                    res.status(500).send("Unable to load blog.");
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
            executeQuery(
                `DELETE FROM Blogs
                 WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.params.blogId);
                }
            ).then(function () {
                res.status(201).send("Blog has been deleted.");
            }).catch(function (err) {
                console.log("delete blog: " + err);
                res.status(500).send("Unable to delete blog.");
            });
        });

    return blogRouter;
};

module.exports = blogRoutes;

export default blogRoutes;
