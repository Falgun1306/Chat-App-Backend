import User from '../Models/user.model.js';
import { asyncHandler } from '../utilities/asyncHandler.utility.js';
import { genrateToken } from '../utilities/cookie.utility.js';
import { errorHandler } from '../utilities/errorHandler.utility.js';
import bcrypt from "bcryptjs";


//we can handle manually error and success for register post request we can use utilities to handle asynchronize tasks
// export const register = (req, res, next) =>{
//     try{
//         const {fullName, username, password, gender} = req.body;
        
//         if(!fullName || !username || !password || !gender){
//             res.status(400).json({
//                 success: false,
//                 message: "all fields are required"
//             })
//         }
//         console.log(fullName, username, password, gender);
//         res.send("success");
//     }catch(error){
//         console.log(error);
        
//     }
// }

export const register = asyncHandler(async(req, res, next)=>{
    const {fullName, username, password, confirmPassword, gender} = req.body;

    if(!fullName || !username || !password || !gender || !confirmPassword){
        return next(new errorHandler("All fields are required", 400));
    }

    if(password !== confirmPassword){
        return next(new errorHandler("password not matched", 400));
    }

    //checking for unique username
    const user = await User.findOne({username});
    if(user){
        return next(new errorHandler("User already exist", 400));
    }

    const avatarType = gender === "male" ? "boy" : "girl";
    const avatar = `https://avatar.iran.liara.run/public/${avatarType}?username=${username}`;

    const hashedPassword = await bcrypt.hash(password,10);//10 rounds of hashing


    //creating user on mongoDB
    const newUser = await User.create({
        fullName,
        username,
        password: hashedPassword,
        confirmPassword: hashedPassword,
        gender,
        avatar
    });

    //now we creating auth cookies for the security and flexibility(stayed log in for perticular time)
    const token = genrateToken(newUser._id);

    res
    .status(201)
    .cookie("token", token,{// sending the token to decode
        httpOnly: true, //The cookie cannot be accessed from JavaScript (document.cookie).Protects against XSS (Cross-Site Scripting) attacks. Always true for auth cookies like JWTs.
        sameSite: "none",//Controls when the cookie is sent in cross-site requests.
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 60 * 60 * 24 * 1000),
        secure: true,
    })
    .json({
        success: true,
        message: "User created successfully",
        responseData:{
            newUser, 
            token
        }
    });
});

export const login = asyncHandler(async(req, res, next)=>{
    const {username, password} = req.body;

    const user = await User.findOne({username});
    if(!user){
        return next(new errorHandler("please enter valid username or password", 400));
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword){
        return next(new errorHandler("please enter valid username or password", 400));
    }

    const token = genrateToken(user?._id);     

    res.status(200)
    .cookie("token", token,{
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 60 * 60 * 24 * 1000),
        
    })
    .json({
        success: true,
        responseData: {
            user,
            token
        }
    })
});

export const logout = asyncHandler(async(req, res, next)=>{
    res
    .status(200)
    .cookie("token", "",{
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    .json({
        success: true,
        message: "logout successful!"
    })
})

export const getProfile = asyncHandler(async(req, res, next)=>{
    // console.log(req.user);
    const userId = req.user._id;
    // console.log(userId);

    const profile = await User.findById(userId);

    res
    .status(200)
    .json({
        success: true,
        responseData:{
            profile,
        }
    });
});

export const otherUsers = asyncHandler(async(req, res, next)=>{
    const otherUser = await User.find({_id: {$ne: req.user._id}});
    // console.log(otherUser);
    
    //$ne = not equal to 

    res
    .status(200)
    .json({
        responseData: otherUser,
    })
});