from django import forms
from ..models import Course
from ..widgets.multiple_select import MultipleSelect
from ..widgets.multiple_select_input import MultipleSelectInput


class PromotionForm(forms.Form):
    name = forms.CharField(label='Nom', max_length=200, widget=forms.TextInput(attrs={
        'class': "form-control", 'placeholder': 'Nom', 'container': 'col-md-4'}))
    start = forms.DateField(label='Année de début', widget=forms.DateInput(attrs={
        'class': "form-control", 'container': 'col-md-4', 'placeholder': '__/__/____', 'type': 'date'}))
    end = forms.DateField(label='Année de fin', widget=forms.DateInput(attrs={
        'class': "form-control", 'container': 'col-md-4', 'placeholder': '__/__/____', 'type': 'date'}))
    courses = MultipleSelect(
        label="Cours",
        required=True,
        queryset=Course.objects.all(),
        to_field_name="id",
        widget=MultipleSelectInput(attrs={
            'class': "form-control", 'container': 'col-md-6'})
    )
