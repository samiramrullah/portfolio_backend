const http = require('http')
const { Resend } = require('resend')
require('dotenv').config()

const resend = new Resend(process.env.RESEND_API_KEY);

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "https://www.samiramrullah.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  if (req.method === "POST" && req.url === "/contact") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const { name, email, subject, message } = JSON.parse(body);

        await resend.emails.send({
          from: "Portfolio Contact",
          to: "samiramrullah@gmail.com",
          subject: `Portfolio Message: ${subject}`,
          html: `
            <h3>New Portfolio Contact</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `
        });

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));

      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to send email" }));
      }
    });

  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});
const port=process.env.PORT
server.listen(port, () => {
  console.log("Server running on port "+ port);
});