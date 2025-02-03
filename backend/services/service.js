const Usermodel = require('../models/User.model');

module.exports.createUser = async ({
    firstname, lastname , email, password
})=>{
    if(!firstname || !email || !password){
        throw new Error('All fields are required');
    }
    const user = new Usermodel({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    });
    return user.save();
}