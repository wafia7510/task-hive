# taskhive/views.py
from django.views.generic import TemplateView

class FrontendAppView(TemplateView):
    template_name = 'index.html'

    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
