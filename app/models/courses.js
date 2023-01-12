const path = require('path')
const fs = require('fs')

const organisationModel = require('./organisations')
const utils = require('../utils')()

exports.findMany = (params) => {
  let courses = []

  console.log(params);

  // get all accredited bodies
  const organisations = organisationModel.findMany({
    isAccreditedBody: true
  })

  // put courses into memory
  organisations.forEach((organisation, i) => {
    const directoryPath = path.join(__dirname, '../data/courses/' + organisation.id)

    let documents = fs.readdirSync(directoryPath, 'utf8')
    // Only get JSON documents
    documents = documents.filter(doc => doc.match(/.*\.(json)/ig))

    documents.forEach((filename) => {
      const raw = fs.readFileSync(directoryPath + '/' + filename)
      let course = JSON.parse(raw)

      // only get courses that are published (open or closed), aka 'findable'
      if ([1,4].includes(course.status)) {
        course = utils.decorateCourse(course)

        courses.push(course)
      }
    })
  })

  console.log('All:', courses.length);

  if (params.cycleId) {
    courses = courses.filter(course => course.cycle === params.cycleId)
  }

  console.log('2023:', courses.length);

  if (params.subjects) {
    courses = courses.filter(course => {
      const subjectCodes = course.subjects.map(subject => {
        return subject.code
      })

      return subjectCodes.filter(code => params.subjects.includes(code)).length !== 0
    })
  }

  console.log('Subjects:', courses.length);

  if (params.qualification) {
    courses = courses.filter(course => params.qualification.includes(course.qualification))
  }

  console.log('Quals:', courses.length);

  if (params.study_type) {
    courses = courses.filter(course => params.study_type.includes(course.studyMode))
  }

  console.log('studyMode:', courses.length);

  if (params.funding_type) {
    courses = courses.filter(course => params.funding_type.includes(course.fundingType))
  }

  console.log('fundingType:', courses.length);

  // if (typeof (params.has_vacancies) === 'boolean') {
  //   courses = courses.filter(course => course.hasVacancies === params.has_vacancies)
  // }

  // console.log('Vacancies:', courses.length);

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
