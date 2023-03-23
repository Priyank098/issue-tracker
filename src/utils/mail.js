const sgMail = require('@sendgrid/mail')

require("dotenv").config({ path: `./src/env/dev.env`});
sgMail.setApiKey("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")


const sendWelcomeEmail = (email,token) => {
    return sgMail
    .send({
        to: 'sahil.k@antino.io',
        from: 'sahil.k@antino.io',
        subject: '"RESET YOUR PASSWORD"',
        text: `Welcome to the issue-tracker application.`,
        // html:`Here, your link is : <a href=http://localhost:4000/api/update-password?token=${token}> update password <a/>`
        html: `Here, your link is : <a href=http://localhost:4000/api/reset-password?token=${token}> reset password <a/>`
    })
    .then(() => {
        console.log('`password reset link has been sent to: ${email}`')
        return true;
    })
    .catch((error) => {
        console.log(error)
        return false;
      })
}

module.exports = {sendWelcomeEmail}

// sendWelcomeEmail().then(() => {console.log('Email')}).catch((err)=>{console.log(err)})