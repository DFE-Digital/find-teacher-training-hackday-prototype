const _ = require('lodash')
const got = require('got')
const qs = require('qs')
const CacheService = require('../services/cache.js')
// const data = require('../data/session-data-defaults')

const data = {
  apiEndpoint: 'https://api.publish-teacher-training-courses.service.gov.uk/api/public/v1',
  cycle: '2023'
}

const courseModel = require('../models/courses')
const providerModel = require('../models/providers')
const providerCourseModel = require('../models/provider-courses')

// const ttl = 60 * 60 * 24 * 30 // cache for 30 days
const ttl = 0
const cache = new CacheService(ttl) // Create a new cache service instance

const teacherTrainingService = {
  // https://api.publish-teacher-training-courses.service.gov.uk/docs/api-reference.html#recruitment_cycles-year-courses-get
  async getCourses (filter, sort) {
    filter.cycleId = data.cycle
    const courseListResponse = courseModel.findMany(filter)

    courseListResponse.sort((a,b) => {
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

    return courseListResponse
  },

  // https://api.publish-teacher-training-courses.service.gov.uk/docs/api-reference.html#recruitment_cycles-year-providers-provider_code-courses-course_code-get
  async getCourse (providerCode, courseCode) {
    try {
      const courseSingleResponse = courseModel.findOne({providerCode, courseCode})
      return courseSingleResponse
    } catch (error) {
      console.error(error)
    }
  },

  // https://api.publish-teacher-training-courses.service.gov.uk/docs/api-reference.html#recruitment_cycles-year-providers-provider_code-courses-course_code-locations-get
  async getCourseLocations (providerCode, courseCode) {
    const query = {
      include: 'course,location_status,provider'
    }

    const key = `courseLocationListResponse_${data.cycle}-${providerCode}-${courseCode}-${JSON.stringify(query)}`
    const courseLocationListResponse = await cache.get(key, async () => await got(`${data.apiEndpoint}/recruitment_cycles/${data.cycle}/providers/${providerCode}/courses/${courseCode}/locations?${qs.stringify(query)}`).json())
    return courseLocationListResponse
  },

  // https://api.publish-teacher-training-courses.service.gov.uk/docs/api-reference.html#provider_suggestions-get
  async getProviderSuggestions (query) {
    const key = `providerSuggestionListResponse_${query}`
    const providerSuggestionListResponse = await cache.get(key, async () => await got(`${data.apiEndpoint}/provider_suggestions?query=${query}`).json())
    return providerSuggestionListResponse
  },

  // https://api.publish-teacher-training-courses.service.gov.uk/docs/api-reference.html#recruitment_cycles-year-providers-get
  async getProviders (filter, page = 1, perPage = 20, sortBy = 0) {
    let sort = 'name'
    if (sortBy === 1) {
      sort = '-name'
    }

    const query = {
      filter,
      include: 'recruitment_cycle',
      page,
      per_page: perPage,
      sort
    }

    const key = `providerListResponse_${data.cycle}-${page}-${perPage}-${JSON.stringify(query)}`
    const providerListResponse = await cache.get(key, async () => await got(`${data.apiEndpoint}/recruitment_cycles/${data.cycle}/providers?${qs.stringify(query)}`).json())
    return providerListResponse
  },

  // https://api.publish-teacher-training-courses.service.gov.uk/docs/api-reference.html#recruitment_cycles-year-providers-provider_code-get
  async getProvider (providerCode) {
    try {
      const providerSingleResponse = providerModel.findOne({
        code: providerCode
      })
      return providerSingleResponse
    } catch (error) {
      console.error(error)
    }
  },

  // https://api.publish-teacher-training-courses.service.gov.uk/docs/api-reference.html#recruitment_cycles-year-providers-provider_code-courses-get
  async getProviderCourses (providerCode, filter, sort) {
    filter.cycleId = data.cycle
    const providerCourseListResponse = providerCourseModel.findMany(providerCode, filter)

    providerCourseListResponse.sort((a,b) => {
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

    return providerCourseListResponse
  },

  // https://api.publish-teacher-training-courses.service.gov.uk/docs/api-reference.html#recruitment_cycles-year-providers-provider_code-locations-get
  async getProviderLocations (providerCode) {
    const query = {
      include: 'provider,recruitment_cycle'
    }

    const key = `providerLocationListResponse_${data.cycle}-${providerCode}-${JSON.stringify(query)}`
    const providerLocationListResponse = await cache.get(key, async () => await got(`${data.apiEndpoint}/recruitment_cycles/${data.cycle}/providers/${providerCode}/locations?${qs.stringify(query)}`).json())
    return providerLocationListResponse
  }
}

module.exports = teacherTrainingService
