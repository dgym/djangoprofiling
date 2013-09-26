require(["call-graph", 
         "viewport",
         "vendor/jquery.svg",
         "vendor/jquery.tmpl"],

function(CallGraph, Viewport) {

    $(document).ready(function(){

        // Keep the graph at 95% of viewport height
        $(window).resize(function(){
            $(".viewport").height($(window).height()*0.95); 
        });
        $(window).resize();

        var $graph = $('div.graph');

        function displayNodeInfo(node) {

            $('.info .current-node').text(node.name);
            $(".info .node-info").remove();

            var params ={
                name: node.name,
                callers: node.getCallers(),
                calls: node.getCalls()
            };

            var $tmpl = $("#nodeInfoTmpl");
            $tmpl.tmpl(params).appendTo('.info');
        }

        $graph.svg({
            loadURL: $graph.data('href-svg'),
            onLoad: function(svg) {
                var root = svg.root();

                var viewport = new Viewport($(".viewport"), $graph, svg);
                viewport.init();

                var callgraph = new CallGraph(root);
                callgraph.index();

                // Centre the initial call in the graph window.
                var initialCall = callgraph.findEntryPoint();
                if ( initialCall ) {
                    viewport.centreOn(initialCall.$el);
                }

                $('.edge').click(function() {
                    var edge_id = this.id.substr(4);
                    var edge = callgraph.edges[edge_id];
                });

                $('.node').click(function() {
                    var node_id = this.id.substr(4);
                    var node = callgraph.nodes[node_id];

                    displayNodeInfo(node);
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

                $(".zoom .in").click(function() {
                    viewport.zoomIn(svg);
                });

                $(".zoom .out").click(function() {
                    viewport.zoomOut(svg);
                });


                $('.info').on('click', '.node-list li', function() {
                    var node_id = $(this).data('node-id');
                    var $node = $('#' + node_id);
                    viewport.centreOn($node);

                    displayNodeInfo(callgraph.nodes[node_id.substr(4)]);
                });
            }
        });
    });
});
