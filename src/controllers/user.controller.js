import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser=asyncHandler( async(req, res)=>{
    // get user data through frontend
    // validate whether required field are not empty
    // check if the user already exists: username, email
    // check for images, avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation (not null)
    // return resbody

    const {fullName, email, userName, password}=req.body
    console.log("email:", email);

    // if(
    //     [fullName, email, userName, password].some((field) =>
    //     field?.trim()==="")
    // ) {
    //     throw new ApiError(400, "All fields are required")
    // }

    if(fullName==="")
    {
        throw new ApiError(400, "Fullname is required")
    }
    else if(email==="")
    {
        throw new ApiError(400, "Email is required")
    }
    else if(!email.includes("@") || !email.includes("."))
    {
        throw new ApiError(400, "Invalid email")
    }
    
    else if(userName===""){
        throw new ApiError(400, "Username is required")
    }
    else if(password==="")
    {
        throw new ApiError(400, "password is required")
    }

    const existedUser=await User.findOne({
        $or: [{userName}, {email}]
    })
    if(existedUser)
    {
        throw new ApiError(409, "User with username or email already exist")
    }

    console.log(req.files)
    const avatarLocalPath=req.files?.avatar?.[0]?.path.replace(/\\/g, "/");
    const coverImageLocalPath=req.files?.coverImage?.[0]?.path.replace(/\\/g, "/");

    // let coverImageLocalPath;
    // if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0)
    // {
    //     coverImageLocalPath=req.files.coverImage[0].path
    // }

    if(!avatarLocalPath)
    {
        console.log("CHECK FAILED");
        throw new ApiError(400, "Avatar is required");
    }

    const avatar= await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar)
    {
        throw new ApiError(400, "Avatar file is required")
    }

    const user= await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser)
    {
        throw new ApiError(500, "Something went wrong while creating a new user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})  

export {registerUser}