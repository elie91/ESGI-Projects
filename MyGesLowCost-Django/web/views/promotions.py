import json

from django.core import serializers
from django.db import IntegrityError
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from ..models import Promotion, User
from ..forms.promotions import PromotionForm
from ..decorators import group_required


@group_required(['teacher', 'manager'], login_url='login')
def promotions_list(request):
    data = []
    if request.user.role == 'manager':
        results = Promotion.objects.all()
    else:
        results = Promotion.objects.filter(courses__teacher=request.user).distinct()
    for promo in results:
        values = {}
        students = promo.users.filter(role='student')
        values['count_students'] = len(students)
        values['promotion'] = promo
        data.append(values)
    return render(request, 'web/promotions/list.html', {
        'data': data
    })


@group_required(['teacher', 'manager'], login_url='login')
def promotions_show(request, promotion_id):
    promotion = get_object_or_404(Promotion, pk=promotion_id)
    students = promotion.users.filter(role='student')
    teachers = User.objects.filter(course__promotion=promotion, role='teacher').distinct()
    return render(request, 'web/promotions/show.html', {
        'promotion': promotion,
        'students': students,
        'teachers': teachers
    })


@group_required(['manager'], login_url='login')
def promotions_add(request):
    errors = []
    if request.method == 'POST':
        form = PromotionForm(request.POST)
        if form.is_valid():
            instance = Promotion(
                name=request.POST['name'],
                start=request.POST['start'],
                end=request.POST['end'],
            )
            try:
                instance.save()
                for course in request.POST.getlist('courses'):
                    instance.courses.add(course)

            except IntegrityError as e:
                if 'UNIQUE constraint' in str(e.args):
                    errors.append("Le nom doit être unique")
                else:
                    errors.append("Une erreur est survenue")
            if len(errors) == 0:
                return redirect('promotions')

    else:
        form = PromotionForm()
    return render(request, 'web/promotions/add.html', {'form': form, 'errors': errors})


@group_required(['manager'], login_url='login')
def promotions_edit(request, promotion_id):
    promotion = get_object_or_404(Promotion, pk=promotion_id)
    errors = []
    if request.method == 'POST':
        form = PromotionForm(request.POST)
        if form.is_valid():

            promotion.name = request.POST['name']
            promotion.start = request.POST['start']
            promotion.end = request.POST['end']

            promotion.courses.clear()
            for course in request.POST.getlist('courses'):
                promotion.courses.add(course)

            try:
                promotion.save()

            except IntegrityError as e:
                if 'UNIQUE constraint' in str(e.args):
                    errors.append("Le nom doit être unique")
                else:
                    errors.append("Une erreur est survenue")
            if len(errors) == 0:
                return redirect('promotions')
    else:
        form = PromotionForm(initial={
            'name': promotion.name,
            'start': promotion.start,
            'end': promotion.end,
            'courses': promotion.courses.all()
        })
    return render(request, 'web/promotions/edit.html',
                  {'promotion': promotion, 'form': form, 'edit': True, 'errors': errors})


@group_required(['manager'], login_url='login')
def promotions_delete(request, promotion_id):
    Promotion.objects.filter(id=promotion_id).delete()
    return redirect('promotions')


@group_required(['student'], login_url='login')
def promotions_students(request):
    promotions = []

    for promotion in Promotion.objects.filter(users__exact=request.user):
        d_promotion = {
            'promotion': promotion,
            'students': promotion.users.filter(role='student'),
            'teachers': User.objects.filter(course__promotion=promotion, role='teacher').distinct()
        }
        promotions.append(d_promotion)

    return render(request, 'web/promotions/students.html', {
        'promotions': promotions
    })


@group_required(['manager'], login_url='login')
def promotion_courses(request, promotion_id):
    promotion = get_object_or_404(Promotion, pk=promotion_id)
    courses = serializers.serialize('json', promotion.courses.all())
    return HttpResponse(
        courses,
        content_type="application/json"
    )
