const qs = require('qs')

const courseModel = require('../models/courses')
const locationModel = require('../models/locations')
const providerModel = require('../models/providers')
const trainingPartnerModel = require('../models/training-partners')

exports.show = (req, res) => {
  const providerCode = req.params.providerCode.toUpperCase()
  const courseCode = req.params.courseCode.toUpperCase()
  const partnerCode = req.params.partnerCode.toUpperCase()

  const course = courseModel.findOne({ providerCode, courseCode })
  const provider = providerModel.findOne({ providerCode })
  const partner = trainingPartnerModel.findOne({ partnerCode })
  const locations = locationModel.findMany({ providerCode: partnerCode })

  locations.sort((a,b) => {
    return a.name.localeCompare(b.name)
  })

  res.render('partners/index', {
    provider,
    course,
    partner,
    locations,
    actions: {
      back: `/providers/${providerCode}/courses/${courseCode}`
    }
  })
}
