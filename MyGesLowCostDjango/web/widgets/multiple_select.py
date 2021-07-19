from django.forms import ModelMultipleChoiceField


class MultipleSelect(ModelMultipleChoiceField):
    def label_from_instance(self, obj):
        return obj.name
