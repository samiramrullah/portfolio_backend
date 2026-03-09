const http = require("http");
const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const server = http.createServer((req, res) => {

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "https://www.samiramrullah.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  // Contact endpoint
  if (req.method === "POST" && req.url === "/contact") {

    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {

        const { name, email, subject, message } = JSON.parse(body);

        // Basic validation
        if (!name || !email || !subject || !message) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({
            success: false,
            message: "All fields are required"
          }));
        }

        await resend.emails.send({
          from: "Portfolio <onboarding@resend.dev>",
          to: "samiramrullah@gmail.com",
          subject: `Portfolio Message: ${subject}`,
          html: `
            <h2>New Portfolio Contact</h2>

            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>

            <hr/>

            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `
        });

        // Success response
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          success: true,
          message: "Email sent successfully"
        }));

      } catch (error) {

        console.error("Email error:", error);

        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          success: false,
          message: "Failed to send email"
        }));
      }
    });

  } else {

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      success: false,
      message: "Route not found"
    }));

  }

});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});