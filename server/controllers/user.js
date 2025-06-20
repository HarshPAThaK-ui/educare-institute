import { User }from "../models/User.js";
import { Contact } from "../models/Contact.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

export const register = TryCatch(async (req, res) => {
     const {email, name, password, role = 'student'} = req.body
        let user = await User.findOne({ email });
        if (user) 
            return res.status(400).json({ message: "User already exists" });
        const hashPassword = await bcrypt.hash(password, 10);

        // Normalize role: convert "student" to "user" for database storage
        const normalizedRole = role === 'student' ? 'user' : role;

        user ={
            name,
            email,
            password: hashPassword,
            role: normalizedRole,
            status: 'pending',
        }

        const otp = Math.floor(Math.random() * 1000000);

        if (!process.env.Actiavtion_Secret) {
            console.error("Activation secret is not defined in environment variables.");
            return res.status(500).json({ message: "Server configuration error: Activation secret is missing." });
        }

        const activationToken = jwt.sign(
            { user, otp },
            process.env.Actiavtion_Secret,
            {
                expiresIn: "5m",
            }
        );

        const data ={
            name,
            otp,
        };

        await sendMail(
             email,
             "Educare Institute",
             data
            );
        await sendMail(
            'educareinstitutee@gmail.com',
            'New Student Registration - Approval Needed',
            {
                name,
                email,
                message: `A new student has registered and is awaiting approval.\n\nName: ${name}\nEmail: ${email}\nPlease log in to the admin portal to approve or reject this student.`
            }
        );
        res.status(200).json({
            message: "otp sent to your email",
            user,
            activationToken,
        });
})

export const verifyUser = TryCatch(async (req, res) => {
    const {otp, activationToken} = req.body;

    if (!process.env.Actiavtion_Secret) {
        console.error("Activation secret is not defined in environment variables.");
        return res.status(500).json({ message: "Server configuration error: Activation secret is missing." });
    }

    const verify = jwt.verify(
        activationToken,
        process.env.Actiavtion_Secret
    );
    if (!verify) 
        return res.status(400).json({ message: "Otp expired" });
    if (verify.otp !== otp)
        return res.status(400).json({ message: "Invalid OTP" });

    // Normalize role: convert "student" to "user" for database storage
    const normalizedRole = verify.user.role === 'student' ? 'user' : verify.user.role;

    await User.create({
        name: verify.user.name,
        email: verify.user.email,
        password: verify.user.password,
        role: normalizedRole || 'user',
        status: 'pending',
    })

    res.json({
        message: "User registered successfully. Awaiting admin approval.",
        
    });

});

export const loginUser = TryCatch(async (req, res) => {
    const { email, password, role = 'student' } = req.body;

    if (!process.env.Jwt_Sec) {
        console.error("JWT secret is not defined in environment variables.");
        return res.status(500).json({ message: "Server configuration error: JWT secret is missing." });
    }

    console.log('Login attempt:', { email, role });

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        console.log('User not found:', email);
        return res.status(400).json({ message: "User not found" });
    }
    
    if (user.role !== 'admin' && user.status !== 'approved') {
        return res.status(403).json({ message: "Your registration is pending approval by the admin. Please wait for confirmation." });
    }

    console.log('User found:', { 
        email: user.email, 
        role: user.role, 
        requestedRole: role,
        hasPassword: !!user.password 
    });

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
        console.log('Password mismatch for:', email);
        return res.status(400).json({ message: "Invalid password" });
    }

    // Role validation: Handle both "user" and "student" as the same role
    // Only check if someone is trying to access admin portal without admin privileges
    if (role === 'admin' && user.role !== 'admin') {
        console.log('Admin access denied:', { userRole: user.role, requestedRole: role });
        return res.status(403).json({ 
            message: "Access denied. You are not authorized as an admin. Please use the student login portal.",
            userRole: user.role,
            requestedRole: role
        });
    }

    console.log('Login successful:', { email, userRole: user.role, requestedRole: role });

    const token = await jwt.sign({ _id: user._id }, process.env.Jwt_Sec ,{
        expiresIn: "7d" ,
    });
    
    // Normalize the role for frontend (convert "user" to "student")
    const normalizedUser = {
        ...user.toObject(),
        role: user.role === 'user' ? 'student' : user.role
    };
    
    res.json({
        message: `Welcome back ${user.name}`,
        token,
        user: normalizedUser,
    })
});

//catching my id
export const myProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id)
      .populate('enrollment.course', 'title')
      .exec();

    // Normalize the role for frontend (convert "user" to "student")
    const normalizedUser = {
        ...user.toObject(),
        role: user.role === 'user' ? 'student' : user.role
    };

    res.json({ user: normalizedUser })

});

export const logoutUser = TryCatch(async (req, res) => {
    res.status(200).json({
        message: "Logged out successfully",
    });
});

// Debug endpoint to list all users (remove in production)
export const listUsers = TryCatch(async (req, res) => {
    const users = await User.find({});
    res.status(200).json({
        users,
    });
});

export const submitContactForm = TryCatch(async (req, res) => {
    const { name, phone, email, studentClass, message } = req.body;

    // Validate required fields
    if (!name || !phone) {
        return res.status(400).json({ 
            message: "Name and phone number are required" 
        });
    }

    // Save to database
    await Contact.create({
        name,
        phone,
        email: email || 'Not provided',
        studentClass: studentClass || 'Not specified',
        message: message || 'No message provided'
    });

    // Prepare email data
    const emailData = {
        name,
        phone,
        email: email || 'Not provided',
        studentClass: studentClass || 'Not specified',
        message: message || 'No message provided'
    };

    // Send email notification to admin
    try {
        await sendMail(
            'educareinstitutee@gmail.com',
            "New Contact Form Submission - Educare Institute",
            emailData
        );

        res.status(200).json({
            message: "Thank you for your message! We'll get back to you soon."
        });
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({
            message: "Message received but there was an issue sending notification. We'll contact you soon."
        });
    }
});

export const updateProfile = TryCatch(async (req, res) => {
    const { name, phone, address, studentClass } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.studentClass = studentClass || user.studentClass;
    await user.save();
    res.json({ message: "Profile updated successfully", user });
});

export const changePassword = TryCatch(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password changed successfully" });
});