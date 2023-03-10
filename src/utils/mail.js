const sgMail = require('@sendgrid/mail')

sgMail.setApiKey("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")

const sendWelcomeEmail = ({email,password}) => {
    return sgMail
    .send({

        to: email,
        from: 'sahil.k@antino.io',
        subject: 'Thanks for joining in!',
        text: `Welcome to the issue-tracker application. Your credentials for login our application:  email: ${email} and password ${password}  .`
    })
    .then(() => {
        console.log('Email sent')
        return true;
    })
    .catch((error) => {
        console.log(error)
        return false;
      })
}

module.exports = {sendWelcomeEmail}

// sendWelcomeEmail().then(() => {console.log('Email')}).catch((err)=>{console.log(err)})