const data = {
  apiEndpoint: 'https://api.publish-teacher-training-courses.service.gov.uk/api/public/v1',
  cycle: '2023'
}

const courseModel = require('../models/courses')
const courseLocationModel = require('../models/course-locations')
const providerModel = require('../models/providers')
const providerCourseModel = require('../models/provider-courses')
const providerLocationModel = require('../models/provider-locations')
const providerSuggestionsModel = require('../models/provider-suggestions')

const teacherTrainingService = {
  // https://api.publish-teacher-training-courses.service.gov.uk/docs/api-reference.html#recruitment_cycles-year-courses-get
  getCourses (filter, sort = null) {
    filter.cycleId = data.cycle
    const courses = courseModel.findMany(filter)

    courses.sort((a,b) => {
      // course name z to a
      // If identical course, ordering falls back to the provider, if identical providers, ordering falls back to the course code
      if (parseInt(sort) === 1) {
        return b.name.localeCompare(a.name) || a.trainingProvider.name.localeCompare(b.trainingProvider.name) || a.code.localeCompare(b.code)
      }
      // provider name a to z
      // If identical provider, ordering falls back to the course, if identical courses, ordering falls back to the course code
      else if (parseInt(sort) === 2) {
        return a.trainingProvider.name.localeCompare(b.trainingProvider.name) || a.name.localeCompare(b.name) || a.code.localeCompare(b.code)
      }
      // provider name z to a
      // If identical provider, ordering falls back to the course, if identical courses, ordering falls back to the course code
      else if (parseInt(sort) === 3) {
        return b.trainingProvider.name.localeCompare(a.trainingProvider.name) || a.name.localeCompare(b.name) || a.code.localeCompare(b.code)
      }
      // course name a to z (default)
      // If identical course, ordering falls back to the provider, if identical providers, ordering falls back to the course code
      else {
        return a.name.localeCompare(b.name) || a.trainingProvider.name.localeCompare(b.trainingProvider.name) || a.code.localeCompare(b.code)
      }
    })

    return courses
  },

  // https://api.publish-teacher-training-courses.service.gov.uk/docs/api-reference.html#recruitment_cycles-year-providers-provider_code-courses-course_code-get
  getCourse (providerCode, courseCode) {
    try {
      const course = courseModel.findOne(providerCode, courseCode)
      return course
    } catch (error) {
      console.error(error)
    }
  },

  // https://api.publish-teacher-training-courses.service.gov.uk/docs/api-reference.html#recruitment_cycles-year-providers-provider_code-courses-course_code-locations-get
  getCourseLocations (providerCode, courseCode) {
    try {
      const courseLocations = courseLocationModel.findMany(providerCode, courseCode)
      return courseLocations
    } catch (error) {
      console.error(error)
    }
  },

  // https://api.publish-teacher-training-courses.service.gov.uk/docs/api-reference.html#provider_suggestions-get
  getProviderSuggestions (query) {
    const providerSuggestions = providerSuggestionsModel.findMany({
      query
    })
    return providerSuggestions
  },

  // https://api.publish-teacher-training-courses.service.gov.uk/docs/api-reference.html#recruitment_cycles-year-providers-get
  getProviders (filter, sort = null) {
    const providers = providerModel.findMany({ filter })

    providers.sort((a,b) => {
      // provider name z to a
      if (parseInt(sort) === 3) {
        return b.trainingProvider.name.localeCompare(a.trainingProvider.name)
      }
      // provider name a to z (default)
      else {
        return a.trainingProvider.name.localeCompare(b.trainingProvider.name)
      }
    })

    return providers
  },

  // https://api.publish-teacher-training-courses.service.gov.uk/docs/api-reference.html#recruitment_cycles-year-providers-provider_code-get
  getProvider (providerCode) {
    try {
      const provider = providerModel.findOne(providerCode)
      return provider
    } catch (error) {
      console.error(error)
    }
  },

  // https://api.publish-teacher-training-courses.service.gov.uk/docs/api-reference.html#recruitment_cycles-year-providers-provider_code-courses-get
  getProviderCourses (providerCode, filter, sort = null) {
    filter.cycleId = data.cycle
    const providerCourses = providerCourseModel.findMany(providerCode, filter)

    providerCourses.sort((a,b) => {
      // course name z to a
      // If identical course, ordering falls back to the provider, if identical providers, ordering falls back to the course code
      if (parseInt(sort) === 1) {
        return b.name.localeCompare(a.name) || a.trainingProvider.name.localeCompare(b.trainingProvider.name) || a.code.localeCompare(b.code)
      }
      // course name a to z (default)
      // If identical course, ordering falls back to the provider, if identical providers, ordering falls back to the course code
      else {
        return a.name.localeCompare(b.name) || a.trainingProvider.name.localeCompare(b.trainingProvider.name) || a.code.localeCompare(b.code)
      }
    })

    return providerCourses
  },

  // https://api.publish-teacher-training-courses.service.gov.uk/docs/api-reference.html#recruitment_cycles-year-providers-provider_code-locations-get
  getProviderLocations (providerCode) {
    try {
      const providerLocations = providerLocationModel.findMany(providerCode)
      return providerLocations
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = teacherTrainingService
