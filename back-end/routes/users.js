//This allows you to pefrom CRUD operations on the User colections 
import express from 'express';
import { User }  from '../models/userModel.js';
const router = express.Router();


// -------- ROUTES DEFINITIONS -------- //

// Get all users in DB
router.get('/', (req, res) => {
    User.find()
         .then(users => res.json(users))
         .catch( e => res.status(400).json('There was an error:' + e));
});


// Add user to DB
// *temporary, for testing purposes. Should be added and validated from web form
router.route('/add_user').post((req, res) => {

    const errors = [];

    const newUser = new User({
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
    });

    newUser.save()
        .then( () => res.json('New user added into DB.'))
        .catch( e => res.status(400).json('There was an error:' + e));

});

export {router};