from django.forms import SelectMultiple


class MultipleSelectInput(SelectMultiple):
    template_name = 'web/widgets/multiple_select.html'
