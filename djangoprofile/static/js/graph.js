define(['inherit'], function(inherit) {

    var SvgGraphElement = function($el) {
        this.$el = $el;
        this.id = $el.attr('id');
        this.fullText = this.$el.text();
        this.textFragments = $('text', this.$el).map(function(){
            return $(this).text();
        });
    };

    SvgGraphElement.prototype = {
        getTextFragment: function(index) {
            if (typeof this.textFragments[index] !== 'undefined') {
                return this.textFragments[index];
            }
            return '';
        }
    };

    var Node = function($el) {
        SvgGraphElement.apply(this, arguments);
        this.outlets = [];
        this.inlets = [];
        this.fillColour = $('polygon', $el).attr('fill');
    };

    var Edge = function($el) {
        SvgGraphElement.apply(this, arguments);
        this.from = null;
        this.to = null;
    };

    inherit(Node, SvgGraphElement);
    inherit(Edge, SvgGraphElement);


    var Graph = function(svgdoc) {
        this.edges = [];
        this.nodes = [];
        this.svgdoc = svgdoc;
        this.nodeType = Node;
        this.edgeType = Edge;
    };

    Graph.prototype = {

        index: function() {
            var graph = this;

            // Iterate over each edge
            $('.edge', this.svgdoc).each(function() {

                var edge = new graph.edgeType($(this));

                var edge_id = edge.id;

                // Edge's title attribute contains ids of from and to nodes
                var ends = $('title', this).text().split('->');
                var from_id = parseInt(ends[0],10);
                var to_id = parseInt(ends[1],10);

                // Create the node objects if necessary
                if ( typeof graph.nodes[from_id] === 'undefined' ) {
                    graph.nodes[from_id] = new graph.nodeType($('#node'+from_id, graph.svgdoc));
                }

                if ( typeof graph.nodes[to_id] === 'undefined' ) {
                    graph.nodes[to_id] = new graph.nodeType($('#node'+to_id, graph.svgdoc));
                }

                // Connect everything up
                edge.from = graph.nodes[from_id];
                edge.to = graph.nodes[to_id];

                graph.nodes[from_id].outlets.push(edge);
                graph.nodes[to_id].inlets.push(edge);
            });
        },

        search: function(query) {
            return this.nodes.filter(function(obj) {
                return obj.fullText.match(query);
            });
        }
    };

    return {
        Graph: Graph,
        Node: Node,
        Edge: Edge
    };
});
