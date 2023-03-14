import express from "express";
import jwt from "jsonwebtoken";

const app = express();
const secretKey = 'Gatitos  bonitos'

app.get("/api", (req,res) => {
    res.json(
        {
            message: "NodeJS and JWT"
        }
    )
})

app.post("/api/login", (req,res) => {

    const user = {
        id:1,  
        user: "Hans",
        pwd: "12345",
        email: "hans@gmail.com"
    }

    jwt.sign({user: user} ,secretKey, {expiresIn: '20s'}, (err,token) => {
        res.json({
            token: token, 
        })
    })   
})

app.post("/api/posts", verifyToken,(req,res) => {
    jwt.verify(req.token, secretKey, (error, authData) => {
        if (error) {
            res.sendStatus(403)
        }else{
            res.json({
                message: 'post was created',
                authData: authData
            })
        }
    })
    
})

// Authorization: Bearer <token>
function verifyToken (req,res, next) {
    const bearerHeader =  req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(" ")[1]
        req.token = token
        next();
    }else{
        res.sendStatus(403)
    }
}

app.listen(3000, () => {
    console.log(`Rest ready to listen in port 3000`);
})