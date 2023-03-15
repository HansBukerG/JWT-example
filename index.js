import express from "express";
import jwt from "jsonwebtoken";
import { promisify } from "util";

const app = express();
const secretKey = 'Gatitos  bonitos'

app.get("/api", async (req,res) => {
    res.json(
        {
            message: "NodeJS and JWT"
        }
    )
})

app.post("/api/login", async (req,res) => {
    const user = {
        id:1,  
        user: "Hans",
        pwd: "12345",
        email: "hans@gmail.com"
    }
    try {
        const token = await promisify(jwt.sign)({user: user}, secretKey, {expiresIn: '20s'});
        res.json({token: token});
    } catch (error) {
        res.sendStatus(500);
    }
})

app.post("/api/posts", verifyToken, async (req,res) => {
    try {
        const authData = await promisify(jwt.verify)(req.token, secretKey);
        res.json({
            message: 'post was created',
            authData: authData
        });
    } catch (error) {
        res.sendStatus(403);
    }
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
