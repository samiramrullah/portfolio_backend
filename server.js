require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();

const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors({
  origin: "https://www.samiramrullah.com"
}));

app.use(express.json());

app.post("/contact", async (req, res) => {
  try {

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: "samiramrullah@gmail.com",
      subject: `Portfolio Message: ${subject}`,
      html: `
        <h2>New Portfolio Contact</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Subject:</b> ${subject}</p>
        <hr/>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `
    });

    res.json({
      success: true,
      message: "Email sent successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to send email"
    });

  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server running on port " + port);
});