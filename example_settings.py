import os

from settings import INSTALLED_APPS
INSTALLED_APPS += ("djangoprofile",)

PROJECT_DIR = os.path.dirname(__file__)
PROFILE_DIR = os.path.normpath(os.path.join(PROJECT_DIR, 'profiles'))


# If you don't want to use Django Debug Toolbar
# then install this middleware.
from settings import MIDDLEWARE_CLASSES
MIDDLEWARE_CLASSES += (
    'djangoprofile.middleware.profile.ProfileMiddleware',
)


# If you do want to use Django Debug Toolbar
# then install the panel instead.
#
# from settings import DEBUG_TOOLBAR_PANELS
# DEBUG_TOOLBAR_PANELS += (
#     'djangoprofile.panels.ProfileDebugPanel',
# )


# The Django Debug Toolbar will load on the profile
# page as well (it is an iframe) unless you disable it:
# 
# def show_toolbar(request):
#     uri = request.get_full_path()
#     return not '/admin/profile/' in uri
# 
# DEBUG_TOOLBAR_CONFIG = {
#     'SHOW_TOOLBAR_CALLBACK': show_toolbar
# }
