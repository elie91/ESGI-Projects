from django.shortcuts import get_object_or_404, render
from ..models import User
from ..utils import get_student_grades
from ..decorators import group_required


@group_required(['student'], login_url='login')
def grades(request):
    student = get_object_or_404(User, pk=request.user.id)

    student_grades = get_student_grades(student)
    print(student_grades)

    return render(request, 'web/students/grades.html', {
        'student': student,
        'promotions': student_grades.get("promotions"),
        'max': student_grades.get("max_grade")
    })


def student_grades_show(request, student_id):
    student = get_object_or_404(User, pk=student_id)

    student_grades = get_student_grades(student)

    return render(request, 'web/students/grades.html', {
        'student': student,
        'promotions': student_grades.get("promotions"),
        'max': student_grades.get("max_grade"),
        'teacher': True
    })
