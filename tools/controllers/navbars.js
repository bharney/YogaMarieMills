import express from 'express';
import {secret} from '../../secrets';
import jwt from 'jwt-simple';
import moment from 'moment';
import { executeQuery } from '../sqlQuery';

let navbarRoutes = function () {

    const navbarRouter = express.Router();

    navbarRouter.route('/navbars')
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
            let navbar_item = (req.body);
            executeQuery(
                `INSERT INTO Navbar_Items (type, name, route, href, parent_id)
                VALUES (@type, @name, @route, @href, @parent_id);`,
                function (request, sql) {
                    request.input('type', sql.VarChar, navbar_item.type);
                    request.input('name', sql.VarChar, navbar_item.name);
                    request.input('route', sql.VarChar, navbar_item.route);
                    request.input('href', sql.VarChar, navbar_item.href);
                    request.input('parent_id', sql.Int, navbar_item.parent_id);
                }
            ).then(function () {
                res.status(201).send(navbar_item);
            }).catch(function (err) {
                console.log("insert Navbar: " + err);
                res.status(500).send("Unable to save navbar item.");
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
            let navbar_item = (req.body);
            executeQuery(
                `UPDATE Navbar_Items
                 SET type = @type
                 , name = @name
                 , route = @route
                 , href = @href
                 WHERE id = @id;`,
                function (request, sql) {
                    request.input('id', sql.Int, navbar_item.id);
                    request.input('type', sql.VarChar, navbar_item.type);
                    request.input('name', sql.VarChar, navbar_item.name);
                    request.input('route', sql.VarChar, navbar_item.route);
                    request.input('href', sql.VarChar, navbar_item.href);
                    request.input('parent_id', sql.Int, navbar_item.parent_id);
                }
            ).then(function () {
                res.status(201).send(navbar_item);
            }).catch(function (err) {
                console.log("update Navbars: " + err);
                res.status(500).send("Unable to update navbar item.");
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
                `DELETE FROM Navbar_Items
                 WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.body.id);
                }
            ).then(function () {
                res.status(201).send("Navbar has been deleted.");
            }).catch(function (err) {
                console.log("delete Navbar: " + err);
                res.status(500).send("Unable to delete navbar item.");
            });
        })
        .get(function (req, res) {
            executeQuery(
                `SELECT id
                ,type
                ,name
                ,href
                ,route
                ,parent_id
                FROM Navbar_Items`
            ).then(function (recordset) {
                    let navbar_items = [];

                    for (let navbar_prop in recordset) {
                        if (recordset.hasOwnProperty(navbar_prop)) {
                            if (recordset[navbar_prop].parent_id == null) {
                                let submenu_items = [];
                                navbar_items.push({
                                    id: recordset[navbar_prop].id,
                                    name: recordset[navbar_prop].name,
                                    href: recordset[navbar_prop].href,
                                    route: recordset[navbar_prop].route,
                                    subMenu: submenu_items
                                });
                                for (let submenu_prop in recordset) {
                                    if (recordset.hasOwnProperty(submenu_prop)) {
                                        if (recordset[submenu_prop].parent_id != null) {
                                            if (recordset[navbar_prop].id == recordset[submenu_prop].parent_id) {
                                                submenu_items.push({
                                                    id: recordset[submenu_prop].id,
                                                    name: recordset[submenu_prop].name,
                                                    href: recordset[submenu_prop].href,
                                                    route: recordset[submenu_prop].route,
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    res.json(navbar_items);
                }).catch(function (err) {
                    console.log("navbars: " + err);
                    res.status(500).send("Unable to load navigation items.");
                });
        });

    navbarRouter.route('/navbars/:navbarId')
        .get(function (req, res) {
            executeQuery(`SELECT id
                                ,type
                                ,name
                                ,href
                                ,route
                                ,parent_id
                                FROM Navbar_Items
                                WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.params.navbarId);
                }
            ).then(function (recordset) {
                    if (recordset.length > 0) {
                        res.json(recordset);
                    }
                    else {
                        res.status(500).send("No Navbar found with this ID.");
                    }
                }).catch(function (err) {
                    console.log("Navbar: " + err);
                    res.status(500).send("Unable to load navbar item.");
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
                `DELETE FROM Navbar_Items
                 WHERE id = @id`,
                function (request, sql) {
                    request.input('id', sql.Int, req.params.navbarId);
                }
            ).then(function () {
                res.status(201).send("Navbar has been deleted.");
            }).catch(function (err) {
                console.log("delete Navbar: " + err);
                res.status(500).send("Unable to delete navbar item.");
            });
        });

    return navbarRouter
};

module.exports = navbarRoutes;

export default navbarRoutes;
