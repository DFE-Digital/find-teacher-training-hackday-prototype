const teacherTrainingService = require('../services/teacher-training')

const paginationHelper = require('../helpers/pagination')
const utilsHelper = require('../helpers/utils')

exports.closed = async (req, res) => {
  res.render('closed')
}

exports.list = async (req, res) => {
  const defaults = req.session.data.defaults

  // Search
  const keywords = req.session.data.keywords

  const hasSearch = !!((keywords))

  // Filters
  const subject = null
  const studyMode = null
  const qualification = null
  const degreeGrade = null
  const send = null
  const vacancy = null
  const visaSponsorship = null
  const fundingType = null
  const campaign = null
  const providerType = null

  const subjects = utilsHelper.getCheckboxValues(subject, req.session.data.filter.subject)

  let studyModes
  if (req.session.data.filter?.studyMode) {
    studyModes = utilsHelper.getCheckboxValues(studyMode, req.session.data.filter.studyMode)
  } else {
    studyModes = defaults.studyMode
  }

  let qualifications
  if (req.session.data.filter?.qualification) {
    qualifications = utilsHelper.getCheckboxValues(qualification, req.session.data.filter.qualification)
  } else {
    qualifications = defaults.qualification
  }

  let degreeGrades
  if (req.session.data.filter?.degreeGrade) {
    degreeGrades = utilsHelper.getCheckboxValues(degreeGrade, req.session.data.filter.degreeGrade)
  } else {
    degreeGrades = defaults.degreeGrade
  }

  const sends = utilsHelper.getCheckboxValues(send, req.session.data.filter.send)

  let vacancies
  if (req.session.data.filter?.vacancy) {
    vacancies = utilsHelper.getCheckboxValues(vacancy, req.session.data.filter.vacancy)
  } else {
    vacancies = defaults.vacancy
  }

  const visaSponsorships = utilsHelper.getCheckboxValues(visaSponsorship, req.session.data.filter.visaSponsorship)
  const fundingTypes = utilsHelper.getCheckboxValues(fundingType, req.session.data.filter.fundingType)

  const campaigns = utilsHelper.getCheckboxValues(campaign, req.session.data.filter.campaign)

  const providerTypes = utilsHelper.getCheckboxValues(providerType, req.session.data.filter.providerType)

  const hasFilters = !!((subjects?.length > 0)
    || (studyModes?.length > 0)
    || (qualifications?.length > 0)
    || (degreeGrades?.length > 0)
    || (sends?.length > 0)
    || (vacancies?.length > 0)
    || (visaSponsorships?.length > 0)
    || (fundingTypes?.length > 0)
    || (campaigns?.length > 0)
    || (providerTypes?.length > 0)
  )

  let selectedFilters = null

  if (hasFilters) {
    selectedFilters = {
      categories: []
    }

    if (subjects?.length) {
      selectedFilters.categories.push({
        heading: { text: 'Subject' },
        items: subjects.map((subject) => {
          return {
            text: utilsHelper.getSubjectLabel(subject),
            href: `/results/remove-subject-filter/${subject}`
          }
        })
      })
    }

    if (campaigns?.length) {
      selectedFilters.categories.push({
        heading: { text: 'Engineers teach physics' },
        items: campaigns.map((campaign) => {
          return {
            text: utilsHelper.getCampaignLabel(campaign),
            href: `/results/remove-campaign-filter/${campaign}`
          }
        })
      })
    }

    if (sends?.length) {
      selectedFilters.categories.push({
        heading: { text: 'Special educational needs' },
        items: sends.map((send) => {
          return {
            text: utilsHelper.getSendLabel(send),
            href: `/results/remove-send-filter/${send}`
          }
        })
      })
    }

    if (vacancies?.length) {
      selectedFilters.categories.push({
        heading: { text: 'Vacancies' },
        items: vacancies.map((vacancy) => {
          return {
            text: utilsHelper.getVacancyLabel(vacancy),
            href: `/results/remove-vacancy-filter/${vacancy}`
          }
        })
      })
    }

    if (studyModes?.length) {
      selectedFilters.categories.push({
        heading: { text: 'Full time or part time' },
        items: studyModes.map((studyMode) => {
          return {
            text: utilsHelper.getStudyModeLabel(studyMode),
            href: `/results/remove-study-mode-filter/${studyMode}`
          }
        })
      })
    }

    if (qualifications?.length) {
      selectedFilters.categories.push({
        heading: { text: 'Qualification' },
        items: qualifications.map((qualification) => {
          return {
            text: utilsHelper.getQualificationLabel(qualification),
            href: `/results/remove-qualification-filter/${qualification}`
          }
        })
      })
    }

    if (degreeGrades?.length) {
      selectedFilters.categories.push({
        heading: { text: 'Degree required' },
        items: degreeGrades.map((degreeGrade) => {
          return {
            text: utilsHelper.getDegreeGradeLabel(degreeGrade),
            href: `/results/remove-degree-grade-filter/${degreeGrade}`
          }
        })
      })
    }

    if (visaSponsorships?.length) {
      selectedFilters.categories.push({
        heading: { text: 'Degree required' },
        items: visaSponsorships.map((visaSponsorship) => {
          return {
            text: utilsHelper.getVisaSponsorshipLabel(visaSponsorship),
            href: `/results/remove-visa-sponsorship-filter/${visaSponsorship}`
          }
        })
      })
    }

    if (fundingTypes?.length) {
      selectedFilters.categories.push({
        heading: { text: 'Salary' },
        items: fundingTypes.map((fundingType) => {
          return {
            text: utilsHelper.getFundingTypeLabel(fundingType),
            href: `/results/remove-funding-type-filter/${fundingType}`
          }
        })
      })
    }

    if (providerTypes?.length) {
      selectedFilters.categories.push({
        heading: { text: 'Provider type' },
        items: providerTypes.map((providerType) => {
          return {
            text: utilsHelper.getProviderTypeLabel(providerType),
            href: `/results/remove-provider-type-filter/${providerType}`
          }
        })
      })
    }
  }

  let selectedSubject
  if (req.session.data.filter?.subject) {
    selectedSubject = req.session.data.filter.subject
  } else {
    selectedSubject = defaults.subject
  }

  const subjectItems = utilsHelper.getSubjectItems(selectedSubject, req.session.data.ageGroup)

  // get an array of selected subjects for use in the search terms subject list
  const selectedSubjects = utilsHelper.getSelectedSubjectItems(subjectItems.filter(subject => subject.checked === 'checked'))

  let selectedSend
  if (req.session.data.filter?.send) {
    selectedSend = req.session.data.filter.send
  } else {
    selectedSend = defaults.send
  }

  // req.session.data.filter.send = selectedSend

  const sendItems = utilsHelper.getSendItems(selectedSend)

  let selectedVacancy
  if (req.session.data.filter?.vacancy) {
    selectedVacancy = req.session.data.filter.vacancy
  } else if (req.query.filter?.vacancy === '_unchecked') {
    selectedVacancy = ['exclude']
  } else {
    selectedVacancy = defaults.vacancy
  }

  req.session.data.filter.vacancy = selectedVacancy

  const vacancyItems = utilsHelper.getVacancyItems(selectedVacancy)

  let selectedStudyMode
  if (req.session.data.filter?.studyMode) {
    selectedStudyMode = req.session.data.filter.studyMode
  } else {
    selectedStudyMode = defaults.studyMode
  }

  const studyModeItems = utilsHelper.getStudyModeItems(selectedStudyMode)

  let selectedQualification
  if (req.session.data.filter?.qualification) {
    selectedQualification = req.session.data.filter.qualification
  } else {
    // if the subject is further education, set the defaults to FE qualifications
    if (req.session.data.filter?.subject?.includes('41')) {
      selectedQualification = ['pgce','pgde']
    } else {
      selectedQualification = defaults.qualification
    }
  }

  let qualificationItems = []
  if (req.session.data.filter?.subject?.includes('41')) {
    qualificationItems = utilsHelper.getQualificationItems(selectedQualification, 'furtherEducation')
  } else {
    qualificationItems = utilsHelper.getQualificationItems(selectedQualification, req.session.data.ageGroup)
  }

  let selectedDegreeGrade
  if (req.session.data.filter?.degreeGrade) {
    selectedDegreeGrade = req.session.data.filter.degreeGrade
  } else {
    selectedDegreeGrade = defaults.degreeGrade
  }

  const degreeGradeItems = utilsHelper.getDegreeGradeItems(selectedDegreeGrade)

  let selectedVisaSponsorship
  if (req.session.data.filter?.visaSponsorship) {
    selectedVisaSponsorship = req.session.data.filter.visaSponsorship
  } else {
    selectedVisaSponsorship = defaults.visaSponsorship
  }

  const visaSponsorshipItems = utilsHelper.getVisaSponsorshipItems(selectedVisaSponsorship)

  let selectedFundingType
  if (req.session.data.filter?.fundingType) {
    selectedFundingType = req.session.data.filter.fundingType
  } else {
    selectedFundingType = defaults.fundingType
  }

  const fundingTypeItems = utilsHelper.getFundingTypeItems(selectedFundingType)

  let selectedCampaign
  if (req.session.data.filter?.campaign) {
    selectedCampaign = req.session.data.filter.campaign
  } else {
    selectedCampaign = defaults.campaign
  }

  const campaignItems = utilsHelper.getCampaignItems(selectedCampaign)

  let selectedProviderType
  if (req.session.data.filter?.providerType) {
    selectedProviderType = req.session.data.filter.providerType
  } else {
    selectedProviderType = defaults.providerType
  }

  const providerTypeItems = utilsHelper.getProviderTypeItems(selectedProviderType)

  // Search radius - 5, 10, 50
  // default to 50
  // needed to get a list of results rather than 1
  const radius = req.session.data.radius || req.query.radius || defaults.radius

  // Search query
  const q = req.session.data.q || req.query.q

  // Location
  const latitude = req.session.data.latitude || req.query.latitude || defaults.latitude
  const longitude = req.session.data.longitude || req.query.longitude || defaults.longitude

  // API query params
  // https://api.publish-teacher-training-courses.service.gov.uk/docs/api-reference.html#schema-coursefilter
  const filter = {
    findable: true,
    qualification: selectedQualification,
    study_type: selectedStudyMode,
    subjects: selectedSubject
  }

  if (selectedFundingType[0] === 'include') {
    filter.funding_type = ['salary']
  } else {
    filter.funding_type = selectedFundingType
  }

  // TODO: move provider_type into filter
  // provider_type = selectedProviderType.toString()

  // TODO: change the degreeGrade filter from radio to checkbox to manage grades properly
  if (selectedDegreeGrade === 'two_two') {
    filter.degree_grade = ['two_two','third_class','not_required']
  } else if (selectedDegreeGrade === 'third_class') {
    filter.degree_grade = ['third_class','not_required']
  } else if (selectedDegreeGrade === 'not_required') {
    filter.degree_grade = ['not_required']
  }

  if (selectedSend[0] === 'include') {
    filter.send_courses = true
  }

  if (selectedVacancy[0] === 'include') {
    filter.has_vacancies = true
  }

  if (selectedVisaSponsorship[0] === 'include') {
    filter.can_sponsor_visa = true
  }

  if (selectedCampaign[0] === 'include') {
    filter.campaign_name = 'engineers_teach_physics'
  }


  // sort by settings
  const sort = req.query.sort || req.session.data.sort || 0
  const sortItems = utilsHelper.getCourseSortBySelectOptions(sort)

  // pagination settings
  const page = req.query.page || 1
  const perPage = 20

  const hasSearchPhysics = !!(selectedSubjects.find(subject => subject.text === 'Physics'))
  try {
    let courseListResponse

    if (q === 'provider') {
      console.log('provider');
      courseListResponse = await teacherTrainingService.getProviderCourses(req.session.data.provider.code, filter, sort)
    } else if (q === 'location') {
      if (radius) {
        filter.latitude = latitude
        filter.longitude = longitude
        filter.radius = radius
      }
      courseListResponse = await teacherTrainingService.getCourses(filter, page, perPage, sort)
    } else {
      // England-wide search
      courseListResponse = await teacherTrainingService.getCourses(filter, sort)
    }

    let courses = courseListResponse

    if (courses.length > 0) {

      // decorate provider
      // const provider = await teacherTrainingService.getProvider()
      // course.provider = provider

    }

    const pagination = paginationHelper.getPagination(courses, req.query.page, req.query.limit)

    courses = paginationHelper.getDataByPage(courses, req.query.page, req.query.limit)

    const subjectItemsDisplayLimit = 10

    res.render('../views/results/index', {
      courses,
      pagination,
      subjectItems,
      subjectItemsDisplayLimit,
      selectedSubjects,
      sendItems,
      vacancyItems,
      studyModeItems,
      qualificationItems,
      degreeGradeItems,
      visaSponsorshipItems,
      fundingTypeItems,
      campaignItems,
      providerTypeItems,
      selectedFilters,
      hasFilters,
      hasSearch,
      hasSearchPhysics,
      keywords,
      sort,
      sortItems,
      actions: {
        view: '/course/',
        filters: {
          apply: '/results',
          remove: '/results/remove-all-filters'
        },
        search: {
          find: '/results',
          remove: '/results/remove-keyword-search'
        }
      }
    })

  } catch (error) {
    console.error(error.stack)
    res.render('error', {
      title: error.name,
      content: error
    })
  }

}

exports.removeKeywordSearch = (req, res) => {
  delete req.session.data.keywords
  delete req.session.data.provider
  delete req.session.data.q
  res.redirect('/results')
}

exports.removeSubjectFilter = (req, res) => {
  req.session.data.filter.subject = utilsHelper.removeFilter(req.params.subject, req.session.data.filter.subject)
  res.redirect('/results')
}

exports.removeSendFilter = (req, res) => {
  req.session.data.filter.send = utilsHelper.removeFilter(req.params.send, req.session.data.filter.send)
  res.redirect('/results')
}

exports.removeVacancyFilter = (req, res) => {
  req.session.data.filter.vacancy = utilsHelper.removeFilter(req.params.vacancy, req.session.data.filter.vacancy)
  res.redirect('/results')
}

exports.removeStudyModeFilter = (req, res) => {
  req.session.data.filter.studyMode = utilsHelper.removeFilter(req.params.studyMode, req.session.data.filter.studyMode)
  res.redirect('/results')
}

exports.removeQualificationFilter = (req, res) => {
  req.session.data.filter.qualification = utilsHelper.removeFilter(req.params.qualification, req.session.data.filter.qualification)
  res.redirect('/results')
}

exports.removeDegreeGradeFilter = (req, res) => {
  req.session.data.filter.degreeGrade = utilsHelper.removeFilter(req.params.degreeGrade, req.session.data.filter.degreeGrade)
  res.redirect('/results')
}

exports.removeVisaSponsorshipFilter = (req, res) => {
  req.session.data.filter.visaSponsorship = utilsHelper.removeFilter(req.params.visaSponsorship, req.session.data.filter.visaSponsorship)
  res.redirect('/results')
}

exports.removeFundingTypeFilter = (req, res) => {
  req.session.data.filter.fundingType = utilsHelper.removeFilter(req.params.fundingType, req.session.data.filter.fundingType)
  res.redirect('/results')
}

exports.removeCampaignFilter = (req, res) => {
  req.session.data.filter.campaign = utilsHelper.removeFilter(req.params.campaign, req.session.data.filter.campaign)
  res.redirect('/results')
}

exports.removeProviderTypeFilter = (req, res) => {
  req.session.data.filter.providerType = utilsHelper.removeFilter(req.params.providerType, req.session.data.filter.providerType)
  res.redirect('/results')
}

exports.removeAllFilters = (req, res) => {
  // req.session.data.filter.campaign = null
  // req.session.data.filter.degreeGrade = null
  // req.session.data.filter.fundingType = null
  // req.session.data.filter.providerType = null
  // req.session.data.filter.qualification = null
  // req.session.data.filter.send = null
  // req.session.data.filter.studyMode = null
  // req.session.data.filter.subject = null
  // req.session.data.filter.vacancy = null
  // req.session.data.filter.visaSponsorship = null

  delete req.session.data.filter
  res.redirect('/results')
}
