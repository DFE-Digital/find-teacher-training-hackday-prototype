const path = require('path')
const fs = require('fs')

const organisationModel = require('./organisations')
const decorators = require('../decorators/course')

exports.findMany = (providerCode, params) => {
  let courses = []

  // 1. find accredited body courses where the accredited body is providerCode

  // 2. find accedited body courses where the training partner is providerCode

  if (providerCode) {
    const organisation = organisationModel.findOne({
      providerCode: providerCode
    })

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
            course = decorators.decorateCourse(course)
            courses.push(course)
          }
        }
      })
    }

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
  }

  return courses
}
