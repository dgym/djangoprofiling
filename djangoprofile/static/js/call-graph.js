define(['inherit', 'graph'], 
function(inherit, graph) {

    //
    // Called function - represented by node
    //
    var CalledFunction = function($el) {
        graph.Node.apply(this, arguments);

        this.name = this.getTextFragment(0);
    };

    inherit(CalledFunction, graph.Node);

    CalledFunction.prototype.getCalls = function() {
        return $.map(this.outlets, function(call) {
            return {
                name:       call.to.name,
                id:         call.to.id,
                fill:       call.to.fillColour,
                percentage: call.percentageOfTime,
                time:       call.timesCalled
            };
        }).sort(function(call1, call2) {
            return call2.percentage - call1.percentage;
        });
    };

    CalledFunction.prototype.getCallers = function() {
        return $.map(this.inlets, function(call) {
            return {
                name:       call.from.name,
                id:         call.from.id,
                fill:       call.from.fillColour,
                percentage: call.percentageOfTime,
                time:       call.timesCalled
            };
        });
    };

    //
    // Function call - represented by edge
    //

    var FunctionCall = function($el ) {
        graph.Edge.apply(this, arguments);
        this.percentageOfTime = parseFloat(this.getTextFragment(0));
        this.timescalled = this.getTextFragment(this.getTextFragment(1));
    };

    inherit(FunctionCall, graph.Edge);

    //
    // Call graph
    //

    var CallGraph = function(svgdoc) {
        graph.Graph.apply(this, arguments);
        this.nodeType = CalledFunction;
        this.edgeType = FunctionCall;
    };

    inherit(CallGraph, graph.Graph);

    return CallGraph;
});
