const express = require('express')
const router = express.Router()

// Controller modules
const courseController = require('./controllers/courses')
const resultsController = require('./controllers/results')
const searchController = require('./controllers/search')
const partnerController = require('./controllers/partner')

const checkHasSearchParams = (req, res, next) => {
  if (!req.session.data?.filter?.subject) {
    res.redirect('/')
  } else {
    next()
  }
}

/// ------------------------------------------------------------------------ ///
/// ALL ROUTES
/// ------------------------------------------------------------------------ ///
router.all('*', (req, res, next) => {
  res.locals.referrer = req.query.referrer
  res.locals.query = req.query
  next()
})

router.get('/', async (req, res) => {
  if (process.env.SHOW_START_PAGE === 'true') {
    res.render('start')
  } else {
    res.redirect('/search')
  }
})

/// ------------------------------------------------------------------------ ///
/// SEARCH ROUTES
/// ------------------------------------------------------------------------ ///

router.get('/search', searchController.search_get)
router.post('/search', searchController.search_post)

router.get('/age-groups', searchController.age_groups_get)
router.post('/age-groups', searchController.age_groups_post)

router.get('/primary-subjects', searchController.primary_subjects_get)
router.post('/primary-subjects', searchController.primary_subjects_post)

router.get('/secondary-subjects', searchController.secondary_subjects_get)
router.post('/secondary-subjects', searchController.secondary_subjects_post)

/// ------------------------------------------------------------------------ ///
/// AUTOCOMPLETE ROUTES
/// ------------------------------------------------------------------------ ///

router.get('/location-suggestions', searchController.location_suggestions_json)

router.get('/provider-suggestions', searchController.provider_suggestions_json)

/// ------------------------------------------------------------------------ ///
/// RESULTS ROUTES
/// ------------------------------------------------------------------------ ///

router.get('/closed', resultsController.closed)

router.get('/results', checkHasSearchParams, resultsController.list)

router.get('/results/remove-keyword-search', resultsController.removeKeywordSearch)

router.get('/results/remove-campaign-filter/:campaign', resultsController.removeCampaignFilter)
router.get('/results/remove-degree-grade-filter/:degreeGrade', resultsController.removeDegreeGradeFilter)
router.get('/results/remove-funding-type-filter/:fundingType', resultsController.removeFundingTypeFilter)
router.get('/results/remove-provider-type-filter/:providerType', resultsController.removeProviderTypeFilter)
router.get('/results/remove-qualification-filter/:qualification', resultsController.removeQualificationFilter)
router.get('/results/remove-send-filter/:send', resultsController.removeSendFilter)
router.get('/results/remove-study-mode-filter/:studyMode', resultsController.removeStudyModeFilter)
router.get('/results/remove-subject-filter/:subject', resultsController.removeSubjectFilter)
router.get('/results/remove-vacancy-filter/:vacancy', resultsController.removeVacancyFilter)
router.get('/results/remove-visa-sponsorship-filter/:visaSponsorship', resultsController.removeVisaSponsorshipFilter)

router.get('/results/remove-all-filters', resultsController.removeAllFilters)

/// ------------------------------------------------------------------------ ///
/// COURSES ROUTES
/// ------------------------------------------------------------------------ ///

router.get('/providers/:providerCode/courses/:courseCode', courseController.show)

router.get('/course/:providerCode/:courseCode', courseController.show)

/// ------------------------------------------------------------------------ ///
/// COURSES ROUTES
/// ------------------------------------------------------------------------ ///

router.get('/providers/:providerCode/courses/:courseCode/partners/:partnerCode', partnerController.show)


/// ------------------------------------------------------------------------ ///
/// PROTOTYPE ADMIN
/// ------------------------------------------------------------------------ ///

router.get('/admin/clear-data', (req, res) => {
  delete req.session.data
  res.redirect('/')
})

/// ------------------------------------------------------------------------ ///
/// ERRORS
/// ------------------------------------------------------------------------ ///

// page not found - 404
// https://design-system.service.gov.uk/patterns/page-not-found-pages/
router.get('/404', (req, res) => {
  res.render('./404')
})

// internal server error - 500
// https://design-system.service.gov.uk/patterns/problem-with-the-service-pages/
router.get('/500', (req, res) => {
  res.render('./500')
})

// service unavailable
// https://design-system.service.gov.uk/patterns/service-unavailable-pages/
router.get('/503', (req, res) => {
  res.render('./503')
})

// page not found
router.get('*', (req, res) => {
  res.render('./404')
})

/// ------------------------------------------------------------------------ ///
/// END
/// ------------------------------------------------------------------------ ///
module.exports = router
