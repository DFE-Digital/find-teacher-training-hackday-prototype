const path = require('path')
const fs = require('fs')

const organisationModel = require('./organisations')
const utils = require('../utils')()

exports.findMany = (params) => {
  const locations = []

  if (params.providerCode) {
    const organisation = organisationModel.findOne({
      providerCode: params.providerCode
    })

    const directoryPath = path.join(__dirname, `../data/locations/${organisation.id}`)

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
  const locations = []
  let location = {}

  if (params.providerCode && params.locationCode) {
    const organisation = organisationModel.findOne({
      providerCode: params.providerCode
    })

    const directoryPath = path.join(__dirname, `../data/locations/${organisation.id}`)

    if (fs.existsSync(directoryPath)) {
      let documents = fs.readdirSync(directoryPath, 'utf8')
      // Only get JSON documents
      documents = documents.filter(doc => doc.match(/.*\.(json)/ig))

      documents.forEach((filename) => {
        const filePath = `${directoryPath}/${filename}`

        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath)
          let location = JSON.parse(raw)
          location = utils.decorateLocation(location)
          locations.push(location)
        }
      })
    }

    location = locations.find(location => location.code === params.locationCode)
  }

  return location
}
