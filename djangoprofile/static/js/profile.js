require(["jquery", 
         "graph", 
         "vendor/jquery.svg",
         "vendor/jquery.tmpl"],

function($, graph) {

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

                var callgraph = new graph.Graph(root);
                callgraph.index();

                $('.edge').click(function() {
                    var edge_id = this.id.substr(4);
                    var edge = callgraph.edges[edge_id];
                    console.log(edge.from.obj);
                    console.log(edge.to.obj);
                });

                $('.node').click(function() {
                    var node_id = this.id.substr(4);
                    var node = callgraph.nodes[node_id];

                    $('.info .current-node').text(node.name);
                });

                $('button.search').click(function() {
                    var query = $('input[name=query]').val();
                    var results = callgraph.search(query);
                    $(".info .search-results").remove();
                    $tmpl = $("#searchResultsTmpl");
                    $tmpl.tmpl({
                        results: 
                            $(results).map(function() {
                                return { 
                                    name: this.name,
                                    id: this.$el.attr('id')
                                };
                            })
                    }).appendTo(".info");

                    return false;
                });

                function centreInView($el, $graph) {
                    // Centre horizontally
                    var centreLeft = $graph.width()/2 - $el.width()/2;
                    var actualLeft = $el.position().left;
                    var moveLeft = actualLeft - centreLeft;

                    var viewLeft = $viewport.scrollLeft();
                    $viewport.scrollLeft(viewLeft + moveLeft);

                    // Centre vertically
                    var centreTop = $graph.height()/2 - $el.width()/2;
                    var actualTop = $el.position().top;
                    var moveTop = actualTop - centreTop;

                    var viewTop = $viewport.scrollTop();
                    $viewport.scrollTop(viewTop + moveTop);
                }

                $('.info').on('click', '.search-results li', function() {
                    var node_id = $(this).data('node-id');
                    var $node = $('#' + node_id);

                    centreInView($node, $('.graph'));
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

});
