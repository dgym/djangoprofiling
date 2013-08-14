import cProfile
import marshal
import os.path
import time
import urllib2

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
            self.filename = 'profile-{0}.prof'.format(
                time.strftime("%Y%m%dT%H%M%S", time.gmtime()))
            self.prof = cProfile.Profile()

    def process_view(self, request, callback, callback_args, callback_kwargs):
        if settings.DEBUG and 'prof' in request.GET:
            return self.prof.runcall(callback, request, *callback_args, **callback_kwargs)

    def process_response(self, request, response):
        if settings.DEBUG and 'prof' in request.GET:
            if getattr(settings, 'PROFILE_SERVER_URL', None):
                self.prof.create_stats()
                body = marshal.dumps(self.prof.stats)

                urllib2.urlopen(
                    '{0}saveprofile/{1}'.format(
                        settings.PROFILE_SERVER_URL,
                        self.filename[:-5],
                    ),
                    body,
                ).close()
            else:
                self.prof.dump_stats(os.path.join(settings.PROFILE_DIR, self.filename))
            del self.prof
        return response
