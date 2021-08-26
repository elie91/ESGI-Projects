import csv
import io
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.shortcuts import render, get_object_or_404, redirect
from ..models import User
from ..forms.users import UserForm
from ..forms.import_users import ImportForm
from django.contrib.auth.models import Group
from django.contrib.auth.hashers import make_password
from ..decorators import group_required


@group_required(['manager'], login_url='login')
def users_list(request):
    results = User.objects.all()
    return render(request, 'web/users/list.html', {'users': results})


@group_required(['manager'], login_url='login')
def users_add(request):
    errors = []
    if request.method == 'POST':
        form = UserForm(request.POST, request.FILES)
        if form.is_valid():

            instance = User(
                role=request.POST["groups"],
                gender=request.POST['gender'],
                email=request.POST['email'],
                last_name=request.POST['last_name'],
                first_name=request.POST['first_name'],
                username=request.POST['email'],
                password=make_password(request.POST['last_name'] + request.POST['first_name'])
            )

            if len(request.FILES) > 0:
                instance.picture = request.FILES['picture']
            try:
                instance.save()
                instance.promotion_set.clear()
                for promotion in request.POST.getlist('promotions'):
                    instance.promotion_set.add(promotion)

            except IntegrityError as e:
                if 'UNIQUE constraint' in str(e.args):
                    errors.append("L'email doit être unique")
                else:
                    errors.append("Une erreur est survenue")
            if len(errors) == 0:
                return redirect('users')

    else:
        form = UserForm()
    return render(request, 'web/users/add.html', {'form': form, 'errors': errors})


@group_required(['manager'], login_url='login')
def users_edit(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    errors = []
    print(user.role)
    if request.method == 'POST':
        form = UserForm(request.POST, request.FILES)
        if form.is_valid():
            if len(request.FILES) > 0:
                user.picture = request.FILES['picture']
            user.gender = request.POST['gender']
            user.email = request.POST['email']
            user.last_name = request.POST['last_name']
            user.first_name = request.POST['first_name']
            user.role = request.POST["groups"]

            user.promotion_set.clear()
            for promotion in request.POST.getlist('promotions'):
                user.promotion_set.add(promotion)

            try:
                user.save()
            except IntegrityError as e:
                if 'UNIQUE constraint' in str(e.args):
                    errors.append("L'email doit être unique")
                else:
                    errors.append("Une erreur est survenue")
            if len(errors) == 0:
                return redirect('users')
    else:
        form = UserForm(initial={
            'email': user.email,
            'gender': user.gender,
            'last_name': user.last_name,
            'first_name': user.first_name,
            'picture': user.picture,
            'groups': user.role,
            'promotions': user.promotion_set.all()
        })
    return render(request, 'web/users/edit.html', {'user': user, 'form': form, 'edit': True, 'errors': errors})


@group_required(['manager'], login_url='login')
def users_delete(request, user_id):
    User.objects.filter(id=user_id).delete()
    return redirect('users')


@group_required(['manager'], login_url='login')
def users_import(request):
    errors = []
    if request.method == 'POST':
        form = ImportForm(request.POST, request.FILES)
        csv_file = request.FILES["csvFile"]
        if not csv_file.name.endswith('.csv'):
            errors.append("Cette extension de fichier n'est pas accepté")
        else:
            io_string = ""
            try:
                csv_data = csv_file.read().decode('UTF-8')
                io_string = io.StringIO(csv_data)
                next(io_string)
            except IntegrityError:
                errors.append("Erreur lors de la lecture du fichier")
            for column in csv.reader(io_string, delimiter=';', quotechar="\""):
                user = User(
                    password=make_password(column[2] + column[3]),
                    is_superuser=column[0],
                    username=column[1],
                    first_name=column[2],
                    last_name=column[3],
                    email=column[4],
                    is_staff=column[5],
                    is_active=column[6],
                    gender=column[7],
                    role=column[8],
                    picture=None
                )
                try:
                    user.save()

                except IntegrityError as e:
                    if 'UNIQUE constraint' in str(e.args):
                        errors.append("L'email doit être unique")
                    else:
                        errors.append("Une erreur est survenue")
                    break
            return redirect('users')
    else:
        form = ImportForm()
    return render(request, 'web/users/import.html', {'form': form, 'errors': errors})
