const qs = require('qs')
const teacherTrainingService = require('../services/teacher-training')
const trainingPartnerModel = require('../models/training-partners')

exports.show = (req, res) => {
  const providerCode = req.params.providerCode.toUpperCase()
  const courseCode = req.params.courseCode.toUpperCase()
  const partnerCode = req.params.partnerCode.toUpperCase()

  const course = teacherTrainingService.getCourse({ providerCode, courseCode })
  const provider = teacherTrainingService.getProvider({ providerCode })
  const locations = teacherTrainingService.getProviderLocations({ providerCode: partnerCode })

  const partner = trainingPartnerModel.findOne({ partnerCode })

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
