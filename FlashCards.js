/* exported
    doGet 
    getCards
    include_
*/
var defaults = {
  SPREADSHEET_NAME: "Flash Cards", // register preferred name here
  SPREADSHEET_ID: "sheetId", // avoids bugs from string based key
  SHEET_URL: "sheetUrl", // avoids bugs from string based key
  headings: { // register the order of the spreadsheet columns here
    CHAPTER: 0, SECTION: 1, FRONT: 2, BACK: 3
  }
}

/**
 * HTTP GET handler
 * this is the starting point of the web app
 * the request parameter is not currently used
 */
function doGet(/*request*/) {
  var template = HtmlService.createTemplateFromFile('index')
  var html = template.evaluate()
  html.setTitle('flash cards')
    .addMetaTag("viewport", "width=device-width")
  return html
}

/**
 * getCards maps the sheet data to objects
 * public function called by client after doGet
 * @returns {object} contains two string arrays and a url string
 */
function getCards() {
  var sheet = getSheet_()
  var values = sheet.getDataRange().getValues()
  values.shift()
  var cards = []
  var chapters = {}
  var h = defaults.headings
  if (values.length == 0) { // no flash cards to display
      values = getDefaultCards_() // display help cards
  }
  values.forEach(function (row) {
    if (! chapters[row[h.CHAPTER]]) {
      chapters[row[h.CHAPTER]] = {}
    }
    chapters[row[h.CHAPTER]][row[h.SECTION]] = true
    cards.push({
      chapter: row[h.CHAPTER],
      section: row[h.SECTION],
      front: row[h.FRONT],
      back: row[h.BACK]
    })
  })
  return {
    cards: cards,
    chapters: chapters,
    url: getUrl_()
  }
}

/**
 * getDefaultCards_ creates a demo set of cards with helpful info if
 *   there are no cards found in the spreadsheet
 * @returns {string[][]}
 */
function getDefaultCards_() {
  var card = []
  var h = defaults.headings
  card[h.CHAPTER] = card[h.SECTION] = 1
  card[h.FRONT] = "This is the front of a card. Click the card to " +
    "turn it over."
  card[h.BACK] = "This is the back of a card. The back button should " +
    "return you to the front of the card. Use the link above to enter " +
    "new cards and refresh this page to load the new set of cards." 
  return [card]
}

/**
 * getSheet_ will open or create the default data sheet
 * if the id is set but does not return a sheet, a new spreadsheet
 * will be created.
 * @returns {Sheet} the user's default data sheet
 */
function getSheet_() {
  var id = PropertiesService.getUserProperties()
    .getProperty(defaults.SHEET_ID)
  if (! id) {
    return newSpreadsheet_().getSheets()[0]
  }
  try {
    return SpreadsheetApp.openById(id).getSheets()[0]
  } catch (error) { // maybe it was deleted? newSpreadsheet resets property
    return newSpreadsheet_().getSheets()[0]
  }
}

/**
 * getUrl_ is a helper function
 * @returns {string} - url of the data sheeet
 */
function getUrl_() {
  return PropertiesService.getUserProperties()
    .getProperty(defaults.SHEET_URL)
}

/**
 * templating helper function for modularizing HTML, CSS, and JavaScript
 */
function include_(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent()
}

/**
 * newSpreadsheet_ creates a new data spreadsheet to hold the flash card data
 * mutates (sets/overwrites) the user's properties for SHEET_ID and SHEET_URL
 * @returns {Spreadsheet}
 */
function newSpreadsheet_() {
  var spreadsheet = SpreadsheetApp.create(defaults.SPREADSHEET_NAME)
  var userProperties = PropertiesService.getUserProperties()
  userProperties.setProperty(defaults.SHEET_ID, spreadsheet.getId())
  userProperties.setProperty(defaults.SHEET_URL, spreadsheet.getUrl())
  var sheet = spreadsheet.getSheets()[0]
  var headerRow = []
  var h = defaults.headings
  headerRow[h.CHAPTER] = "Chapter"
  headerRow[h.SECTION] = "Section"
  headerRow[h.FRONT] = "Front"
  headerRow[h.BACK] = "Back"
  sheet.appendRow(headerRow)
  sheet.setFrozenRows(1) 
  return spreadsheet
}
