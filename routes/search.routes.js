const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../src/database');
const searchRoute = express.Router();
const {authenticator} = require('../middlewares/authenticator');
const { message } = require('./validation/validation');
require('dotenv').config()

searchRoute.get("/search", authenticator, (req, res) => {
    const {query} = req.query;

    if(!query) {
        return res.status(4000).json({message: 'error in query parameter (required)'})
    }

    const searchQuery = `
        SELECT * FROM customers WHERE name LIKE ? OR
        email LIKE ? OR phone LIKE ?
    `
    const queryParam = `%${query}%`

    db.all(searchQuery, [queryParam, queryParam, queryParam], (err, rows) => {
        if(err) {
            return res.status(500).json({
                message: 'error in executing search query, error: ' + err 
            })
        }

        return res.status(200).json({
            rows
        })
    })
});

searchRoute.get('/search-company',authenticator, (req, res) => {
    const {company} = req.query;
    console.log(company)

    if(!company) {
        return res.status(4000).json({message: 'error in query parameter company(required)'})
    }

    const searchCmpQuery = `
        SELECT * FROM customers WHERE company LIKE ?
    `
    const queryParam = `%${company}%`

    db.all(searchCmpQuery, [queryParam], (err, rows) => {
        if(err) {
            return res.status(500).json({
                message: 'error in executing search company query, error: ' + err 
            })
        }

        return res.status(200).json({
            rows
        })
    })

})

module.exports = searchRoute
