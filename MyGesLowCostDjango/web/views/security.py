from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required
from ..forms.profil import ProfileForm, ProfilePasswordUpdateForm
from django.contrib.auth.hashers import check_password
from ..models import User


def login(request):
    if request.user.is_authenticated:
        return redirect('index')
    error = False
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        user = authenticate(request, email=email, password=password)
        if user is not None:
            auth_login(request, user)
            return redirect('index')
        else:
            error = True

    return render(request, 'web/security/login.html', {'hasError': error})


@login_required(login_url='login')
def logout(request):
    auth_logout(request)
    return redirect('login')


@login_required(login_url='login')
def profile(request):
    errors = []
    if request.method == 'POST':
        profile_form = ProfileForm(request.POST)
        password_profile_form = ProfilePasswordUpdateForm(request.POST)
        if profile_form.is_valid():
            user = User.objects.get(id=request.user.id)
            user.email = request.POST['email']
            user.username = request.POST['username']
            user.last_name = request.POST['last_name']
            user.first_name = request.POST['first_name']
            user.save()
            return redirect('profile')

        if password_profile_form.is_valid():
            old_password = request.POST['old_password']
            new_password = request.POST['new_password']
            confirm_password = request.POST['confirm_password']
            if not check_password(old_password, request.user.password):
                errors.append('Le mot de passe actuel est invalide')
            if new_password != confirm_password:
                errors.append('Les mots de passes ne correspondent pas')
            user = User.objects.get(id=request.user.id)
            user.set_password(new_password)
            user.save()
            return redirect('profile')

    profile_form = ProfileForm(initial={
        'email': request.user.email,
        'username': request.user.username,
        'last_name': request.user.last_name,
        'first_name': request.user.first_name,
    })
    password_profile_form = ProfilePasswordUpdateForm()

    return render(request, 'web/security/profile.html', {
        'profile_form': profile_form,
        'password_profile_form': password_profile_form,
        'errors': errors
    })
