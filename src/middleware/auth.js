const jwt = require('jsonwebtoken')
const {users} = require('../models/user')

//Authenitcate user
const auth = async (req, res, next) =>{
    try {
        const token = req.cookies['auth_token']
        const decoded = jwt.verify(token, 'sahbakfheb382392nufjdknd3ud3dnjdd')

        const user = await users.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.redirect('/login')
        //res.status(401).send({error: "Please authenticate"})
    }
}
module.exports = auth