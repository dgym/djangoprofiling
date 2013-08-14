import glob
import os

import bottle

from gprof2dot import PstatsParser, DotWriter, TEMPERATURE_COLORMAP
from pydot import graph_from_dot_file


application = bottle.Bottle()


@application.route('/')
def index():
    files = os.listdir('profiles')
    files = [filename[:-5] for filename in files if filename.endswith('.prof')]
    files.sort()

    return bottle.template('templates/index.html', files=files)


@application.route('/saveprofile/:name', method='post')
def save_profile(name):
    with open(os.path.join('profiles', name+'.prof'), 'wb') as stream:
        stream.write(bottle.request.body.read())
    bottle.redirect('/')


@application.route('/profile/:name')
def profile_view(name):
    return bottle.template('templates/profile.html', name=name)


@application.route('/svg/:name')
def svg_view(name):
    make_svg(name)
    return bottle.static_file(name+'.svg', 'profiles/svg/')


@application.route('/static/<name:path>')
def static_view(name):
    return bottle.static_file(name, '../djangoprofile/static/')


def get_prof_name(name):
    return os.path.join('profiles', name+'.prof')


def get_dot_name(name):
    return os.path.join('profiles/dot', name+'.dot')


def get_svg_name(name):
    return os.path.join('profiles/svg', name+'.svg')


def make_dot(name):
    prof_name = get_prof_name(name)
    dot_name = get_dot_name(name)
    if not os.path.exists(prof_name):
        return False
    parser = PstatsParser(prof_name)
    profile = parser.parse()
    with open(dot_name, 'wt') as dotfile:
        dotwriter = DotWriter(dotfile)
        profile.prune(0.005, 0.001)
        dotwriter.graph(profile, TEMPERATURE_COLORMAP)
    return True


def make_svg(name):
    if not make_dot(name):
        return False
    graph = graph_from_dot_file(get_dot_name(name))
    graph.write_svg(get_svg_name(name))
    return True


def init():
    for dirname in 'profiles profiles/dot profiles/svg'.split():
        if not os.path.exists(dirname):
            os.mkdir(dirname)
