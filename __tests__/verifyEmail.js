const verifyEmail = require("../lib/verifyEmail")


// the part before the @ -> numbers, special charachters, lowercase, uppercase
// there should be an @
// the afer at has to be valid -> does not not have anything but word charachters and a . then com, edux


//checks for special charachters like @ and . that make an email

test("fails when it only contains letter charachters and no @ or .", function() {
    expect(verifyEmail("thisisnotanemail")).toBe(false)
})

test("fails when email contains @ but no .", function () {
    expect(verifyEmail("school@checkat")).toBe(false)
})

test("fails when email contains . but no @", function () {
    expect(verifyEmail("schoolcheck.at")).toBe(false)
})

test("passes when it has a . and an @", function () {
    expect(verifyEmail("school@check.at")).toBe(true)
})

test("fails when it has 2 @ and a .", function () {
    expect(verifyEmail("school@check@and.at")).toBe(false)
})

test("passes when email is real email", function () {
    expect(verifyEmail("10sandra!@oregonstate.edu")).toBe(true)
})

test("passes when email is real email but diffrent after @ name", function () {
    expect(verifyEmail("10sandra!@hotmail.com")).toBe(true)
})

test("passes when email has _", function () {
    expect(verifyEmail("10_sandra!@gmail.com")).toBe(true)
})




