from django import forms
from ..models import User, Promotion
from ..widgets.preview_file import PreviewFile
from ..widgets.multiple_select import MultipleSelect
from ..widgets.multiple_select_input import MultipleSelectInput


class UserForm(forms.Form):
    picture = forms.FileField(label=False, required=False,
                              widget=PreviewFile(attrs={'container': 'col-md-5 offset-md-3'}))
    email = forms.CharField(label='Email', max_length=200, widget=forms.TextInput(attrs={
        'class': "form-control", 'placeholder': 'Email'}))
    last_name = forms.CharField(label='Nom', max_length=100, widget=forms.TextInput(attrs={
        'class': "form-control", 'container': 'col-md-4', 'placeholder': 'Nom'}))
    first_name = forms.CharField(label='Prénom', max_length=100, widget=forms.TextInput(attrs={
        'class': "form-control", 'container': 'col-md-4', 'placeholder': 'Prénom'}))
    gender = forms.ChoiceField(label='Selectionner un genre', choices=User.GENDERS, widget=forms.Select(attrs={
        'class': "form-control", 'container': 'col-md-4', 'placeholder': 'Selectionner un genre'}))
    groups = forms.ChoiceField(
        label="Type d'utilisateur",
        required=True,
        choices=(
            ('teacher', 'professeur'),
            ('student', 'etudiant'),
        ),
        widget=forms.Select(attrs={
            'class': "form-control",
            'container': 'col-md-6',
            'placeholder': 'Selectionner un rôle'
        })
    )
    promotions = MultipleSelect(
        label="Promotions",
        required=False,
        queryset=Promotion.objects.all(),
        to_field_name="id",
        widget=MultipleSelectInput(attrs={
            'class': "form-control", 'container': 'col-md-6'})
    )


