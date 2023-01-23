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

  if (params.query) {
    organisations = organisations.filter(organisation => {
      const name = organisation.name.toLowerCase()
      const code = organisation.code.toLowerCase()
      const query = params.query.toLowerCase()

      return name.includes(query) || code.includes(query)
    })
  }

  return organisations
}
