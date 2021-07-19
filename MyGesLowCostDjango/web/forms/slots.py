from django import forms
from ..models import Course, Promotion
from ..widgets.select_unique import SelectUnique


class SlotForm(forms.Form):
    date = forms.DateField(label='Date', widget=forms.DateInput(attrs={
        'class': "form-control",
        'container': 'col-md-12',
        'placeholder': 'Debut',
        'id': "date",
        'type': "date"
    }))
    start = forms.TimeField(label='Debut', widget=forms.TimeInput(attrs={
        'class': "form-control",
        'container': 'col-md-6',
        'placeholder': 'Debut',
        'id': "start",
        'type': "time"
    }))
    end = forms.TimeField(label='Fin', widget=forms.TimeInput(attrs={
        'class': "form-control",
        'container': 'col-md-6',
        'placeholder': 'Fin',
        'id': "end",
        'type': "time"
    }))
    promotion = SelectUnique(
        empty_label="Choisir la promotion",
        label="Choisir la promotion",
        queryset=Promotion.objects.all(),
        widget=forms.Select(attrs={
            'class': "form-control",
            'container': 'col-md-12',
            'id': "select-promotion"
        })
    )
    course = SelectUnique(
        empty_label="Choisir le cours",
        label="Choisir le cours",
        queryset=Course.objects.all(),
        widget=forms.Select(attrs={
            'class': "form-control",
            'container': 'col-md-12 container-none',
            'id': "select-course"
        })
    )
