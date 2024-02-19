import nodemailer from "nodemailer";


export  function mail(username,email){
    

    let transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
          user: "vigneshbalaji453535@gmail.com", // Hardcode It
          pass: "fffs mmdd hgbg envi", // Hardcode It
        }
      });
    
      let mailOptions = {
        from: "vigneshbalaji453535@gmail.com", // Hardcode It
        to: `${email}`, // list of receivers. This can be done via variable
        subject: "APP REGISTRED SUCCESSFULLY", // Subject line. This can be done via variable
        html: `Hii ${username} Wellcome to our App ,Explore....................................`, // html text body.  This can be done via variable
      };
      transporter.sendMail(mailOptions, function (error, success) {
        if (error) {
          res.status(403).send(error);
          console.log(error);
        } else {
          res.send(success);
          console.log("Server is ready to take our messages");
        }
      });
}