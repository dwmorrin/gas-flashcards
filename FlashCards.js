/* global Card */

/* exported
    doGet 
    getCards
    include_
*/

const defaults = {
  SPREADSHEET_NAME: "Flash Cards", // register preferred name here
  SPREADSHEET_ID: "sheetId", // avoids bugs from string based key
  SHEET_URL: "sheetUrl", // avoids bugs from string based key
  headings: {
    // register the order of the spreadsheet columns here
    CHAPTER: 0,
    SECTION: 1,
    FRONT: 2,
    BACK: 3,
  },
}

/**
 * HTTP GET handler
 * this is the starting point of the web app
 * the request parameter is not currently used
 */
function doGet(/*request*/) {
  const template = HtmlService.createTemplateFromFile("index")
  template.defaults = defaults
  const html = template.evaluate()
  html.setTitle("flash cards").addMetaTag("viewport", "width=device-width")
  return html
}

/**
 * getCards maps the sheet data to objects
 * public function called by client after doGet
 * @returns {object} contains two string arrays and a url string
 */
function getCards() {
  const sheet = getSheet_()
  const sheetValues = sheet.getDataRange().getValues().slice(1)
  const values = sheetValues.length ? sheetValues : getDefaultCards_()
  const cards = values.map(Card.fromArray)
  return {
    cards,
    // reducer makes a dictionary of chapters and sections
    chapters: cards.reduce((chapters, card) => {
      if (!chapters[card.chapter]) chapters[card.chapter] = {}
      chapters[card.chapter][card.section] = true
      return chapters
    }, {}),
    url: getUrl_(),
  }
}

/**
 * getDefaultCards_ creates a demo set of cards with helpful info if
 *   there are no cards found in the spreadsheet
 * @returns {string[][]}
 */
function getDefaultCards_() {
  return [
    new Card({
      chapter: "1",
      section: "1",
      front: "This is the front of a card. Click the card to turn it over.",
      back:
        "This is the back of a card. The back button should " +
        "return you to the front of the card. Use the link above to enter " +
        "new cards and refresh this page to load the new set of cards.",
    }).toArray(),
  ]
}

/**
 * getSheet_ will open or create the default data sheet
 * if the id is set but does not return a sheet, a new spreadsheet
 * will be created.
 * @returns {GoogleAppsScript.Spreadsheet.Sheet} the user's default data sheet
 */
function getSheet_() {
  const id = PropertiesService.getUserProperties().getProperty(
    defaults.SPREADSHEET_ID
  )
  if (!id) return newSpreadsheet_().getSheets()[0]
  try {
    return SpreadsheetApp.openById(id).getSheets()[0]
  } catch (error) {
    // maybe it was deleted? newSpreadsheet resets property
    return newSpreadsheet_().getSheets()[0]
  }
}

/**
 * Get the URL of the Sheet with the card data
 * @returns {string} - url of the data sheet
 */
function getUrl_() {
  return PropertiesService.getUserProperties().getProperty(defaults.SHEET_URL)
}

/**
 * Template helper function for modularizing HTML, CSS, and JavaScript
 * @param {string} filename
 * @param {Record<string, unknown>} params
 * @return {string} contents of the file
 */
function include_(filename, params = {}) {
  const template = HtmlService.createTemplateFromFile(filename)
  Object.assign(template, params)
  return template.evaluate().getContent()
}

/**
 * Creates a new data spreadsheet to hold the flash card data
 * mutates (sets/overwrites) the user's properties for SHEET_ID and SHEET_URL
 * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet}
 */
function newSpreadsheet_() {
  const spreadsheet = SpreadsheetApp.create(defaults.SPREADSHEET_NAME)
  const userProperties = PropertiesService.getUserProperties()
  userProperties.setProperty(defaults.SPREADSHEET_ID, spreadsheet.getId())
  userProperties.setProperty(defaults.SHEET_URL, spreadsheet.getUrl())
  const sheet = spreadsheet.getSheets()[0]
  const headerRow = new Card({
    chapter: "Chapter",
    section: "Section",
    front: "Front",
    back: "Back",
  }).toArray()
  sheet.appendRow(headerRow)
  sheet.setFrozenRows(1)
  return spreadsheet
}
