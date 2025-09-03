const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1];
        console.log(token);

        console.log("token", token);
        if (!token) {
            return res.status(401).json({
                message: "Provide token",
            });
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

        if (!decode) {
            return res.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false,
            });
        }

        req.userId = decode.id;
        console.log("decode", decode);
        // ✅ Assign the user ID to req.user
        req.user = { id: decode.id }; // 👈 THIS LINE FIXES THE ERROR
        next();

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

module.exports = auth;
