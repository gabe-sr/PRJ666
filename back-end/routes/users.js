//This allows you to pefrom CRUD operations on the User colections 
import express from 'express';
// const express = require("express")
import { User }  from '../models/userModel.js';
// const User = require("../models/userModel")
const router = express.Router();


// -------- ROUTES DEFINITIONS -------- //

// Get all users in DB
router.get('/', async (req,res) =>{
    try {
        const users = await User.find().sort({fist_name: 'desc'})
        res.send(users)
        //link to front end, sending object(array)
    } catch (err) {
        console.log(err)
    }
})

// Get one user by id
router.get('/:id', async (req,res) =>{
    try {
        console.log( JSON.stringify(req.params.id) )
        // const user = await User.findOne({ user_id: req.params.user_id })
        const user = await User.findById(req.params.id)
        res.send(user)
        //link to front end, sending object
        console.log(user)
    } catch (err) {
        console.log(err)
    }
})

// Get for edit route
router.get('/edit/:id', async (req,res)=>{
    const user = await User.findById(req.params.id)
    //link to front end, sending object
})

// Get one user by user_id (!=id) (WIP)
// router.get('/:first_name', async (req,res) =>{
//     try {
//         console.log( req.params.user_id )
//         // const user = await User.findOne({ user_id: req.params.user_id })
//         const user = await User.findOne( { first_name: req.params.first_name} ) //possible to search by name, but not by user_id
//         // res.send(user)
//         console.log(user)
//     } catch (err) {
//         console.log(err)
//     }
// })


// Add user to DB
// *temporary, for testing purposes. Should be added and validated from web form
router.post('/', async (req,res) =>{
    let user = new User({
        user_id : req.body.user_id,
        active : req.body.active,
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        loginStatus : req.body.loginStatus,
        crp_no : req.body.crp_no,
        email : req.body.email,
        phone : req.body.phone,
        address : req.body.address,
        dob : req.body.dob,
        password : req.body.password,
        dateCreated   : req.body.dateCreated,
        cpf_no : req.body.cpf_no,
        methodology : req.body.methodology
    })
    try {
        user = await user.save();
        res.redirect(`/users/${user._id}`); // temporary (after saving user in db exibit it (afterwards it will redirect to user area)
    } catch (err) {
        console.log(err)

    }
})

router.put('/:id', async (req,res)=>{
    try {
        let user = await User.findById(req.params.id)
        user.user_id = req.body.user_id,
        user.active = req.body.active,
        user.first_name = req.body.first_name,
        user.last_name = req.body.last_name,
        user.loginStatus = req.body.loginStatus,
        user.crp_no = req.body.crp_no,
        user.email = req.body.email,
        user.phone = req.body.phone,
        user.address = req.body.address,
        user.dob = req.body.dob,
        user.password = req.body.password,
        user.dateCreated   = req.body.dateCreated,
        user.cpf_no = req.body.cpf_no,
        user.methodology = req.body.methodology

        user = await user.save()
        res.redirect(`/users/${user._id}`)
    } catch (err) {
        console.log(err)
    }
})

export {router};