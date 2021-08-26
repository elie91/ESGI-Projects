from django.shortcuts import render, redirect, get_object_or_404
from ..models import Course, Promotion, User, Grade, Document
from django.db import IntegrityError
from ..forms.courses import CourseForm
from ..forms.import_users import ImportCourseSupports
from ..decorators import group_required


@group_required(['teacher', 'manager'], login_url='login')
def courses_list(request):
    if request.user.role == 'manager':
        results = Course.objects.all()
    else:
        results = Course.objects.filter(teacher=request.user)

    return render(request, 'web/courses/list.html', {'courses': results})


@group_required(['teacher', 'manager'], login_url='login')
def courses_show(request, course_id):
    course = get_object_or_404(Course, pk=course_id)
    promotions = Promotion.objects.filter(courses__id=course_id)
    return render(request, 'web/courses/show.html', {
        'course': course,
        'promotions': promotions
    })


@group_required(['teacher', 'manager'], login_url='login')
def courses_notation(request, course_id):
    course = get_object_or_404(Course, pk=course_id)
    promotions = Promotion.objects.filter(courses__id=course_id)
    if request.method == 'POST':
        data = []
        for key, notation in request.POST.items():
            splited = key.split('_')
            if splited[0] == 'notation' and len(notation) > 0:
                values = {'note': notation, 'student': splited[1]}
                data.append(values)
        for notation in data:
            instance = Grade(
                value=notation['note'],
                user=get_object_or_404(User, pk=notation['student']),
                course=course
            )
            instance.save()
        return redirect('courses_show', course_id=course.id)

    return render(request, 'web/courses/notation.html', {
        'course': course,
        'promotions': promotions
    })


@group_required(['manager'], login_url='login')
def courses_add(request):
    errors = []
    if request.method == 'POST':
        form = CourseForm(request.POST)
        if form.is_valid():
            instance = Course(
                name=request.POST['name'],
                coefficient=request.POST['coefficient']
            )
            try:
                instance.save()
            except IntegrityError as e:
                errors.append("Une erreur est survenue")
            return redirect('courses')
    else:
        form = CourseForm()
    return render(request, 'web/courses/add.html', {'form': form, 'errors': errors})


@group_required(['manager'], login_url='login')
def courses_edit(request, course_id):
    course = get_object_or_404(Course, pk=course_id)
    errors = []
    if request.method == 'POST':
        form = CourseForm(request.POST)
        if form.is_valid():
            course.name = request.POST['name']
            course.coefficient = request.POST['coefficient']
            if request.POST['teacher']:
                teacher = User.objects.filter(id=int(request.POST['teacher']))[0]
                course.teacher = teacher
        try:
            course.save()
        except IntegrityError as e:
            errors.append(e)
        return redirect('courses')
    else:
        form = CourseForm(initial={
            'name': course.name,
            'coefficient': course.coefficient,
            'teacher': course.teacher
        })

    return render(request, 'web/courses/edit.html', {'course': course, 'form': form, 'edit': True})


@group_required(['manager'], login_url='login')
def courses_delete(request, course_id):
    Course.objects.filter(id=course_id).delete()
    return redirect('courses')



def courses_supports(request):
    courses = Course.objects.filter(document__type='C').distinct()
    return render(request, 'web/courses/supports.html', {
        'courses': courses
    })


@group_required(['teacher', 'manager'], login_url='login')
def courses_add_supports(request):
    errors = []
    if request.method == 'POST':
        form = ImportCourseSupports(request.POST, request.FILES, user=request.user)
        file_field = request.FILES["file_field"]
        if not file_field.name.endswith('.pdf'):
            errors.append("Cette extension de fichier n'est pas accepté")
        course = get_object_or_404(Course, pk=request.POST['course'])
        instance = Document(
            type='C',
            name=request.POST['filename'],
            file=request.FILES["file_field"],
            course=course
        )
        try:
            instance.save()
        except IntegrityError as e:
            errors.append("Une erreur est survenue")
        if len(errors) == 0:
            return redirect('courses_supports')
    else:
        form = ImportCourseSupports(user=request.user)
    return render(request, 'web/courses/add-support.html', {
        'form': form
    })
