import os

from gprof2dot import PstatsParser, DotWriter, TEMPERATURE_COLORMAP
from pydot import graph_from_dot_file


class Profile(object):

    def __init__(self, base_dir):
        self.base_dir = base_dir
        self.dot_dir = os.path.join(base_dir, "dot")
        self.svg_dir = os.path.join(base_dir, "svg")

        # Make sure the correct directories exist
        self.ensure_directory(self.dot_dir)
        self.ensure_directory(self.svg_dir)

    def process(self, filename):
        prof_path = os.path.join(self.base_dir, "{0}.prof".format(filename))
        dot_path = os.path.join(self.dot_dir, "{0}.dot".format(filename))

        self.svg_path = os.path.join(self.svg_dir, "{0}.svg".format(filename))

        # Process the profile into dot format
        self.__prof2dot(prof_path, dot_path)

        # Process dot file into svg
        self.__dot2svg(dot_path, self.svg_path)

    def __prof2dot(self, prof_path, dot_path):
        """Generate dot file from pstat profile
        if it does not already exist"""

        if not os.path.isfile(dot_path):
            parser = PstatsParser(prof_path)
            profile = parser.parse()

            with open(dot_path, 'wt') as dotfile:
                dotwriter = DotWriter(dotfile)
                profile.prune(0.005, 0.001)
                dotwriter.graph(profile, TEMPERATURE_COLORMAP)

    def __dot2svg(self, dot_path, svg_path):
        """Generate svg file from dot file if it does not already exist"""
        if not os.path.isfile(svg_path):
            graph = graph_from_dot_file(dot_path)
            graph.write_svg(svg_path)

    @property
    def svg_data(self):
        return open(self.svg_path).read()

    def ensure_directory(self, dirname):
        if not os.path.isdir(dirname):
            os.mkdir(dirname)
