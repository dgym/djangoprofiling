import os.path
import time
import cProfile
from django.conf import settings

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
            filename = 'profile-{}.prof'.format(
                time.strftime("%Y%m%dT%H%M%S", time.gmtime()))
            self.filename = os.path.join(settings.PROFILE_DIR, filename)
            self.prof = cProfile.Profile()

    def process_view(self, request, callback, callback_args, callback_kwargs):
        if settings.DEBUG and 'prof' in request.GET:
            return self.prof.runcall(callback, request, *callback_args, **callback_kwargs)

    def process_response(self, request, response):
        if settings.DEBUG and 'prof' in request.GET:
            self.prof.dump_stats(self.filename)
        return response
