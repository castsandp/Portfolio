const verifyPassword = require("../lib/verifyPassword")

test("passed length but fails to pass completely", function () {
    expect(verifyPassword("abcdefgkl").length).toBe(true)
    expect(verifyPassword("abcdefgkl").pass).toBe(false)
})

test("fails when there is no lowercase", function () {
    expect(verifyPassword("SANDRACP10!").lowercase).toBe(false)
    expect(verifyPassword("SANDRACP10!").pass).toBe(false)
})

test("fails when there is no uppercase", function () {
    expect(verifyPassword("sandrac10!").uppercase).toBe(false)
    expect(verifyPassword("sandrac10!").pass).toBe(false)
})

test("fails when there is no digit", function () {
    expect(verifyPassword("sandracp!").digit).toBe(false)
    expect(verifyPassword("sandracp!").pass).toBe(false)
})

test("fails when no symbol", function () {
    expect(verifyPassword("sandraCP10").symbol).toBe(false)
    expect(verifyPassword("sandraCP10").pass).toBe(false)
})

test("fails when there is in an invalid spaces", function () {
    expect(verifyPassword("Sandrac 10!").noInvalid).toBe(false)
    expect(verifyPassword("Sandrac 10!").pass).toBe(false)
})

test("fails when there is in an invalid symbols", function () {
    expect(verifyPassword("Sandrac_10!").noInvalid).toBe(false)
    expect(verifyPassword("Sandrac_10!").pass).toBe(false)
})

test("passes when everything is in the password and no invalid charachters", function () {
    expect(verifyPassword("Sandrac10!").pass).toBe(true)
})



