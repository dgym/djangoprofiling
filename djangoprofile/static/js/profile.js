var Node = function(obj) {
    this.outlets = [];
    this.inlets = [];
    this.obj = obj;
};

var Edge = function(obj) {
    this.from = null;
    this.to = null;
    this.obj = obj;
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

            // Connect everything up
            edge.from = graph.nodes[from_id];
            edge.to = graph.nodes[to_id];

            graph.nodes[from_id].outlets.push(edge);
            graph.nodes[to_id].inlets.push(edge);
        });
    }
};

function restoreIntendedScale(svg) {
    // Read in and split the viewBoxAttr
    var viewBoxAttr = svg.root().attributes.viewBox;
    if ( typeof viewBoxAttr !== 'undefined' ) {
        var box = viewBoxAttr.value.split(' '),
            x = box[0],
            y = box[1];
            w = box[2];
            h = box[3];

        // Apply these values to the 
        svg.configure({"height": h, "width": w});
    }
}

function indexGraph(svgdoc) {
    var edges = [];
    var nodes = [];

    return {
        edges: edges,
        nodes: nodes
    };
}

$(document).ready(function(){

    // Keep the graph at 95% of viewport height
    $(window).resize(function(){
        $(".viewport").height($(window).height()*0.95); 
    });
    $(window).resize();

    var $graph = $('.graph');
    $graph.svg({
        loadURL: $graph.data('href-svg'),
        onLoad: function(svg) {
            var root = svg.root();
            var $graph = $('.graph', root);

            restoreIntendedScale(svg);

            var graph = new Graph(root);
            graph.index();

            $('.edge').click(function() {
                var edge_id = this.id.substr(4);
                var edge = graph.edges[edge_id];
                console.log(edge.from.obj);
                console.log(edge.to.obj);
            });

            $('.node').click(function() {
                var node_id = this.id.substr(4);
                var node = graph.nodes[node_id];
                console.log('calls', node.outlets.length, 'things');
                console.log('called by', node.inlets.length, 'things');
            });
        }
    });

    
    /*
    var scale = 1;
    $(".zoomin").click(function() {
        scale *= 2;
        $graph.attr({ transform: "scale(" + scale + "," + scale + "); translate(0,0)"});
    });

    $(".zoomout").click(function() {
        scale /= 2;
        $graph.attr({ transform: "scale(" + scale + "," + scale + "); translate(0,0)"});
    });
    */

});
