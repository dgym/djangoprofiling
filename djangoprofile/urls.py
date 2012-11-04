from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('djangoprofile.views',
                       url(r'^/?$', 'list', name='profile_list'),
                       url(r'^(?P<filename>[\w\d-]+).svg$', 'svg', name='profile_svg'),
                       #url(r'^raw/(?P<filename>.+)?$', 'raw', name='profile_raw'),
                       url(r'^(?P<filename>[\w\d-]+)$', 'profile', name='profile'),
                       )
