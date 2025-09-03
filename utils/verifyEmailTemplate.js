const verifyEmailTemplate  = ({name,url}) =>{
  return`
  <p>Dear ${name} </p>

  <p>Thank you for registering App</p>
  <a href=${url}>
    Verify Email
  </a>
  `
}

module.exports = verifyEmailTemplate