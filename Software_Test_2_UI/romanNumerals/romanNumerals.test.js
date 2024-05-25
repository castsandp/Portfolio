/**
 * @jest-environment jsdom
 */

require("@testing-library/jest-dom")
const domTesting = require("@testing-library/dom")
const userEvent = require("@testing-library/user-event").default

const http = require("msw").http
const HttpResponse = require("msw").HttpResponse
const setupServer = require("msw/node").setupServer

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

const fakeSearchResults = require("./romanModernValues.json")

const server = setupServer(
    http.get(
        "https://romans.justyy.workers.dev/api/romans/",
        function () {
            return HttpResponse.json(fakeSearchResults)
        }
    )
)

beforeAll(function () {
    server.listen()
})
  
afterAll(function () {
    server.close()
})


test ("correctly displays values in both old and modern sections when the modern roman numeral button is clicked", async function () {
    initDomFromFiles(
        __dirname + "/romanNumerals.html",
        __dirname + "/romanNumerals.js",
    )

    const numberInput = domTesting.getByLabelText(document, "Arabic number (1-3999)")
    const searchButton = domTesting.getByRole(document, "button")


    const user = userEvent.setup()
    await user.type(numberInput, "873")
    await user.click(searchButton)

    const oldInput = await domTesting.findByText(document, '"Old" Roman Numeral')
    const modernInput = await domTesting.findByText(document, '"Modern" Roman Numeral')

    expect(oldInput).toHaveTextContent("CCCCCCCCLXXIII")
    expect(modernInput).toHaveTextContent("DCCCLXXIII")
    
})


test ("correctly displays values for old roman numerals", async function () {
    initDomFromFiles(
        __dirname + "/romanNumerals.html",
        __dirname + "/romanNumerals.js",
    )

    const numberInput = domTesting.getByLabelText(document, "Arabic number (1-3999)")
    
    const user = userEvent.setup()
    await user.type(numberInput, "873")

    const oldInput = await domTesting.findByText(document, '"Old" Roman Numeral')

    expect(oldInput).toHaveTextContent("CCCCCCCCLXXIII")
    
    
})

test ("doesn't display modern roman if user does not click submit button", async function () {
    initDomFromFiles(
        __dirname + "/romanNumerals.html",
        __dirname + "/romanNumerals.js",
    )

    const numberInput = domTesting.getByLabelText(document, "Arabic number (1-3999)")
    
    const user = userEvent.setup()
    await user.type(numberInput, "873")

    const oldInput = await domTesting.findByText(document, '"Old" Roman Numeral')
    const modernInput = await domTesting.findByText(document, '"Modern" Roman Numeral')

    expect(oldInput).toHaveTextContent("CCCCCCCCLXXIII")
    expect(modernInput).not.toHaveTextContent("DCCCLXXIII")
    
    
})


test ("modern value removed when changes to input", async function () {
    initDomFromFiles(
        __dirname + "/romanNumerals.html",
        __dirname + "/romanNumerals.js",
    )

    const numberInput = domTesting.getByLabelText(document, "Arabic number (1-3999)")
    const searchButton = domTesting.getByRole(document, "button")


    const user = userEvent.setup()
    await user.type(numberInput, "873")
    await user.click(searchButton)

    const oldInput = await domTesting.findByText(document, '"Old" Roman Numeral')
    const modernInput = await domTesting.findByText(document, '"Modern" Roman Numeral')

    expect(oldInput).toHaveTextContent("CCCCCCCCLXXIII")
    expect(modernInput).toHaveTextContent("DCCCLXXIII")
    
    await user.type(numberInput, "456")
    
    expect(modernInput).not.toHaveTextContent("DCCCLXXIII")
    
})

