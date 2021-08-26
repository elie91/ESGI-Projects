from django.forms import ModelChoiceField


class SelectUnique(ModelChoiceField):
    def label_from_instance(self, obj):
        return obj.name
