from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from ..models import Promotion, User, Course
from ..utils import get_student_grades


@login_required(login_url='login')
def home(request):
    student_data = {}
    manager_data = {}
    teacher_data = {}

    if request.user.role == 'student':
        student_data['promo'] = Promotion.objects.filter(users=request.user)[:1]
        if request.user.grade_set.count() == 0:
            student_data['average'] = ''
        else:
            student_data['average'] = get_student_grades(request.user)

    if request.user.role == 'manager':
        manager_data['promotions'] = Promotion.objects.count()
        manager_data['courses'] = Course.objects.count()
        manager_data['students'] = User.objects.filter(role='student').count()
        manager_data['teachers'] = User.objects.filter(role='teacher').count()

    if request.user.role == 'teacher':
        teacher_data['promos'] = Promotion.objects.filter(courses__teacher=request.user).distinct()

    return render(request, 'web/index/index.html', {
        'role': request.user.role,
        'student_data': student_data,
        'manager_data': manager_data,
        'teacher_data': teacher_data,
    })