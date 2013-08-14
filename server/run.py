import sys
from wsgiref.simple_server import make_server

import bottle


def web_server():
    def app(environ, start_response):
        application = __import__('application')
        if bottle.DEBUG:
            application = reload(application)
            application.init()
        return application.application(environ, start_response)

    httpd = make_server('0.0.0.0', 8079, app)
    httpd.serve_forever()


if __name__ == '__main__':
    sys.path.append('site-packages')

    if '--debug' in sys.argv:
        bottle.debug(True)
    else:
        application = __import__('application')
        application.init()

    web_server()
