# taskhive/views.py
from django.views.generic import TemplateView
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET
from django.utils.decorators import method_decorator


class FrontendAppView(TemplateView):
    template_name = 'index.html'

    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

# ✅ CSRF Token View
@require_GET
@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({ "message": "CSRF cookie set successfully" })
