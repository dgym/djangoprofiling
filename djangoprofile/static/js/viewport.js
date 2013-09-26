define(["vendor/jquery-ui"],
function() {
    var Viewport = function($viewport, $graph, svg) {
        this.svg = svg;
        this.$graph = $graph;
        this.$viewport = $viewport;
        this.scale = 1.0;

        // Enable drag-to-pan on graph.
        this.$graph.draggable();
    };

    Viewport.prototype = {

        init: function() {
            this.initScale();
            this.initEventHandlers();
        },

        initEventHandlers: function() {

            var self = this;
            this.$viewport.bind('mousewheel DOMMouseScroll', function(e) {
                var val = e.originalEvent.wheelDelta ||
                         -e.originalEvent.detail;
                if (val < 0){
                    self.zoomOut();
                } else {
                    self.zoomIn();
                }
            });
        },

        initScale: function() {
            var box = this.getViewBox();
            if (box) {
                // Read in and split the viewBoxAttr
                this.setSize(box.w, box.h);
                this.defaultSize = {
                    width:  box.w,
                    height: box.h
                };
            }
        },

        getViewBox: function() {
            var viewBoxAttr = this.svg.root().attributes.viewBox;
            if (viewBoxAttr) {
                var box = viewBoxAttr.value.split(' ');
                return {
                    x: parseInt(box[0], 10),
                    y: parseInt(box[1], 10),
                    w: parseInt(box[2], 10),
                    h: parseInt(box[3], 10)
                };
            }
        },

        setViewBox: function(box) {
            this.svg.configure({
                viewBox: box.x + " " +
                         box.y + " " +
                         box.w + " " +
                         box.h
            });
        },

        scaleGraph: function(factor) {
            var graph = $("g.graph")[0],
                transforms = graph.transform.baseVal,
                i, item;

            for (i=0; i < transforms.numberOfItems; i++) {
                item = transforms.getItem(i);
                if (item.type == SVGTransform.SVG_TRANSFORM_SCALE) {
                    item.setScale(this.scale, this.scale);
                }
            }
        },

        setSize: function(width, height) {

            var attrs = { width: width, height: height };

            // Apply these values to the svg doc
            this.svg.configure(attrs);

            // Graph container should have the same as its CSS attributes.
            this.$graph.css(attrs);

            var vw = this.$viewport.width(),
                vh = this.$viewport.height(),
                gw = width,
                gh = height;

            // Enable drag-to-pan on graph.
            this.$graph.draggable({
                containment: [vw/2 - gw, vh/2 - gh, vw/2, vh/2]
            });
        },

        zoom: function(factor) {
            this.scale *= factor;
            this.scaleGraph();

            var width = this.defaultSize.width * this.scale,
                height = this.defaultSize.height * this.scale;

            // Set the size
            this.setSize(width, height);

            // Adjust the viewbox
            this.setViewBox({
                x: 0,
                y: 0,
                w: width,
                h: height
            });

            // Keep the same point in the centre when we zoom.
            var gx = this.$graph.position().left,
                gy = this.$graph.position().top,
                vw = this.$viewport.width(),
                vh = this.$viewport.height();

            this.scrollTo(
                (-gx * factor) + ((factor-1) * vw/2),
                (-gy * factor) + ((factor-1) * vh/2)
            );
        },

        zoomIn: function() {
            this.zoom(1.2);
        },

        zoomOut: function() {
            this.zoom(1/1.2);
        },

        scrollTo: function(left, top) {
            this.$graph.css({
                left: -left,
                top:  -top
            });
        },

        centreOn: function($el) {
            // centre of the element
            var cx = $el.position().left + $el.width() /2,
                cy = $el.position().top  + $el.height()/2;

            // viewport dimensions
            var vw = this.$viewport.width(),
                vh = this.$viewport.height();

            this.scrollTo(cx - (vw / 2),
                          cy - (vh / 2));
        }
    };

    return Viewport;
});
