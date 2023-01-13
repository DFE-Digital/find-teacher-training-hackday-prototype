const path = require('path')
const fs = require('fs')

const organisationModel = require('./organisations')
const utils = require('../utils')()

exports.findMany = (params) => {
  let courses = []

  // get all accredited bodies
  const organisations = organisationModel.findMany({
    isAccreditedBody: true
  })

  // put courses into memory
  organisations.forEach((organisation, i) => {
    const directoryPath = path.join(__dirname, `../data/courses/${organisation.id}`)

    if (fs.existsSync(directoryPath)) {
      let documents = fs.readdirSync(directoryPath, 'utf8')
      // Only get JSON documents
      documents = documents.filter(doc => doc.match(/.*\.(json)/ig))

      documents.forEach((filename) => {
        const filePath = `${directoryPath}/${filename}`

        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath)
          let course = JSON.parse(raw)

          // only get courses that are published (open or closed), aka 'findable'
          if ([1,4].includes(course.status)) {
            course = utils.decorateCourse(course)
            courses.push(course)
          }
        }
      })
    }
  })

  if (params.cycleId) {
    courses = courses.filter(course => course.cycle === params.cycleId)
  }

  if (params.subjects) {
    courses = courses.filter(course => {
      const subjectCodes = course.subjects.map(subject => {
        return subject.code
      })

      return subjectCodes.filter(code => params.subjects.includes(code)).length !== 0
    })
  }

  if (params.qualification) {
    courses = courses.filter(course => params.qualification.includes(course.qualification))
  }

  if (params.study_type) {
    courses = courses.filter(course => params.study_type.includes(course.studyMode))
  }

  if (params.funding_type) {
    courses = courses.filter(course => params.funding_type.includes(course.fundingType))
  }

  if (typeof (params.has_vacancies) === 'boolean') {
    courses = courses.filter(course => course.has_vacancies === params.has_vacancies)
  }

  if (params.campaign_name) {
    courses = courses.filter(course => course.campaign_name === params.campaign_name)
  }

  if (params.degree_grade) {
    courses = courses.filter(course => params.degree_grade.includes(course.degreeGrade))
  }

  if (params.send_courses) {
    courses = courses.filter(course => course.isSend === 'yes')
  }

  if (params.can_sponsor_visa) {
    courses = courses.filter(course => course.canSponsorSkilledWorkerVisa === 'yes' || course.canSponsorStudentVisa === 'yes')
  }

  return courses
}

exports.findOne = (params) => {
  let course = {}

  if (params.organisationId && params.courseId) {
    const directoryPath = path.join(__dirname, '../data/courses/' + params.organisationId)

    const filePath = directoryPath + '/' + params.courseId + '.json'

    const raw = fs.readFileSync(filePath)
    course = JSON.parse(raw)
  }

  return course
}
