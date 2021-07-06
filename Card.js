/* global defaults */
/* exported Card */

class Card {
  constructor({ chapter = "", section = "", front = "", back = "" } = {}) {
    this.chapter = chapter
    this.section = section
    this.front = front
    this.back = back
  }

  toArray() {
    const array = []
    const { CHAPTER, SECTION, FRONT, BACK } = defaults.headings
    array[CHAPTER] = this.chapter
    array[SECTION] = this.section
    array[FRONT] = this.front
    array[BACK] = this.back
    return array
  }

  static fromArray(array) {
    const { CHAPTER, SECTION, FRONT, BACK } = defaults.headings
    return new Card({
      chapter: array[CHAPTER],
      section: array[SECTION],
      front: array[FRONT],
      back: array[BACK],
    })
  }
}
