from django.contrib.auth import REDIRECT_FIELD_NAME
from django.conf import settings
from django.shortcuts import resolve_url
from urllib.parse import urlparse
from functools import wraps
from django.core.exceptions import PermissionDenied


def user_passes(test_func, login_url=None, redirect_field_name=REDIRECT_FIELD_NAME):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if test_func(request.user):
                return view_func(request, *args, **kwargs)
            path = request.build_absolute_uri()
            resolved_login_url = resolve_url(login_url or settings.LOGIN_URL)
            # If the login url is the same scheme and net location then just
            # use the path as the "next" url.
            login_scheme, login_netloc = urlparse(resolved_login_url)[:2]
            current_scheme, current_netloc = urlparse(path)[:2]
            if ((not login_scheme or login_scheme == current_scheme) and
                    (not login_netloc or login_netloc == current_netloc)):
                path = request.get_full_path()
            from django.contrib.auth.views import redirect_to_login
            return redirect_to_login(
                path, resolved_login_url, redirect_field_name)

        return _wrapped_view

    return decorator


def group_required(groups=None, login_url=None, raise_exception=False):
    if groups is None:
        groups = ['manager']

    def check_perms(user):
        for g in groups:
            if user.role == g:
                return True
        if raise_exception:
            raise PermissionDenied
        return False
    return user_passes(check_perms, login_url=login_url)
