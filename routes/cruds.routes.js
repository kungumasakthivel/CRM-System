const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../src/database');
const crudsRoute = express.Router();
const userSchema = require('./validation/validation');
const {authenticator} = require('../middlewares/authenticator')
require('dotenv').config()


crudsRoute.post('/customers',authenticator, (req, res) => {
    let {user_id, name, email, phone, company} = req.body;
    const {error, value} = userSchema.validate({
        user_id,
        name,
        email,
        phone,
        company
    })

    if(error) {
        return res.status(404).json({
            message: error.details.map((err) => err.message)
        })
    }

    user_id, name, email, phone, company = value;

    try {
        db.get('SELECT * FROM users WHERE id = ?', [user_id], (err, user) => {
            if (err) return res.status(500).json({error: err.message});

            if(user) {
                const insertQuery = `
                INSERT INTO customers (user_id, name, email, phone, company)
                VALUES (?, ?, ?, ?, ?)
                `
                try {
                    db.run(insertQuery, [user_id, name, email, phone, company.company], (err) => {
                        if(err) {
                            return res.status(400).json({
                                message: 'error in insearting customer data ' + err
                            })
                        }

                        res.status(201).json({
                            id: this.lastID,
                            message: 'customer data created successfully'
                        })
                    })
                } catch (err) {
                    res.status(500).json({
                        message: 'error while doing cred operations'
                    })
                }
            } else {
                return res.status(400).json({
                    message: 'user not exist'
                })
            }
        });
    } catch (err) {
        res.status(500).json({
            message: 'Not created, Error: ' + err.message
        })
    }
});

crudsRoute.get('/customers', authenticator, (req, res) => {
    const {limit=5, offset=0} = req.query;
    db.all(`SELECT * FROM customers LIMIT ? OFFSET ?`,[parseInt(limit), parseInt(offset)], (err, rows) => {
        if(err) {
            return res.status(500).json({
                message: 'error in getting customers'
            })
        }
        res.status(200).json(rows);
    })
});

crudsRoute.put('/customers/:id', (req, res) => {

    const { id } = req.params;

    let {user_id, name, email, phone, company} = req.body;
    const {error, value} = userSchema.validate({
        user_id,
        name,
        email,
        phone,
        company
    })

    if(error) {
        return res.status(404).json({
            message: error.details.map((err) => err.message)
        })
    }

    user_id, name, email, phone, company = value;

    try {
        db.get('SELECT * FROM customers WHERE id = ?', [id], (err, user) => {
            if (err) return res.status(500).json({error: err.message});

            if(user) {
                const updateQuery = `
                UPDATE customers SET user_id = ?, name =?, email = ?, phone = ?, company = ?
                WHERE id = ?
                `
                try {
                    db.run(updateQuery, [user_id, name, email, phone, company.company, id], (err) => {
                        if(err) {
                            return res.status(400).json({
                                message: 'error in insearting customer data ' + err
                            })
                        }

                        res.status(201).json({
                            message: 'customer data updated successfully'
                        })
                    })
                } catch (err) {
                    res.status(500).json({
                        message: 'error while doing updaing operations'
                    })
                }
            } else {
                return res.status(400).json({
                    message: 'customer not exist with customer id: ' + id
                })
            }
        })
    } catch (err) {
        res.status(500).json({
            message: 'Not updated, Error: ' + err.message
        })
    }
});

crudsRoute.delete('/customers/:id', authenticator, (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "Invalid or missing ID parameter" });
    }
    const checkQuery = "SELECT * FROM customers WHERE id = ?"
    const deleteQuery = "DELETE FROM customers WHERE id = ?";

    db.get(checkQuery, [id], (err, user) => {
        if (err) 
        return res.status(500).json({ message: 'error in getting customers records' });
        
        if(user) {
            db.run(deleteQuery, [id], (err) => {
                if(err) {
                    return res.status(500).json({
                        message: 'not deleted error: ' + err
                    })
                }
                res.status(200).json({
                    message: `record deleted with id ${id}`
                })
            })
        } else {
            return res.status(404).json({
                message: `user not found with id ${id}`
            })
        }
    })
});

module.exports = crudsRoute