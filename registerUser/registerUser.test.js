/**
 * @jest-environment jsdom
 */

require("@testing-library/jest-dom")
const domTesting = require("@testing-library/dom")
const userEvent = require("@testing-library/user-event").default


const fs = require("fs")

function initDomFromFiles(htmlPath, jsPath) {
    const html = fs.readFileSync(htmlPath, "utf8") 
        document.open()
        document.write(html)
        document.close()
        jest.isolateModules(function () {
            require(jsPath)
        })


}

test ("correctly locates the eamil box", function () {
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js",

    )

    const emailBox = domTesting.getByLabelText(document, "Email")
    expect(emailBox).toHaveTextContent("")
})

test ("correctly locates the password box", function () {
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js",
    )

    const passwordBox = domTesting.getByLabelText(document, "Password")
    expect(passwordBox).toHaveTextContent("")
})

test ("correctly locates the register button", function () {
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js",
    )

    const register_button = domTesting.getByText(document, "Register")
    expect(register_button).toHaveTextContent("Register")
})


test ("correct class name when in-valid values - error status class", async function () {
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js",
    )

    const emailInput = domTesting.getByLabelText(document, "Email")
    const passwordInput = domTesting.getByLabelText(document, "Password")
    const registerButton = domTesting.getByRole(document, "button")
    
    const user = userEvent.setup()
    await user.type(emailInput, "castnotemail")
    await user.type(passwordInput, "abcdefghi ")
    await user.click(registerButton)
    
    const errorDiv = domTesting.getByRole(document, "alert")

    expect(errorDiv).toHaveClass("error status")

}) 

test ("correct class name when valid values - success status class", async function () {
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js",
    )

    const emailInput = domTesting.getByLabelText(document, "Email")
    const passwordInput = domTesting.getByLabelText(document, "Password")
    const registerButton = domTesting.getByRole(document, "button")
    
    const user = userEvent.setup()
    await user.type(emailInput, "castsand@gmail.com")
    await user.type(passwordInput, "Cant!Yes10")
    await user.click(registerButton)
    
    const errorDiv = domTesting.getByRole(document, "status")

    expect(errorDiv).toHaveClass("success status")

}) 

test ("input fields clear after successful submition", async function () {
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js",
    )

    const emailInput = domTesting.getByLabelText(document, "Email")
    const passwordInput = domTesting.getByLabelText(document, "Password")
    const registerButton = domTesting.getByRole(document, "button")
    
    const user = userEvent.setup()
    await user.type(emailInput, "castsand@gmail.com")
    await user.type(passwordInput, "Cant!Yes10")
    await user.click(registerButton)
    

    expect(emailInput).toBeEmptyDOMElement()
    expect(passwordInput).toBeEmptyDOMElement()

}) 


test ("error message when both inputs are invalid", async function () {
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js",
    )

    const emailInput = domTesting.getByLabelText(document, "Email")
    const passwordInput = domTesting.getByLabelText(document, "Password")
    const registerButton = domTesting.getByRole(document, "button")
    
    const user = userEvent.setup()
    await user.type(emailInput, "castnotemail")
    await user.type(passwordInput, "abcdefghi ")
    await user.click(registerButton)
    
    const errorDiv = domTesting.getByRole(document, "alert")

    expect(errorDiv).toHaveTextContent("The email address you entered is invalid.")
    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")


}) 

test ("success message is printed when valid input", async function () {
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js",
    )

    const emailInput = domTesting.getByLabelText(document, "Email")
    const passwordInput = domTesting.getByLabelText(document, "Password")
    const registerButton = domTesting.getByRole(document, "button")
    
    const user = userEvent.setup()
    await user.type(emailInput, "castsand@gmail.com")
    await user.type(passwordInput, "Cant!Yes10")
    await user.click(registerButton)

    const errorDiv = domTesting.getByRole(document, "status")
    

    expect(errorDiv).toHaveTextContent("You have successfully registered.")

})


test ("error message when password missing 8 characters but correct email", async function () {
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js",
    )

    const emailInput = domTesting.getByLabelText(document, "Email")
    const passwordInput = domTesting.getByLabelText(document, "Password")
    const registerButton = domTesting.getByRole(document, "button")
    
    const user = userEvent.setup()
    await user.type(emailInput, "castsand@gmail.com")
    await user.type(passwordInput, "Y!20a ")
    await user.click(registerButton)
    
    const errorDiv = domTesting.getByRole(document, "alert")

    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")
    expect(errorDiv).toHaveTextContent("Password needs to be at least 8 characters")

}) 


test ("error message when password missing a lower case letter but correct email", async function () {
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js",
    )

    const emailInput = domTesting.getByLabelText(document, "Email")
    const passwordInput = domTesting.getByLabelText(document, "Password")
    const registerButton = domTesting.getByRole(document, "button")
    
    const user = userEvent.setup()
    await user.type(emailInput, "castsand@gmail.com")
    await user.type(passwordInput, "Y!20ABC ")
    await user.click(registerButton)
    
    const errorDiv = domTesting.getByRole(document, "alert")

    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")
    expect(errorDiv).toHaveTextContent("Password needs a lower case letter")

})

test ("error message when password missing a upper case letter but correct email", async function () {
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js",
    )

    const emailInput = domTesting.getByLabelText(document, "Email")
    const passwordInput = domTesting.getByLabelText(document, "Password")
    const registerButton = domTesting.getByRole(document, "button")
    
    const user = userEvent.setup()
    await user.type(emailInput, "castsand@gmail.com")
    await user.type(passwordInput, "a!20abc ")
    await user.click(registerButton)
    
    const errorDiv = domTesting.getByRole(document, "alert")

    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")
    expect(errorDiv).toHaveTextContent("Password needs an upper case letter")

})

test ("error message when password missing a digit but correct email", async function () {
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js",
    )

    const emailInput = domTesting.getByLabelText(document, "Email")
    const passwordInput = domTesting.getByLabelText(document, "Password")
    const registerButton = domTesting.getByRole(document, "button")
    
    const user = userEvent.setup()
    await user.type(emailInput, "castsand@gmail.com")
    await user.type(passwordInput, "a!A!Cabc ")
    await user.click(registerButton)
    
    const errorDiv = domTesting.getByRole(document, "alert")

    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")
    expect(errorDiv).toHaveTextContent("Password needs a numeric digit (0-9)")

})

test ("error message when password missing a symbol but correct email", async function () {
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js",
    )

    const emailInput = domTesting.getByLabelText(document, "Email")
    const passwordInput = domTesting.getByLabelText(document, "Password")
    const registerButton = domTesting.getByRole(document, "button")
    
    const user = userEvent.setup()
    await user.type(emailInput, "castsand@gmail.com")
    await user.type(passwordInput, "aA10Cabc ")
    await user.click(registerButton)
    
    const errorDiv = domTesting.getByRole(document, "alert")

    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")
    expect(errorDiv).toHaveTextContent("Password needs a symbol (!@#$%^&*)")

})

test ("error message when password has an invalid character but correct email", async function () {
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js",
    )

    const emailInput = domTesting.getByLabelText(document, "Email")
    const passwordInput = domTesting.getByLabelText(document, "Password")
    const registerButton = domTesting.getByRole(document, "button")
    
    const user = userEvent.setup()
    await user.type(emailInput, "castsand@gmail.com")
    await user.type(passwordInput, "aA10C abc ")
    await user.click(registerButton)
    
    const errorDiv = domTesting.getByRole(document, "alert")

    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")
    expect(errorDiv).toHaveTextContent("Password contains an invalid character (only letters, numbers, and the symbols !@#$%^&* are allowed)")

})

test ("error message when the email is incorrect but password is valid", async function () {
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js",
    )

    const emailInput = domTesting.getByLabelText(document, "Email")
    const passwordInput = domTesting.getByLabelText(document, "Password")
    const registerButton = domTesting.getByRole(document, "button")
    
    const user = userEvent.setup()
    await user.type(emailInput, "castnotemail")
    await user.type(passwordInput, "Yes!10abc")
    await user.click(registerButton)
    
    const errorDiv = domTesting.getByRole(document, "alert")

    expect(errorDiv).toHaveTextContent("The email address you entered is invalid.")
    expect(errorDiv).not.toHaveTextContent("The password you entered is invalid.")


})

test ("error message when both the email and password are blank", async function () {
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js",
    )

    const emailInput = domTesting.getByLabelText(document, "Email")
    const passwordInput = domTesting.getByLabelText(document, "Password")
    const registerButton = domTesting.getByRole(document, "button")
    
    const user = userEvent.setup()
    await user.type(emailInput, " ")
    await user.type(passwordInput, " ")
    await user.click(registerButton)
    
    const errorDiv = domTesting.getByRole(document, "alert")

    expect(errorDiv).toHaveTextContent("The email address you entered is invalid.")
    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")
    expect(errorDiv).toHaveTextContent("Password needs to be at least 8 characters")
    expect(errorDiv).toHaveTextContent("Password needs a lower case letter")
    expect(errorDiv).toHaveTextContent("Password needs an upper case letter")
    expect(errorDiv).toHaveTextContent("Password needs a numeric digit (0-9)")
    expect(errorDiv).toHaveTextContent("Password needs a symbol (!@#$%^&*)")
    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")
    expect(errorDiv).toHaveTextContent("Password contains an invalid character (only letters, numbers, and the symbols !@#$%^&* are allowed)")
    


})


test ("error message when the email is valid and password is blank", async function () {
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js",
    )

    const emailInput = domTesting.getByLabelText(document, "Email")
    const passwordInput = domTesting.getByLabelText(document, "Password")
    const registerButton = domTesting.getByRole(document, "button")
    
    const user = userEvent.setup()
    await user.type(emailInput, "castsand@gmail.com")
    await user.type(passwordInput, " ")
    await user.click(registerButton)
    
    const errorDiv = domTesting.getByRole(document, "alert")

    expect(errorDiv).not.toHaveTextContent("The email address you entered is invalid.")
    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")
    expect(errorDiv).toHaveTextContent("Password needs to be at least 8 characters")
    expect(errorDiv).toHaveTextContent("Password needs a lower case letter")
    expect(errorDiv).toHaveTextContent("Password needs an upper case letter")
    expect(errorDiv).toHaveTextContent("Password needs a numeric digit (0-9)")
    expect(errorDiv).toHaveTextContent("Password needs a symbol (!@#$%^&*)")
    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")
    expect(errorDiv).toHaveTextContent("Password contains an invalid character (only letters, numbers, and the symbols !@#$%^&* are allowed)")
    

})

test ("error message when the email is blank and password is valid", async function () {
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js",
    )

    const emailInput = domTesting.getByLabelText(document, "Email")
    const passwordInput = domTesting.getByLabelText(document, "Password")
    const registerButton = domTesting.getByRole(document, "button")
    
    const user = userEvent.setup()
    await user.type(emailInput, " ")
    await user.type(passwordInput, "YesNo!10")
    await user.click(registerButton)
    
    const errorDiv = domTesting.getByRole(document, "alert")

    expect(errorDiv).toHaveTextContent("The email address you entered is invalid.")
    expect(errorDiv).not.toHaveTextContent("The password you entered is invalid.")
    

})

