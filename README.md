djangoprofiling consists of two parts:

1. a middleware component to profile django requests and store the results
2. a browser-based display layer allowing you to browse and search the call tree


Install Requirements
--------------------

* python >= 2.6
* django >= 1.3
* pydot >= 1.0.28

Browser requirements
--------------------

Probably IE9+, Chrome, Firefox, Safari, Opera etc (basically anything with SVG capability)

Usage
----

To create a profile for a page add prof to the query parameters, e.g.
http://localhost:8000/somepage?prof

To see the profiles is it necessary to include the urls in your master urls.py file, e.g.
if 'djangoprofile' in settings.INSTALLED_APPS:
    urlpatterns += patterns('', url('^admin/profile/', include('djangoprofile.urls')))
Then visit http://localhost:8000:/admin/profile/

TODO
----
confirm requirements
think of a better name
