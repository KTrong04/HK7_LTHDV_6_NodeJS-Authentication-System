import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export class googleSignInController {
  // Google sign-in success
  signInSuccess = async (req, res) => {
    const userData = req.user._json;
    const { email, name, sub } = userData;

    if (!email) {
      return res.status(403).json({ error: true, message: "Not Authorized" });
    }

    // Tìm hoặc tạo user
    let user = await User.findOne({ email: email });
    if (!user) {
      user = new User({ username: name, email: email, password: sub });
      await user.save();
    }

    // ✅ Sinh JWT token hết hạn sau 1h
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1m" } // hoặc "15m" nếu bạn muốn nhanh hết hạn để test
    );

    // Lưu email vào session
    req.session.userEmail = email;

    // Nếu gọi bằng Postman thì trả JSON, còn mở bằng trình duyệt thì render homepage
    if (req.headers["postman-token"]) {
      return res.status(200).json({
        studentInfo: "Student ID: 22697491 - Fullname: Trần Kim Trọng",
        token
      });
    } else {
      return res.status(200).render("homepage", {
        studentInfo: "Student ID: 22697491 - Fullname: Trần Kim Trọng",
        token
      });
    }
  };

  // Google sign-in failed
  signInFailed = (req, res) => {
    res.status(401).json({
      error: true,
      message: "Log in failure",
    });
  };
}
