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

  // utils.decorateCourse = course => {
  //   course.subject_codes = course.subjects.map(subject => subject.code)
  //
  //   // Subject knowledge enhancements
  //   const subjectCodesWithSke = subjects
  //     .filter(subject => subject.hasSke === true)
  //     .map(subject => subject.code)
  //
  //   course.has_ske = subjectCodesWithSke.some(code => course.subjects.includes(code))
  //
  //   // International relocation payments
  //   const subjectCodesWithIrp = subjects
  //     .filter(subject => subject.hasIrp === true)
  //     .map(subject => subject.code)
  //
  //   course.hasIrp = subjectCodesWithIrp.some(code => course.subjects.includes(code))
  //
  //   switch (course.studyMode) {
  //     case 'F':
  //       course.studyMode = 'full_time'
  //       break
  //     case 'P':
  //       course.studyMode = 'part_time'
  //       break
  //   }
  //
  //   // Bursaries and scholarships
  //   const subjectFunding = subjects
  //     .find(subject => subject.code === course.subjects[0].code)
  //     .funding
  //
  //   course.has_bursary = false
  //   course.has_scholarship = false
  //
  //   if (subjectFunding) {
  //     if (subjectFunding.bursary) {
  //       course.bursary_amount = subjectFunding.bursary
  //       course.has_bursary = true
  //     }
  //
  //     if (subjectFunding.scholarship) {
  //       course.scholarship_amount = subjectFunding.scholarship
  //       course.has_scholarship = true
  //     }
  //   }
  //
  //   course.has_fees = course.fundingType === 'fee'
  //   course.has_salary = course.fundingType === 'salary' || course.fundingType === 'apprenticeship'
  //   course.has_bursary_only = course.has_bursary && !course.has_scholarship
  //   course.has_scholarship_and_bursary = course.has_bursary && course.has_scholarship
  //
  //   if (course.has_salary) {
  //     course.funding_option = 'Salary'
  //   } else if (course.has_scholarship_and_bursary) {
  //     course.funding_option = 'Scholarships or bursaries, as well as student finance, are available if you’re eligible'
  //   } else if (course.has_bursary) {
  //     course.funding_option = 'Bursaries and student finance are available if you’re eligible'
  //   } else {
  //     course.funding_option = 'Student finance if you’re eligible'
  //   }
  //
  //   if (course.has_scholarship) {
  //     if (course.subjects.length === 1) {
  //       switch (course.subjects[0].code) {
  //         case 'F1': // Chemistry
  //           course.scholarship_body = 'Royal Society of Chemistry'
  //           course.scholarship_url = 'https://www.rsc.org/prizes-funding/funding/teacher-training-scholarships/'
  //           break
  //         case '11': // Computing
  //           course.scholarship_body = 'Chartered Institute for IT'
  //           course.scholarship_url = 'https://www.bcs.org/qualifications-and-certifications/training-and-scholarships-for-teachers/bcs-computer-teacher-scholarships/'
  //           break
  //         case 'G1': // Mathematics
  //           course.scholarship_body = 'Institute of Mathematics and its Applications'
  //           course.scholarship_url = 'http://teachingmathsscholars.org/about'
  //           break
  //         case 'F3': // Physics
  //           course.scholarship_body = 'Institute of Physics'
  //           course.scholarship_url = 'https://www.iop.org/about/support-grants/iop-teacher-training-scholarships'
  //           break
  //         case '15': // French
  //         case '17': // German
  //         case '22': // Spanish
  //           course.scholarship_body = 'British Council'
  //           course.scholarship_url = 'https://www.britishcouncil.org/'
  //           break
  //       }
  //     }
  //   }
  //
  //   course.fees_domestic = course.feesUK
  //   course.fees_international = course.feesInternational
  //
  //   // Vacancies
  //   // B - full time and part time
  //   // P - part time
  //   // F - full time
  //   // empty string - no vacancies
  //   course.has_vacancies = false
  //
  //   course.locations.forEach((location, i) => {
  //     if (['F','P','B'].includes(location.vacancies)) {
  //       course.has_vacancies = true
  //     }
  //   })
  //
  //   // Degree grade
  //   // 1 - two_one
  //   // 2 - two_two
  //   // 3 - third_class
  //   // 9 - not_required
  //   switch (course.degreeGrade) {
  //     case "1":
  //       course.degreeGrade = 'two_one'
  //       break
  //     case "2":
  //       course.degreeGrade = 'two_two'
  //       break
  //     case "3":
  //       course.degreeGrade = 'third_class'
  //       break
  //     default:
  //       course.degreeGrade = 'not_required'
  //   }
  //
  //   // GCSEs
  //   course.gcse_grade_required = course.english || course.maths
  //
  //   // Visa sponsorship
  //   course.visaSponsorship = {
  //     canSponsorSkilledWorkerVisa: false,
  //     canSponsorStudentVisa: false
  //   }
  //
  //   if (course.canSponsorSkilledWorkerVisa === 'yes') {
  //     course.visaSponsorship.canSponsorSkilledWorkerVisa = true
  //   }
  //
  //   if (course.canSponsorStudentVisa === 'yes') {
  //     course.visaSponsorship.canSponsorStudentVisa = true
  //   }
  //
  //   // Year range
  //   course.year_range = `${data.cycle} to ${Number(data.cycle) + 1}`
  //
  //   return course
  // }

  // utils.decorateLocation = location => {
  //
  //   return location
  // }

  utils.decorateProvider = (provider, courses = []) => {
    // is_accredited_body
    provider.is_accredited_body = !!(provider.provider_type === 'university' || provider.provider_type === 'scitt')

    // visa sponsorship
    provider.can_sponsor_visas = !!(provider.can_sponsor_student_visa || provider.can_sponsor_skilled_worker_visa)
    provider.can_sponsor_both_visas = !!(provider.can_sponsor_student_visa && provider.can_sponsor_skilled_worker_visa)
    provider.can_sponsor_student_visas_only = provider.can_sponsor_student_visa && !provider.can_sponsor_skilled_worker_visa
    provider.can_sponsor_skilled_worker_visas_only = !provider.can_sponsor_student_visa && provider.can_sponsor_skilled_worker_visa

    provider.has_primary_courses = false
    provider.primary_courses_count = 0
    provider.has_secondary_courses = false
    provider.secondary_courses_count = 0
    provider.has_further_education_courses = false
    provider.further_education_courses_count = 0

    provider.has_send_courses = false
    provider.send_courses_count = 0

    // TODO: reconcile this down to just 'partners'?
    provider.accredited_bodies = []
    provider.training_partners = []

    if (courses.length > 0) {
      courses.map(courseResource => {
        if (courseResource.course.level === 'primary') {
          provider.has_primary_courses = true
          provider.primary_courses_count += 1
        } else if (courseResource.course.level === 'secondary') {
          provider.has_secondary_courses = true
          provider.secondary_courses_count += 1
        } else if (courseResource.course.level === 'further_education') {
          provider.has_further_education_courses = true
          provider.further_education_courses_count += 1
        }

        if (courseResource.course.is_send) {
          provider.has_send_courses = true
          provider.send_courses_count += 1
        }

        if (provider.is_accredited_body) {
          // if (courseResource.course.accredited_body_code !== courseResource.provider.code) {
          //   const trainingPartner = {}
          //   trainingPartner.code = courseResource.provider.code
          //   trainingPartner.name = courseResource.provider.name
          //   if (!provider.training_partners.find(tp => tp.code === trainingPartner.code)) {
          //     provider.training_partners.push(trainingPartner)
          //   }
          // }
        } else {
          const accreditedBody = {}
          accreditedBody.code = courseResource.course.accredited_body_code
          accreditedBody.name = courseResource.course.accredited_body
          if (!provider.accredited_bodies.find(ab => ab.code === accreditedBody.code)) {
            provider.accredited_bodies.push(accreditedBody)
          }
        }

      })
    }

    provider.offers_subject_levels = []
    if (provider.has_primary_courses) {
      provider.offers_subject_levels.push('primary')
    }
    if (provider.has_secondary_courses) {
      provider.offers_subject_levels.push('secondary')
    }
    if (provider.has_further_education_courses) {
      provider.offers_subject_levels.push('further education')
    }

    return provider
  }

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
