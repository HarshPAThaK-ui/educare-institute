import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
    try {
        // Check for token in Authorization header (Bearer token)
        const authHeader = req.headers.authorization;
        let token;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7); // Remove 'Bearer ' prefix
        } else {
            // Fallback to check for token in headers.token (for backward compatibility)
            token = req.headers.token;
        }

        if (!token) {
            return res.status(403).json({
               message: "Please Login",
            });
        }

        const decodedData = jwt.verify(token, process.env.Jwt_Sec);
        req.user = await User.findById(decodedData._id);
        next();
    }
    catch (error) {
        res.status(500).json({
            message: "Login First"
        });
    }
};
   
export const isAdmin = (req,res,next) =>{
    try {
        // Check if user is admin (handle both database "admin" and normalized "admin")
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "You are not an admin"
            });
        }
        next(); 
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
        
    }
}
