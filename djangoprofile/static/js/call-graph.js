define(['inherit', 'graph'], 
function(inherit, graph) {

    //
    // Called function - represented by node
    //
    var CalledFunction = function($el) {
        graph.Node.apply(this, arguments);
    };

    inherit(CalledFunction, graph.Node);

    CalledFunction.prototype.parse = function() {
        graph.Node.prototype.parse.apply(this, arguments);

        var parts = $('text', this.$el).map(function(){
            return $(this).text();
        });
        this.parts = parts;
        this.name = parts[0];
    };

    //
    // Function call - represented by edge
    //

    var FunctionCall = function($el ) {
        graph.Edge.apply(this, arguments);
    };

    inherit(FunctionCall, graph.Edge);


    //
    // Call graph
    //

    var CallGraph = function(svgdoc) {
        graph.Graph.apply(this, arguments);
    };

    inherit(CallGraph, graph.Graph);

    CallGraph.prototype.newNode = function($el) {
        return new CalledFunction($el);
    };

    CallGraph.prototype.newEdge = function($el) {
        return new FunctionCall($el);
    };

    return CallGraph;

});
