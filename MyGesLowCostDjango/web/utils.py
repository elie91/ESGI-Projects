def get_user_group(groups):
    if groups.filter(name='student').exists():
        group = 'student'
    elif groups.filter(name='teacher').exists():
        group = 'teacher'
    else:
        group = 'manager'
    return group


def get_student_grades(student):
    promotions = []
    total_grade_per_course = 0
    for promotion in student.promotion_set.all():
        d_promotion = {
            'promotion': promotion,
        }
        courses = []
        average_promotion = 0
        total_coefficient = 0
        for course in promotion.courses.all():
            average_course = 0
            max_course_grade = 0
            for grade in course.grade_set.all():
                if grade.user.id == student.id:
                    average_course += grade.value
                    max_course_grade += 1
            d_course = {
                'course': course,
                'average': False if max_course_grade == 0 else round(average_course / max_course_grade, 2)
            }

            average_promotion += d_course["average"] * course.coefficient

            if max_course_grade > 0:
                total_coefficient += course.coefficient

            courses.append(d_course)
            if max_course_grade > total_grade_per_course:
                total_grade_per_course = max_course_grade
        d_promotion["courses"] = courses
        d_promotion["global_average"] = round(average_promotion / total_coefficient, 2)
        promotions.append(d_promotion)
    return {
        'promotions': promotions,
        'max_grade': total_grade_per_course,
    }


def format_slots(slots):
    events = []
    for slot in slots:
        d_slot = {
            'promotion': slot.promotion.id,
            'title': slot.course.name + " - " + slot.promotion.name,
            'start': slot.start.isoformat(),
            'end': slot.end.isoformat()
        }
        events.append(d_slot)
    return events

