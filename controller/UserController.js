const User = require("../model/UserModel")
const bcryptjs = require("bcryptjs")
const generatedAccessToken = require("../utils/generatedAccessToken")
const generatedRefreshToken = require("../utils/generatedRefreshToken")
const jwt = require("jsonwebtoken")
const generatedOtp = require("../utils/generatedOtp")
const sendEmailUser = require("../config/sendEmail")
const forgotPasswordTemplate = require("../utils/forgotPasswordTemplate")


exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)
        const user = await User.create({
            name,
            email,
            password: hashPassword
        })
        res.status(201).json({
            success: true,
            user
        })
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            message: error.message
        }
        )
    }
}


exports.loginController=async (req,res) => {
    try {
        const { email , password } = req.body


        if(!email || !password){
            return res.status(400).json({
                message : "provide email, password",
                error : true,
                success : false
            })
        }

        const user = await User.findOne({ email })

        if(!user){
            return res.status(400).json({
                message : "User not register",
                error : true,
                success : false
            })
        }

        // if(user.status !== "Active"){
        //     return res.status(400).json({
        //         message : "Contact to Admin",
        //         error : true,
        //         success : false
        //     })
        // }

        const checkPassword = await bcryptjs.compare(password,user.password)

        if(!checkPassword){
            return res.status(400).json({
                message : "Check your password",
                error : true,
                success : false
            })
        }

        const accesstoken = await generatedAccessToken(user._id)
        const refreshToken = await generatedRefreshToken(user._id)

        const updateUser = await User.findByIdAndUpdate(user?._id,{
            last_login_date : new Date()
        })

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }
        res.cookie('accessToken',accesstoken,cookiesOption)
        res.cookie('refreshToken',refreshToken,cookiesOption)

        return res.json({
            message : "Login successfully",
            error : false,
            success : true,
            data : {
                accesstoken,
                refreshToken
            }
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

exports.updateuserDetails = async (req, res) => {
    try {
        const userId = req.userId
        const { name, email, mobile, password } = req.body

        let hashPassword = ""
        if (password) {
            const salt = await bcryptjs.genSalt(10)
            const hashPassword = await bcryptjs.hash(password, salt)
        }
        const updateUser = await User.updateOne({ _id: userId }, {
            ...(name && { name: name }),
            ...(email && { email: email }),
            ...(mobile && { mobile: mobile }),
            ...(password && { password: hashPassword })
        })

        return res.json({
            message: " updated user successfully",
            error: false,
            success: true,
            data: updateUser

        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

exports.forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;
        const opt = generatedOtp();
        // const expireTime = new Date() + 60 * 60 * 1000;
        const expireTime = new Date(Date.now() + 60 * 1000); // 1 minute = 60 seconds


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            });
        }

        await User.findByIdAndUpdate(user._id, {
            forgot_password_otp: opt,
            forgot_password_expiry: new Date(expireTime).toISOString()
        });

        console.log(user.name, opt);

        const data = {
            name: user.name,
            otp: opt
        };

        await sendEmailUser({
            sendTo: email,
            subject: "Forgot password from App",
            html: forgotPasswordTemplate(data)
        });

        return res.status(200).json({
            message: "OTP sent successfully",
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


exports.veriftyForgotPasswordOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Provide required field email,otp",
                error: true,
                success: false
            })
        }

        // Fix: use proper syntax for findOne
        const user = await User.findOne({ email });
        console.log(user);
        
        if (!user) {
            return res.status(400).json({
                message: " Email not available",
                error: true,
                succes: false
            })
        }
        const currentTime = new Date();
        const otpExpiryTime = new Date(user.forgot_password_expiry);


        if (currentTime > otpExpiryTime) {
            return res.status(400).json({
                message: "OTP is expired",
                error: true,
                success: false
            });
        }
        console.log(otp, user.forgot_password_otp);
        
        if (otp !== user.forgot_password_otp) {
            return res.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false
            });
        }

        const updateUser = await User.findByIdAndUpdate(user?._id,{
            forgot_password_otp:"",
            forgot_password_expiry:""
        })

        return res.json({
            message: "Verify otp successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false // Fix: was written as "flase"
        });
    }
}

exports.loyoutController = async (req, res) => {
     try {
        const userid = req.userId //middleware

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        res.clearCookie("accessToken",cookiesOption)
        res.clearCookie("refreshToken",cookiesOption)

        const removeRefreshToken = await User.findByIdAndUpdate(userid,{
            refresh_token : ""
        })

        return res.json({
            message : "Logout successfully",
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body
        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "provide required fields email, newPassword, confirmPassword"
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Email is not available",
                error: true,
                success: false
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "newPassword and confirmPassword not same.",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword, salt)

        const update = await User.findOneAndUpdate(user._id, {
            password: hashPassword
        })

        return res.json({
            message: "password updated successfully",
            erro: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            succes: false
        })
    }
}



//refresh token controler
exports.refreshToken= async(req,res)=>{
    try {
        const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1]  /// [ Bearer token]

        if(!refreshToken){
            return res.status(401).json({
                message : "Invalid token",
                error  : true,
                success : false
            })
        }

        const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken){
            return res.status(401).json({
                message : "token is expired",
                error : true,
                success : false
            })
        }

        const userId = verifyToken?._id

        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        res.cookie('accessToken',newAccessToken,cookiesOption)

        return res.json({
            message : "New Access token generated",
            error : false,
            success : true,
            data : {
                accessToken : newAccessToken
            }
        })


    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


exports.userDetails = async (req,res) =>{
    try{
        const userId = req.userId
        console.log(userId);
        
        const user = await User.findById(userId).select('-password -refresh_token')

        return res.json({
            message:"user details",
            data :user,
            error:false,
            success:true
        })
    }catch(error){
        console.log(error);
        
        return res.status(500).json({
            message :"Something is wrong",
            error:true,
            succes:true
        })
    }
}