import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { customerInfo, items, total } = req.body;

    if (!customerInfo || !items || !total) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS, // must be App Password
      },
    });

    const itemsHtml = items.map(
      item => `<li>${item.name} (${item.quantity} x ₹${item.price})</li>`
    ).join("");

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `🛒 New Order from ${customerInfo.firstName} ${customerInfo.lastName}`,
      html: `
        <h2>New Order</h2>
        <p><b>Name:</b> ${customerInfo.firstName} ${customerInfo.lastName}</p>
        <p><b>Email:</b> ${customerInfo.email}</p>
        <p><b>Phone:</b> ${customerInfo.phone}</p>
        <p><b>Company:</b> ${customerInfo.company || "N/A"}</p>
        <p><b>Address:</b> ${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}</p>
        <p><b>GST:</b> ${customerInfo.gst || "N/A"}</p>
        <h3>Items:</h3>
        <ul>${itemsHtml}</ul>
        <p><b>Total:</b> ₹${total}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "✅ Order placed and email sent!" });
  } catch (error) {
    console.error("❌ Email send error:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

export default router;
