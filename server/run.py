import os
import sys
sys.path.append('site-packages')

import bottle
from cherrypy import wsgiserver


def web_server():
    def app(environ, start_response):
        application = __import__('application')
        if bottle.DEBUG:
            application = reload(application)
            application.init()
        return application.application(environ, start_response)

    server = wsgiserver.CherryPyWSGIServer(('0.0.0.0', 8079), app)
    try:
        server.start()
    except KeyboardInterrupt:
        server.stop()


if __name__ == '__main__':

    if '--daemon' in sys.argv:
        if os.fork():
            sys.exit(0)
        if os.fork():
            sys.exit(0)

    if '--debug' in sys.argv:
        bottle.debug(True)
    else:
        application = __import__('application')
        application.init()

    web_server()
