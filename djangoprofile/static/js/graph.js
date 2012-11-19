define([], function() {

    var Node = function($el) {
        this.outlets = [];
        this.inlets = [];
        this.$el = $el;
        this.id = $el.attr('id');
        this.parse();
    };

    Node.prototype = {
        parse: function() {
            this.fullText = this.$el.text();
        },

        getFullText: function() {
            return this.fullText;
        }
    };

    var Edge = function($el) {
        this.from = null;
        this.to = null;
        this.$el = $el;
    };

    var Graph = function(svgdoc) {
        this.edges = [];
        this.nodes = [];
        this.svgdoc = svgdoc;
    };

    Graph.prototype = {

        newNode: function($el) {
            return new Node($el);
        },

        newEdge: function($el) {
            return new Edge($el);
        },

        index: function() {
            var graph = this;

            // Iterate over each edge
            $('.edge', this.svgdoc).each(function() {

                var edge = this;
                var edge_id = edge.id.substr(4);

                // Edge's title attribute contains ids of from and to nodes
                var ends = $('title', edge).text().split('->');
                var from_id = parseInt(ends[0],10);
                var to_id = parseInt(ends[1],10);

                // Create the node objects if necessary
                if ( typeof graph.nodes[from_id] === 'undefined' ) {
                    graph.nodes[from_id] = graph.newNode($('#node'+from_id, graph.svgdoc));
                }

                if ( typeof graph.nodes[to_id] === 'undefined' ) {
                    graph.nodes[to_id] = graph.newNode($('#node'+to_id, graph.svgdoc));
                }

                edge = graph.newEdge(edge);

                // Connect everything up
                edge.from = graph.nodes[from_id];
                edge.to = graph.nodes[to_id];

                graph.nodes[from_id].outlets.push(edge);
                graph.nodes[to_id].inlets.push(edge);
            });
        },

        search: function(query) {
            return this.nodes.filter(function(obj) {
                return obj.getFullText().match(query);
            });
        }
    };

    return {
        Graph: Graph,
        Node: Node,
        Edge: Edge
    };
});
