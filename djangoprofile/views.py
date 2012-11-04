import os
import re
from profile import Profile

from django.http import HttpResponse
from django.conf import settings
from django.shortcuts import render_to_response
from django.template import RequestContext


def list(request):
    files = [os.path.splitext(f)[0] for f in os.listdir(settings.PROFILE_DIR) if re.match('.*\.prof', f)]
    return render_to_response(
        'profiling/list.html',
        {'files': files},
        RequestContext(request))


def profile(request, filename):
    return render_to_response(
        'profiling/profile.html',
        {'filename': filename},
        RequestContext(request))


def svg(request, filename):

    prof = Profile(settings.PROFILE_DIR)
    prof.process(filename)

    return HttpResponse(prof.svg_data, content_type="image/svg+xml")


def raw(request, filename):
    pass
