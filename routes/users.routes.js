const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../src/database');
const usersRoute = express.Router();
require('dotenv').config()

console.log(process.env.HASH_COUNT)

usersRoute.post('/register', (req, res) => {
    const {username, password} = req.body;
    
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err) return res.status(500).json({error: err.message});
        
        if(user) {
            return res.status(400).json({
                message: 'user already exists'
            })
        }
    });

    if(username === undefined || password === undefined) {
        return res.status(400).json({
            message: 'username or password or both may be not defined!'
        })
    }

    if(username.length === 0 || password.length === 0) {
        return res.status(400).json({
            message: "username or password is empty"
        })
    }

    bcrypt.hash(password, Number(process.env.HASH_COUNT), async function(err, hash) {
        if(err) {
            return res.status(500).json({
                message: 'something went wrong'
            })
        }

        try {
            db.run(`INSERT INTO users (username, password_hash) VALUES (?, ?)`,
                [username, hash],
                function(err) {
                    if(err) {
                        return res.status(400).json({
                            message: 'user not created: error'
                        });
                    }

                    res.status(201).json({
                        id: this.lastID,
                        message: 'user created successfully'
                    })

                }
            )
        } catch(err) {
            res.send({
                message: err.message
            })
        }
    })

});

module.exports = usersRoute
