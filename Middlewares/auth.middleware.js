import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
import jwt from 'jsonwebtoken'

export const isAuthenticated = asyncHandler(async(req, res, next) =>{
    const token = req.cookies.token || req.headers['authorization']?.replace("Bearer ", "");

    if(!token){
        return next(new errorHandler("Session Expires", 401));
    }
    
    const tokenData = jwt.verify(token, process.env.JWT_SECRETE);
    req.user = tokenData;

    next();
});