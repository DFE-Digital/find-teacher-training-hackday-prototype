const NodeGeocoder = require('node-geocoder')
const data = require('./data/session-data-defaults')
const teacherTrainingService = require('../app/services/teacher-training')
const subjects = require('./data/subjects')

if (!process.env.GCP_API_KEY) {
  throw Error('Missing GCP_API_KEY – add it to your .env file')
}

const geocoder = NodeGeocoder({
  provider: 'google',
  apiKey: process.env.GCP_API_KEY,
  country: 'United Kingdom'
})

function getRandomInt (max) {
  return Math.floor(Math.random() * max)
}

module.exports = () => {
  const utils = {}

  utils.geocode = async string => {
    try {
      const geoCodedLocation = await geocoder.geocode(`${string}, UK`)
      const geo = geoCodedLocation[0]

      return {
        latitude: geo.latitude,
        longitude: geo.longitude
      }
    } catch (error) {
      return false
    }
  }

  utils.processQuery = async (query, sessionData) => {
    if (query === 'England') {
      sessionData.radius = false
      sessionData.latitude = false
      sessionData.longitude = false

      return 'england'
    }

    if (query === 'location') {
      const location = await utils.geocode(sessionData.locationName)
      if (location) {
        // Get latitude/longitude
        const { latitude, longitude } = location
        sessionData.radius = 50
        sessionData.latitude = latitude
        sessionData.longitude = longitude

        return 'area'
      }
    }

    if (query === 'provider') {
      const providers = await teacherTrainingService.getProviderSuggestions(sessionData.providerName)
      if (providers && providers.data && providers.data[0]) {
        sessionData.provider = providers.data[0].attributes
        return 'provider'
      }
    }
  }

  utils.reverseGeocode = async (lat, lon) => {
    try {
      const geoCodedLocation = await geocoder.reverse({ lat, lon })
      return geoCodedLocation[0]
    } catch (error) {
      console.error('Reverse geocoding error', error)
    }
  }

  utils.toArray = item => {
    return (typeof item === 'string') ? Array(item) : item
  }

  return utils
}
