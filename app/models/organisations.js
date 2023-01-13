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

  // TODO: this is really findOne
  if (params.code) {
    organisations = organisations.find(organisation => organisation.code === params.code)
  }

  if (typeof (params.isAccreditedBody) === 'boolean') {
    organisations = organisations.filter(organisation => organisation.isAccreditedBody === params.isAccreditedBody)
  }

  return organisations
}

exports.findOne = (params) => {
  let organisation = {}

  if (params.organisationId) {
    const filePath = directoryPath + '/' + params.organisationId + '.json'

    const raw = fs.readFileSync(filePath)
    organisation = JSON.parse(raw)
  }

  return organisation
}
