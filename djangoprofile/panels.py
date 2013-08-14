from debug_toolbar.panels import DebugPanel
from django.utils.translation import ugettext_lazy as _

from middleware.profile import ProfileMiddleware


class ProfileDebugPanel(ProfileMiddleware, DebugPanel):
    name = 'Profile'
    has_content = True

    def nav_title(self):
        return _('Profile')

    def title(self):
        return _('Profile')

    def url(self):
        return ''

    def content(self):
        url = getattr(self, 'profile_url', None)
        if url:
            return '<iframe src="{0}" style="width: 100%; height: 100%;"></iframe>'.format(url)
