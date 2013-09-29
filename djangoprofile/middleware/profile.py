import cProfile
import marshal
import os.path
import socket
import time

from django.conf import settings
from django.core.urlresolvers import reverse

# Derived from http://djangosnippets.org/snippets/186/


class ProfileMiddleware(object):
    """
    Displays hotshot profiling for any view.
    http://yoursite.com/yourview/?prof

    Add the "prof" key to query string by appending ?prof (or &prof=)
    and you'll see the profiling results in your browser.
    It's set up to only be available in django's debug mode,
    but you really shouldn't add this middleware to any production configuration.
    * Only tested on Linux
    """
    def process_request(self, request):
        if settings.DEBUG and 'prof' in request.GET:
            self.filename = 'profile-{0}.prof'.format(
                time.strftime("%Y%m%dT%H%M%S", time.gmtime()))
            self.prof = cProfile.Profile()

    def process_view(self, request, callback, callback_args, callback_kwargs):
        if hasattr(self, 'prof'):
            return self.prof.runcall(callback, request, *callback_args, **callback_kwargs)

    def process_response(self, request, response):
        if hasattr(self, 'prof'):
            if getattr(settings, 'PROFILE_SERVER_URL', None):
                url = '{0}saveprofile/{1}'.format(
                    settings.PROFILE_SERVER_URL,
                    self.filename[:-5],
                )

                self.prof.create_stats()
                body = marshal.dumps(self.prof.stats)

                import httplib2
                http = httplib2.Http()
                http.follow_redirects = False
                try:
                    (response, body) = http.request(url, 'POST', body)
                except socket.error:
                    pass
                else:
                    if response['status'] in ('200', '303'):
                        self.profile_url = '{0}profile/{1}'.format(
                            settings.PROFILE_SERVER_URL,
                            self.filename[:-5],
                        )
            else:
                self.prof.dump_stats(os.path.join(settings.PROFILE_DIR, self.filename))
                self.profile_url = reverse(
                    'profile', 
                    kwargs=dict(filename=self.filename[:-5]),
                )
            del self.prof
        return response
