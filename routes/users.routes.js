const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../src/database');
const jwt = require('jsonwebtoken');
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

usersRoute.post('/login', (req, res) => {
    const {username, password} = req.body;

    let option = {
        expiresIn: "30d"
    }

    try {
        db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
            if (err) return res.status(500).json({error: err.message});
            
            if(user) {
                // console.log(user)
                let token = jwt.sign({userId: user.id}, process.env.HASH_PASS, option)
                // console.log(token)
                bcrypt.compare(password, user.password_hash, function(err, result) {
                    if(err) {
                        return res.json({
                            message: 'something went wrong'
                        })
                    }
                    if(result) {
                        res.status(201).json({
                            message: "user logged in successfully",
                            token: token
                        })
                    } else {
                        res.status(400).json({
                            message: "wrong password"
                        })
                    }
                })
            } else {
                return res.status(400).json({
                    message: 'user not exist, please register'
                })
            }
        });
    } catch (err) {
        res.json({
            message: err.message
        })
    }
});

module.exports = usersRoute
