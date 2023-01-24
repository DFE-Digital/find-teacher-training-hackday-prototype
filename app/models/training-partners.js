const providerModel = require('./providers')

exports.findMany = (params) => {
  let organisations = []

  if (params.providerCode) {
    organisations = providerModel.findMany({
      isAccreditedBody: false
    })

    const accreditedProvider = providerModel.findOne({
      providerCode: params.providerCode
    })

    organisations = organisations.filter(organisation => {
      if (organisation.accreditedBodies) {
        return organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === accreditedProvider.id)
      }
    })
  }

  return organisations
}

exports.findOne = (params) => {
  let organisation = {}

  if (params.partnerCode) {
    const organisations = providerModel.findMany({
      isAccreditedBody: false
    })

    organisation = organisations.find(organisation => organisation.code === params.partnerCode)
  }

  return organisation
}
