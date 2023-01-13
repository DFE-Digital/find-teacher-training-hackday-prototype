const path = require('path')
const fs = require('fs')

exports.findMany = (params) => {
  const locations = []

  if (params.organisationId) {
    const directoryPath = path.join(__dirname, '../data/locations/' + params.organisationId)

    // to prevent errors when an organisation doesn't have any locations
    // create an empty location directory for the organisation
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath)
    }

    let documents = fs.readdirSync(directoryPath, 'utf8')

    // Only get JSON documents
    documents = documents.filter(doc => doc.match(/.*\.(json)/ig))

    documents.forEach((filename) => {
      const raw = fs.readFileSync(directoryPath + '/' + filename)
      const data = JSON.parse(raw)
      locations.push(data)
    })

    locations.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
  }

  return locations
}

exports.findOne = (params) => {
  let location = {}

  if (params.organisationId && params.locationId) {
    const directoryPath = path.join(__dirname, '../data/locations/' + params.organisationId)

    const filePath = directoryPath + '/' + params.locationId + '.json'

    const raw = fs.readFileSync(filePath)
    location = JSON.parse(raw)
  }

  return location
}
