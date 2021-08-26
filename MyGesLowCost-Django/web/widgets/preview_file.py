from django.forms import ClearableFileInput


class PreviewFile(ClearableFileInput):
    template_name = 'web/widgets/preview_file.html'

