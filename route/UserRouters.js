const { registerUser, loginController, updateuserDetails, forgotPasswordController, veriftyForgotPasswordOtp, resetPassword, refreshToken, loyoutController, userDetails } = require("../controller/UserController");
const auth = require("../middleware/auth");

const UserRouter   = require("express").Router()


UserRouter.post('/register',registerUser)
UserRouter.post('/login',loginController)
UserRouter.get("/logout", auth, loyoutController)
UserRouter.put("/update-user",auth, updateuserDetails)
UserRouter .put("/forgot-password", forgotPasswordController)
// UserRouter .post("/send-whatsapp", sendWhatsApp)
UserRouter.put("/verify-forgot-password-otp",veriftyForgotPasswordOtp)
UserRouter.put("/reset-password",resetPassword)
UserRouter.post("/refresh-token", refreshToken)
UserRouter.get("/user-details",auth, userDetails)

module.exports = UserRouter;
