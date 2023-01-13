const qs = require('qs')
const teacherTrainingService = require('../services/teacher-training')
// const utils = require('../utils')()

exports.show = async (req, res) => {
  const providerCode = req.params.providerCode.toUpperCase()
  const courseCode = req.params.courseCode.toUpperCase()

  try {
    const course = await teacherTrainingService.getCourse(providerCode, courseCode)
    const provider = await teacherTrainingService.getProvider(providerCode)
    // const course = utils.decorateCourse(courseSingleResponse)

    // if (course.accredited_body_code) {
    //   const providerSingleResponse = await teacherTrainingService.getProvider(course.accredited_body_code)
    //   course.accredited_body = utils.decorateProvider(providerSingleResponse)
    // }
    //
    // const locationListResponse = await teacherTrainingService.getCourseLocations(providerCode, courseCode)
    // const statuses = locationListResponse.included.filter(item => item.type === 'location_statuses')
    // const locations = locationListResponse.data.map(location => {
    //   const { attributes } = location
    //
    //   // Vacancy status
    //   const statusId = location.relationships.location_status.data.id
    //   const status = statuses.find(status => status.id === statusId)
    //   attributes.has_vacancies = status.attributes.has_vacancies
    //
    //   // Address
    //   const streetAddress1 = attributes.street_address_1 ? attributes.street_address_1 + ', ' : ''
    //   const streetAddress2 = attributes.street_address_2 ? attributes.street_address_2 + ', ' : ''
    //   const city = attributes.city ? attributes.city + ', ' : ''
    //   const county = attributes.county ? attributes.county + ', ' : ''
    //   const postcode = attributes.postcode
    //
    //   attributes.name = attributes.name.replace(/'/g, '’')
    //   attributes.address = `${streetAddress1}${streetAddress2}${city}${county}${postcode}`
    //
    //   return attributes
    // })

    // Mock course visa sponsorship
    // course.canSponsorVisa = (Math.random(course.code) > 0.5)

    // Mock placement schools
    // Assume placement schools are locations with a campus code that isn’t '-'
    // const schools = locations.filter(location => location.code !== '-')
    const schools = []

    // Mock school placement policy
    // Assume provider has chosen to show placement schools if a course has more than 1 school location
    // course.placementPolicy = schools.length > 1 ? 'hosted' : 'placed'

    // Mock centre-based training location
    // Assume centre-based training location is location with campus code '-'
    // const mainTrainingLocation = locations.find(location => location.code === '-')
    // const trainingLocationOptions = ['remote', 'school', mainTrainingLocation]

    // course.trainingLocation = trainingLocationOptions[Math.floor(Math.random() * trainingLocationOptions.length)]

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
      schools,
      actions: {
        back,
        provider: `/providers/${req.params.providerCode}?referrer=course&courseCode=${req.params.courseCode}`
      }
    })
  } catch (error) {
    res.render('error', {
      title: error.name,
      content: error.message
    })
  }
}
