const path = require('path')
const fs = require('fs')

const directoryPath = path.join(__dirname, '../data/organisations')

exports.findMany = (params) => {
  let organisations = []

  let documents = fs.readdirSync(directoryPath, 'utf8')

  // Only get JSON documents
  documents = documents.filter(doc => doc.match(/.*\.(json)/ig))

  documents.forEach((filename) => {
    const raw = fs.readFileSync(directoryPath + '/' + filename)
    const data = JSON.parse(raw)
    organisations.push(data)
  })

  if (params.providerCode) {
    organisations = organisations.find(organisation => organisation.code === params.providerCode)
  }

  if (typeof (params.isAccreditedBody) === 'boolean') {
    organisations = organisations.filter(organisation => organisation.isAccreditedBody === params.isAccreditedBody)
  }

  return organisations
}

exports.findOne = (params) => {
  const organisations = []
  let organisation = {}

  let documents = fs.readdirSync(directoryPath, 'utf8')

  // Only get JSON documents
  documents = documents.filter(doc => doc.match(/.*\.(json)/ig))

  documents.forEach((filename) => {
    const raw = fs.readFileSync(directoryPath + '/' + filename)
    const data = JSON.parse(raw)
    organisations.push(data)
  })

  organisation = organisations.find(organisation => organisation.code === params.providerCode)

  return organisation
}
