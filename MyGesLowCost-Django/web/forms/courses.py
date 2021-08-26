from django import forms
from ..models import User


class CourseForm(forms.Form):
    name = forms.CharField(
        label='Nom',
        max_length=200,
        widget=forms.TextInput(attrs={
            'class': "form-control",
            'container': 'col-md-6',
            'placeholder': 'Nom de la matière'
        })
    )
    coefficient = forms.IntegerField(
        label='Coefficient',
        widget=forms.NumberInput(attrs={
            'class': "form-control",
            'min': "0",
            'step': "1",
            'container': 'col-md-6',
            'placeholder': 'Saisir un Coefficient'
        })
    )
    teacher = forms.ModelChoiceField(
        queryset=User.objects.filter(role='teacher'),
        empty_label='Choisir un professeur',
        widget=forms.Select(attrs={
            'class': "form-control",
            'container': 'col-md-6',
            'placeholder': 'Choisir un professeur'
        }),
        required=False
    )
