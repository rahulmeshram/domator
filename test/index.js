const assert = require('assert')
const { jsdom } = require('jsdom')
const d = require('../domator')

const document = jsdom()

d.setDocument(document)

describe('coding style', function () {
  this.timeout(5000)
  it('conforms to standard', require('mocha-standard'))
})

describe('domator', function () {
  it('should create a `div` element', function () {
    // with domator
    const element = d('div')

    // with document
    const expected = document.createElement('div')

    assert(expected.isEqualNode(element))
  })

  it('should create a `div` element with class and id attrs', function () {
    // with domator
    const element = d('#the-id.the-class')

    // with document
    const expected = document.createElement('div')
    expected.id = 'the-id'
    expected.classList.add('the-class')

    assert(expected.isEqualNode(element))
  })

  it('should create a `div` with custom attrs', function () {
    // with domator
    const element = d('div[data-custom="some-value"][data-custom2="other-value"]')

    // with document
    const expected = document.createElement('div')
    expected.setAttribute('data-custom', 'some-value')
    expected.setAttribute('data-custom2', 'other-value')

    assert(expected.isEqualNode(element))
  })

  it('should create a `div` with the text "Hello World!".', function () {
    // with domator
    const element = d('div Hello World!')

    // with document
    const expected = document.createElement('div')
    expected.textContent = 'Hello World!'

    assert(expected.isEqualNode(element))
  })

  it('should create a `div` with attributes setted from an object.', function () {
    const attrs = {
      src: 'http://google.com',
      title: 'Title content'
    }

    // with domator
    const element = d('div', attrs)

    // with document
    const expected = document.createElement('div')
    expected.setAttribute('src', attrs.src)
    expected.setAttribute('title', attrs.title)

    assert(expected.isEqualNode(element))
  })

  it('should create a `div` with two `span` siblings', function () {
    // with domator
    const element = d('div', ['span', 'span'])

    // with document
    const expected = document.createElement('div')
    expected.appendChild(document.createElement('span'))
    expected.appendChild(document.createElement('span'))

    assert(expected.isEqualNode(element))
  })

  it('should create a `documentFragment` with 3 `div` siblings.', function () {
    // with domator
    const element = d('div', 'div', 'div')

    // with document
    const expected = document.createDocumentFragment()
    expected.appendChild(document.createElement('div'))
    expected.appendChild(document.createElement('div'))
    expected.appendChild(document.createElement('div'))

    assert(expected.isEqualNode(element))
  })

  it('should join classes from the selector and attributes.', function () {
    // with domator
    const element = d('div.three', {
      'class': 'one',
      className: 'two'
    })

    // with document
    const expected = document.createElement('div')
    expected.classList.add('one')
    expected.classList.add('two')
    expected.classList.add('three')

    assert(expected.isEqualNode(element))
  })

  it('should set attributes to an existing element.', function () {
    // with domator
    const element = d(document.createElement('div'), {
      id: 'some-id'
    })

    // with document
    const expected = document.createElement('div')
    expected.id = 'some-id'

    assert(expected.isEqualNode(element))
  })

  it('should allow empty text string to be supplied', function () {
    // with domator shorthand
    const shorthandElement = d('div ')
    // with domator text attr
    const attrElement = d('div', { text: '' })

    // with document
    const expected = document.createElement('div')
    expected.appendChild(document.createTextNode(''))

    assert(expected.isEqualNode(shorthandElement))
    assert(expected.isEqualNode(attrElement))
  })

  it('should allow uppercase characters in selector strings', function () {
    // with domator
    const id = 'someId'
    const className = 'someClass'
    const attr = ['attrName', 'attrValue']
    const template = `div#${id}.${className}[${attr[0]}="${attr[1]}"]`
    const element = d(template)

    // with document
    const expected = document.createElement('div')
    expected.id = id
    expected.classList.add(className)
    expected.setAttribute(attr[0], attr[1])

    assert(expected.isEqualNode(element))
  })

  it('should update an existing element childs', function () {
    const data = {
      title: 'Some Title',
      text: 'Some lengthy text'
    }

    const element = d('div', [
      `h1 ${data.title}`,
      `p ${data.text}`
    ])

    const expected1 = document.createElement('div')
    const title1 = document.createElement('h1')
    title1.appendChild(document.createTextNode(data.title))
    expected1.appendChild(title1)
    const text1 = document.createElement('p')
    text1.appendChild(document.createTextNode(data.text))
    expected1.appendChild(text1)

    assert(expected1.isEqualNode(element))

    data.title = 'Some Changed Title'
    data.Text = 'Some changed text on the model'

    d(element, [
      `h1 ${data.title}`,
      `p ${data.text}`
    ])

    const expected2 = document.createElement('div')
    const title2 = document.createElement('h1')
    title2.appendChild(document.createTextNode(data.title))
    expected2.appendChild(title2)
    const text2 = document.createElement('p')
    text2.appendChild(document.createTextNode(data.text))
    expected2.appendChild(text2)

    assert(expected2.isEqualNode(element))
  })
})

describe('domator.parseSelector', function () {
  const { parseSelector } = d

  it('should parse only text selector', function () {
    const attrs = parseSelector(' Hello!')

    const expected = {
      text: 'Hello!'
    }

    assert.deepEqual(expected, attrs)
  })

  it('should parse return empty text field', function () {
    const attrs = parseSelector('div ')

    const expected = {
      tag: 'div',
      text: ''
    }

    assert.deepEqual(expected, attrs)
  })
})

describe('domator.toString', function () {
  it('should convert a dom element to string', function () {
    const str = d.toString(d('div'))

    const expected = '<div></div>'

    assert(expected === str)
  })
})
