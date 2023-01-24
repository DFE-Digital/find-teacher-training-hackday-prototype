const qs = require('qs')

const courseModel = require('../models/courses')
const locationModel = require('../models/locations')
const providerModel = require('../models/providers')
const trainingPartnerModel = require('../models/training-partners')

exports.show = (req, res) => {
  const providerCode = req.params.providerCode.toUpperCase()
  const courseCode = req.params.courseCode.toUpperCase()

  const course = courseModel.findOne({ providerCode, courseCode })
  const provider = providerModel.findOne({ providerCode })

  const locations = locationModel.findMany({ providerCode })

  const partners = trainingPartnerModel.findMany({ providerCode })

  partners.sort((a,b) => {
    return a.name.localeCompare(b.name)
  })

  const searchQuery = () => {
    const query = {
      latitude: req.session.data.latitude,
      longitude: req.session.data.longitude,
      page: req.session.data.page,
      filter: req.session.data.filter
    }

    return qs.stringify(query)
  }

  let back = `/results?${searchQuery()}`
  if (req.query.referrer) {
    back = `/providers/${req.params.providerCode}`
  }

  res.render('courses/index', {
    provider,
    course,
    locations,
    partners,
    actions: {
      back: `/results?${searchQuery()}`
    }
  })
}
