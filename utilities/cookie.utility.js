import jwt from "jsonwebtoken"

export const genrateToken = (tokenData) =>{
    return jwt.sign(
        {_id:tokenData}, 
        process.env.JWT_SECRETE, {
        expiresIn: process.env.JWT_EXPIRES,
    });
}
