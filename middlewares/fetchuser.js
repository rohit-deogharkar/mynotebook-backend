const jwt  = require('jsonwebtoken')
const jwtsecret = 'mysecret'

const fetchuser = (req, res , next)=>{
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error: 'Please authenticate using valid token'})
    }
    try {
        const data = jwt.verify(token, jwtsecret)
        id = data.id
        next() 
    } catch (error) {
        console.log(error)
        res.status(401).send({error: 'Please authenticate using valid token 2'})
    }
    
}

module.exports = fetchuser;