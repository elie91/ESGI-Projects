from django import forms
from ..widgets.preview_file import PreviewFile
from ..models import Course
from ..widgets.select_unique import SelectUnique


class ImportForm(forms.Form):
    csvFile = forms.FileField(
        label=False,
        widget=PreviewFile(attrs={
            'container': 'col-md-12',
            'document': True
        }))


class ImportCourseSupports(forms.Form):

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        super(ImportCourseSupports, self).__init__(*args, **kwargs)
        self.fields['course'].queryset = Course.objects.filter(teacher=user)

    course = SelectUnique(
        empty_label="Choisir le cours",
        label="Choisir le cours",
        queryset=Course.objects.all(),
        widget=forms.Select(attrs={
            'class': "form-control",
            'container': 'col-md-6'
        })
    )
    filename = forms.CharField(
        label='Nom du fichier',
        max_length=200,
        widget=forms.TextInput(attrs={
            'class': "form-control",
            'container': 'col-md-6',
            'placeholder': 'Nom du fichier'}
        ))
    file_field = forms.FileField(
        label=False,
        widget=PreviewFile(attrs={
            'container': 'col-md-12',
            'document': True
        }))
