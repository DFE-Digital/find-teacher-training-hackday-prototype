const path = require('path')
const fs = require('fs')

const directoryPath = path.join(__dirname, '../data/organisations')

exports.findMany = (params) => {
  const providers = []
  let organisations = []

  let documents = fs.readdirSync(directoryPath, 'utf8')

  // Only get JSON documents
  documents = documents.filter(doc => doc.match(/.*\.(json)/ig))

  documents.forEach((filename) => {
    const raw = fs.readFileSync(directoryPath + '/' + filename)
    const data = JSON.parse(raw)
    organisations.push(data)
  })

  if (params.query) {
    organisations = organisations.filter(organisation => {
      const name = organisation.name.toLowerCase()
      const code = organisation.code.toLowerCase()
      const query = params.query.toLowerCase()

      return name.includes(query) || code.includes(query)
    })
  }

  if (organisations.length) {
    organisations.forEach((organisation, i) => {
      const provider = {}
      provider.id = organisation.id
      provider.code = organisation.code
      provider.name = organisation.name
      provider.ukprn = organisation.ukprn
      provider.urn = organisation.urn
      provider.isAccreditedBody = organisation.isAccreditedBody
      providers.push(provider)
    })

    providers.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
  }

  return providers
}
