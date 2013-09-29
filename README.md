djangoprofiling consists of two parts:

1. a middleware component to profile django requests and store the results
2. a browser-based display layer allowing you to browse and search the call tree


Install Requirements
--------------------

* python >= 2.6
* django >= 1.3
* pydot >= 1.0.28
* pyparsing == 1.5.7
* httplib2 >= 0.8 (only if using the profile server)

Browser requirements
--------------------

Works nicely in Chrome. Really slow in Firefox unfortunately.
Theoretically it works in anything that's SVG capable, which is pretty much everything these days.


Usage
----

To create a profile for a page add prof to the query parameters, e.g.
http://localhost:8000/somepage?prof

To see the profiles is it necessary to include the urls in your master urls.py file, e.g.

    if 'djangoprofile' in settings.INSTALLED_APPS:
        urlpatterns += patterns('', url('^admin/profile/', include('djangoprofile.urls')))
        
Then visit http://localhost:8000/admin/profile/

TODO
----
* confirm requirements
* think of a better name
* make it a proper admin page
* Allow deletion / management of profiles
