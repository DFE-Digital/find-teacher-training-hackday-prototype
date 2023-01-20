const data = require('../data/session-data-defaults')
const subjects = require('../data/subjects')

exports.decorate = (course) => {
  course.subject_codes = course.subjects.map(subject => subject.code)

  // Subject knowledge enhancements
  const subjectCodesWithSke = subjects
    .filter(subject => subject.hasSke === true)
    .map(subject => subject.code)

  course.has_ske = subjectCodesWithSke.some(code => course.subjects.includes(code))

  // International relocation payments
  const subjectCodesWithIrp = subjects
    .filter(subject => subject.hasIrp === true)
    .map(subject => subject.code)

  course.hasIrp = subjectCodesWithIrp.some(code => course.subjects.includes(code))

  switch (course.studyMode) {
    case 'F':
      course.studyMode = 'full_time'
      break
    case 'P':
      course.studyMode = 'part_time'
      break
  }

  // Bursaries and scholarships
  const subjectFunding = subjects
    .find(subject => subject.code === course.subjects[0].code)
    .funding

  course.has_bursary = false
  course.has_scholarship = false

  if (subjectFunding) {
    if (subjectFunding.bursary) {
      course.bursary_amount = subjectFunding.bursary
      course.has_bursary = true
    }

    if (subjectFunding.scholarship) {
      course.scholarship_amount = subjectFunding.scholarship
      course.has_scholarship = true
    }
  }

  course.has_fees = course.fundingType === 'fee'
  course.has_salary = course.fundingType === 'salary' || course.fundingType === 'apprenticeship'
  course.has_bursary_only = course.has_bursary && !course.has_scholarship
  course.has_scholarship_and_bursary = course.has_bursary && course.has_scholarship

  if (course.has_salary) {
    course.funding_option = 'Salary'
  } else if (course.has_scholarship_and_bursary) {
    course.funding_option = 'Scholarships or bursaries, as well as student finance, are available if you’re eligible'
  } else if (course.has_bursary) {
    course.funding_option = 'Bursaries and student finance are available if you’re eligible'
  } else {
    course.funding_option = 'Student finance if you’re eligible'
  }

  if (course.has_scholarship) {
    if (course.subjects.length === 1) {
      switch (course.subjects[0].code) {
        case 'F1': // Chemistry
          course.scholarship_body = 'Royal Society of Chemistry'
          course.scholarship_url = 'https://www.rsc.org/prizes-funding/funding/teacher-training-scholarships/'
          break
        case '11': // Computing
          course.scholarship_body = 'Chartered Institute for IT'
          course.scholarship_url = 'https://www.bcs.org/qualifications-and-certifications/training-and-scholarships-for-teachers/bcs-computer-teacher-scholarships/'
          break
        case 'G1': // Mathematics
          course.scholarship_body = 'Institute of Mathematics and its Applications'
          course.scholarship_url = 'http://teachingmathsscholars.org/about'
          break
        case 'F3': // Physics
          course.scholarship_body = 'Institute of Physics'
          course.scholarship_url = 'https://www.iop.org/about/support-grants/iop-teacher-training-scholarships'
          break
        case '15': // French
        case '17': // German
        case '22': // Spanish
          course.scholarship_body = 'British Council'
          course.scholarship_url = 'https://www.britishcouncil.org/'
          break
      }
    }
  }

  course.fees_domestic = course.feesUK
  course.fees_international = course.feesInternational

  // Vacancies
  // B - full time and part time
  // P - part time
  // F - full time
  // empty string - no vacancies
  course.has_vacancies = false

  course.locations.forEach((location, i) => {
    if (['F','P','B'].includes(location.vacancies)) {
      course.has_vacancies = true
    }
  })

  // Degree grade
  // 1 - two_one
  // 2 - two_two
  // 3 - third_class
  // 9 - not_required
  switch (course.degreeGrade) {
    case "1":
      course.degreeGrade = 'two_one'
      break
    case "2":
      course.degreeGrade = 'two_two'
      break
    case "3":
      course.degreeGrade = 'third_class'
      break
    default:
      course.degreeGrade = 'not_required'
  }

  // GCSEs
  course.gcse_grade_required = course.english || course.maths

  // Visa sponsorship
  course.visaSponsorship = {
    canSponsorSkilledWorkerVisa: false,
    canSponsorStudentVisa: false
  }

  if (course.canSponsorSkilledWorkerVisa === 'yes') {
    course.visaSponsorship.canSponsorSkilledWorkerVisa = true
  }

  if (course.canSponsorStudentVisa === 'yes') {
    course.visaSponsorship.canSponsorStudentVisa = true
  }

  // Year range
  course.year_range = `${data.cycle} to ${Number(data.cycle) + 1}`

  return course
}
