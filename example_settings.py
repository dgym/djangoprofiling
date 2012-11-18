import os

from settings import INSTALLED_APPS
INSTALLED_APPS += ("djangoprofile",)

from settings import MIDDLEWARE_CLASSES
MIDDLEWARE_CLASSES += (
    'djangoprofile.middleware.profile.ProfileMiddleware',
)

PROJECT_DIR = os.path.dirname(__file__)
PROFILE_DIR = os.path.normpath(os.path.join(PROJECT_DIR, 'profiles'))
