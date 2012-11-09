define([], function() {

    var Node = function($el) {
        this.outlets = [];
        this.inlets = [];
        this.$el = $el;
        this.text = this.text();
        this.id = $el.attr('id');
        var parts = $('text', $el).map(function(){
            return $(this).text();
        });

        this.name = parts[0];
    };

    Node.prototype = {
        text: function() {
            return this.$el.text();
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
                    graph.nodes[from_id] = new Node($('#node'+from_id, graph.svgdoc));
                }

                if ( typeof graph.nodes[to_id] === 'undefined' ) {
                    graph.nodes[to_id] = new Node($('#node'+to_id, graph.svgdoc));
                }

                edge = new Edge(edge);
                console.log(edge);

                // Connect everything up
                edge.from = graph.nodes[from_id];
                edge.to = graph.nodes[to_id];

                graph.nodes[from_id].outlets.push(edge);
                graph.nodes[to_id].inlets.push(edge);
            });
        },

        search: function(query) {
            return this.nodes.filter(function(obj) {
                return obj.text.match(query);
            });
        }
    };

    return {
        Graph: Graph,
        Node: Node,
        Edge: Edge
    };
});
