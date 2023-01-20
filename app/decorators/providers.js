const data = require('../data/session-data-defaults')

exports.decorate = (provider, courses = []) => {
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
