'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mssql = require('mssql');

var _mssql2 = _interopRequireDefault(_mssql);

var _secrets = require('../secrets');

var _secrets2 = _interopRequireDefault(_secrets);

var _jwtSimple = require('jwt-simple');

var _jwtSimple2 = _interopRequireDefault(_jwtSimple);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var blogRoutes = function blogRoutes() {

    var blogRouter = _express2.default.Router();
    var dbconfig = "mssql://yogamariemills:!Testing123@yogamariemills.database.windows.net/YogaMarieMills?encrypt=true";

    blogRouter.route('/blogs').post(function (req, res) {
        if (!req.headers.authorization) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        var authorization = JSON.parse(req.headers.authorization.slice(7));
        var payload = _jwtSimple2.default.decode(authorization.token, _secrets2.default);
        if (!payload.sub) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        if ((0, _moment2.default)().unix() > payload.exp) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        var blog = req.body;
        var sqlInsertBlog = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlInsertBlog);
            request.input('title', _mssql2.default.VarChar, blog.title);
            request.input('short', _mssql2.default.VarChar, blog.short);
            request.input('description', _mssql2.default.VarChar, blog.description);
            request.input('image', _mssql2.default.VarChar, blog.image);
            request.query('INSERT INTO Blogs (title, short, description, image, href, type, component)\n                     VALUES (@title, @short, @description, @image, \'\', \'blog\', \'BlogPage\');\n                     SELECT SCOPE_IDENTITY() as id').then(function (recordset) {
                blog.id = recordset[0].id;
                blog.type = 'blog';
                blog.component = 'BlogPage';
                res.status(201).send(blog);
            }).catch(function (err) {
                console.log("blogs: " + err);
            });
        });
    }).put(function (req, res) {
        if (!req.headers.authorization) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        var authorization = JSON.parse(req.headers.authorization.slice(7));
        var payload = _jwtSimple2.default.decode(authorization.token, _secrets2.default);
        if (!payload.sub) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        if ((0, _moment2.default)().unix() > payload.exp) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        var blog = req.body;
        var sqlUpdateBlog = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlUpdateBlog);
            request.input('id', _mssql2.default.Int, blog.id);
            request.input('title', _mssql2.default.VarChar, blog.title);
            request.input('short', _mssql2.default.VarChar, blog.short);
            request.input('description', _mssql2.default.VarChar, blog.description);
            request.input('image', _mssql2.default.VarChar, blog.image);
            request.input('href', _mssql2.default.VarChar, blog.href);
            request.input('type', _mssql2.default.VarChar, blog.type);
            request.input('component', _mssql2.default.VarChar, blog.component);
            request.query('UPDATE Blogs\n                    SET title = @title\n                    ,short = @short\n                    ,description = @description\n                    ,image = @image\n                    ,href = @href\n                    ,type = @type\n                    ,component = @component\n                    ,postDate = sysdatetimeoffset()\n                    WHERE id = @id').then(res.status(201).send(blog)).catch(function (err) {
                console.log("update blog: " + err);
            });
        });
    }).delete(function (req, res) {
        if (!req.headers.authorization) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        var authorization = JSON.parse(req.headers.authorization.slice(7));
        var payload = _jwtSimple2.default.decode(authorization.token, _secrets2.default);
        if (!payload.sub) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        if ((0, _moment2.default)().unix() > payload.exp) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        var sqlDeleteBlog = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlDeleteBlog);
            request.input('id', _mssql2.default.Int, req.body.id);
            request.query('DELETE FROM Blogs\n                     WHERE id = @id').then(res.status(201).send("Blog has been deleted.")).catch(function (err) {
                console.log("delete blog: " + err);
            });
        });
    }).get(function (req, res) {
        var sqlBlogs = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlBlogs);
            request.query('SELECT id\n                            ,title\n                            ,short\n                            ,description\n                            ,image\n                            ,href\n                            ,type\n                            ,component\n                            ,CONVERT(VARCHAR, postDate, 107) as postDate\n                            FROM Blogs\n                            ORDER BY postDate DESC').then(function (recordset) {
                res.json(recordset);
            }).catch(function (err) {
                console.log("blogs: " + err);
            });
        });
    });

    blogRouter.route('/blogs/:blogId').get(function (req, res) {
        var sqlBlog = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlBlog);
            request.input('id', _mssql2.default.Int, req.params.blogId);
            request.query('SELECT id\n                            ,title\n                            ,short\n                            ,description\n                            ,image\n                            ,href\n                            ,type\n                            ,component\n                            ,CONVERT(VARCHAR, postDate, 107) as postDate\n                            FROM Blogs\n                            WHERE id = @id').then(function (recordset) {
                if (recordset.length > 0) {
                    res.json(recordset);
                } else {
                    res.status(500).send("No Blog found with this ID.");
                }
            }).catch(function (err) {
                console.log("blog: " + err);
            });
        });
    }).delete(function (req, res) {
        if (!req.headers.authorization) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        var authorization = JSON.parse(req.headers.authorization.slice(7));
        var payload = _jwtSimple2.default.decode(authorization.token, _secrets2.default);
        if (!payload.sub) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        if ((0, _moment2.default)().unix() > payload.exp) {
            return res.status(401).send({ message: "You are not authorized" });
        }
        var sqlDeleteBlog = new _mssql2.default.Connection(dbconfig, function () {
            var request = new _mssql2.default.Request(sqlDeleteBlog);
            request.input('id', _mssql2.default.Int, req.params.blogId);
            request.query('DELETE FROM Blogs\n                     WHERE id = @id').then(res.status(201).send("Blog has been deleted.")).catch(function (err) {
                console.log("delete blog: " + err);
            });
        });
    });

    return blogRouter;
};

module.exports = blogRoutes;

exports.default = blogRoutes;