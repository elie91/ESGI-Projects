from django import forms


class ProfileForm(forms.Form):

    def __init__(self, *args, **kwargs):
        super(ProfileForm, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = 'form-control'

    email = forms.EmailField()
    username = forms.CharField(max_length=150)
    last_name = forms.CharField(max_length=150)
    first_name = forms.CharField(max_length=150)


class ProfilePasswordUpdateForm(forms.Form):

    def __init__(self, *args, **kwargs):
        super(ProfilePasswordUpdateForm, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = 'form-control'

    old_password = forms.CharField(max_length=32, widget=forms.PasswordInput)
    new_password = forms.CharField(max_length=32, widget=forms.PasswordInput)
    confirm_password = forms.CharField(max_length=32, widget=forms.PasswordInput)
