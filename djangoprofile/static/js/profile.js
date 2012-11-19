require(["jquery", 
         "call-graph", 
         "vendor/jquery.svg",
         "vendor/jquery.tmpl"],

function($, CallGraph) {

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

    $(document).ready(function(){

        // Keep the graph at 95% of viewport height
        $(window).resize(function(){
            $(".viewport").height($(window).height()*0.95); 
        });
        $(window).resize();

        var $viewport = $('.viewport');
        var $graph = $('.graph');
        $graph.svg({
            loadURL: $graph.data('href-svg'),
            onLoad: function(svg) {
                var root = svg.root();
                var $graph = $('.graph', root);

                restoreIntendedScale(svg);

                var callgraph = new CallGraph(root);
                callgraph.index();

                $('.edge').click(function() {
                    var edge_id = this.id.substr(4);
                    var edge = callgraph.edges[edge_id];
                    console.log(edge_id);
                    console.log(edge.from.obj);
                    console.log(edge.to.obj);
                });

                $('.node').click(function() {
                    var node_id = this.id.substr(4);
                    var node = callgraph.nodes[node_id];

                    $('.info .current-node').text(node.name);
                    $(".info .node-info").remove();
                    var calls = $.map(node.outlets, function(out,i) {
                        return out.to;
                    });

                    var callers = $.map(node.inlets, function(inn,i) {
                        return inn.from;
                    });

                    var params ={
                        name: node.name,
                        callers: callers,
                        calls: calls
                    };

                    var $tmpl = $("#nodeInfoTmpl");
                    $tmpl.tmpl(params).appendTo('.info');
                });

                $('.search button').click(function() {
                    var query = $('input[name=query]').val();
                    var results = callgraph.search(query);
                    $(".info .search-results").remove();
                    $tmpl = $("#searchResultsTmpl");
                    $tmpl.tmpl({
                        results: results
                    }).appendTo(".search");

                    return false;
                });

                function scrollTo(left, top) {
                    $viewport.scrollLeft(left);
                    $viewport.scrollTop(top);
                }

                function centreInView($el, $graph) {
                    // Centre horizontally
                    var centreLeft = $graph.width()/2 - $el.width()/2;
                    var actualLeft = $el.position().left;
                    var moveLeft = actualLeft - centreLeft;

                    var viewLeft = $viewport.scrollLeft();

                    // Centre vertically
                    var centreTop = $graph.height()/2 - $el.width()/2;
                    var actualTop = $el.position().top;
                    var moveTop = actualTop - centreTop;

                    var viewTop = $viewport.scrollTop();

                    scrollTo(viewLeft + moveLeft, viewTop + moveTop);
                }

                $('.info').on('click', '.node-list li', function() {
                    var node_id = $(this).data('node-id');
                    var $node = $('#' + node_id);

                    centreInView($node, $('.graph'));
                });
            }
        });
    });
});
