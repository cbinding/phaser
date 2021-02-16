<template>	
	<!--cytoscape graph-->
    <div id="holder" class="overflow-auto">        
        <MatrixLegend/>

        <cytoscape id="diagram" 
            ref="cy" 
            :config="config" 
            :preConfig="preConfig" 
            :afterCreated="afterCreated">            
            <!--<cy-element v-for="def in elements.edges.filter(e => e.data.type == 'above')"
                :key="`${def.data.id}`"
                :definition="def"/>-->
            <!--<cy-element v-for="def in elements"
                :key="`${def.data.id}`"
                :definition="def"
                :sync="true"/>-->
            <cy-element v-for="node in nodes"
                :key="`${node.data.id}`"
                :definition="node"
                v-on:click="nodeSelected($event, node)"
                :sync="true"/>

            <cy-element v-for="edge in edges"
                :key="`${edge.data.id}`"
                :definition="edge"/>            
        </cytoscape>
    </div>
	
</template>

<script>
//import MyComponent from '@/components/MyComponent.vue'
import dagre from 'cytoscape-dagre'
import gridGuide from 'cytoscape-grid-guide'
//import Layers from 'cytoscape-layers'
import cyCanvas from 'cytoscape-canvas'

import moment from 'moment'
import PhaserCommon from '@/mixins/PhaserCommon.js'
import MatrixLegend from '@/components/MatrixLegend'

export default {
	name: 'MatrixDiagramCY',
	components: {
		MatrixLegend 
	},
	mixins: [ PhaserCommon ],
	props: { 
        gridSize: {
            type: Number,
            required: false,
            default: 40
        }
    },
	data() {
        return {
            container: "cy",
            config: {
                layout: {
                    name: 'dagre', 
                    // dagre options, uses default value if undefined
                    nodeSep: this.gridSize - 4, // the separation between adjacent nodes in the same rank
                    //edgeSep: 20, // the separation between adjacent edges in the same rank                    
                    rankSep: this.gridSize - 4, // the separation between each rank in the layout
                    marginx: this.gridSize / 2,
                    marginy: this.gridSize / 2,                    
                    rankDir: 'TB', // 'TB' for top to bottom flow, 'LR' for left to right
                    ranker: undefined, // Type of algorithm to assign a rank to each node in the input graph. Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
                    //minLen: function( edge ){ return 1; }, // number of ranks to keep between the source and target of the edge
                    //edgeWeight: function( edge ){ return 1; }, // higher weight edges are generally made shorter and straighter than lower weight edges

                    // general layout options
                    fit: true, // whether to fit to viewport
                    padding: this.gridSize / 2, // fit padding
                    spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
                    nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node
                    animate: false, // whether to transition the node positions
                    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
                    //transform: function( node, pos ){ return pos; }, // a function that applies a transform to the final node position
                    //zoom: function(e){ console.log("zoom"); console.log(e)},
                    //viewport: function(e){ console.log("viewport"); console.log(e)},
                    ready: function(){}, // on layoutready
                    stop: this.layoutStop // on layoutstop              
                },
                minZoom: 0.05,
                maxZoom: 2.0,
                style: [
                    // see https://github.com/cytoscape/cytoscape.js/blob/master/documentation/md/style.md
                    // for style settings. Note can layer and position SVG background images - to maybe use
                    // images for finds and samples indicators  
                    {
                        selector: 'node',
                        style: {
                            'font-family': 'sans-serif',
                            'font-size': '1em',
                            'shape': 'rectangle',
                            'width': this.gridSize * 3,
                            'height': this.gridSize * 1,
                            'padding': 0,
                            'text-opacity': 1.0,
                            'text-valign': 'center',
                            'text-halign': 'center',
                            'color': 'black',
                            'background-color': 'white',
                            'background-opacity': 1.0,
                            'border-color': 'black',
                            'border-width': '4px',
                            'border-style': 'solid',
                            'border-opacity': 1.0,
                            //'background-fill': 'radial-gradient',
                            //'background-gradient-stop-colors': 'aliceblue blue'
                        }
                    },	
                    {                       
                        selector: 'node[class="context"]',
                        style: {
                            'width': this.gridSize * 3,
                            'height': this.gridSize * 1,
                            'label':  el => `${el.data('label') ? el.data('label') : el.data('id')}`,                             
                            //'background-fill': 'radial-gradient',
                            //'background-gradient-stop-colors': 'white gray'  
                        }
                    },
                    {                       
                        selector: 'node[class="context"]:selected',
                        style: {
                            'background-color': 'gold'
                            //'background-fill': 'radial-gradient',
                            //'background-gradient-stop-colors': 'white gray'  
                        }
                    },
                    {
                        selector: 'node[class="phase"]',
                        style: {
                            'label':  el => `${el.data('label') ? el.data('label') : el.data('id')}`,
                            'width': '600px',
                            'text-opacity': 0.75,
                            'padding': this.gridSize / 2,
                            'color': 'gray',                            
                            'background-color': 'ivory',
                            'border-color': 'lightgray'                            
                        }
                    },
                    {
                        selector: 'node[class="group"]',
                        style: {
                            //'padding': 15, 
                            'label':  el => `${el.data('label') ? el.data('label') : el.data('id')}`, 
                            'text-opacity': 0.75,
                            'color': 'green',                            
                            'background-color': 'honeydew',
                            'border-color': 'green'                            
                        }
                    },
                    {
                        selector: 'node[class="subgroup"]',
                        style: {
                            'label':  el => `${el.data('label') ? el.data('label') : el.data('id')}`, 
                            'text-opacity': 0.75,
                            'color': 'blue',                            
                            'background-color': 'aliceblue',
                            'border-color': 'blue',                           
                        }
                    },	
                    {
                        selector: 'node[class="find"]',
                        style: {
                            'label':  el => `${el.data('label') ? el.data('label') : el.data('id')}`,                             
                            'shape': 'ellipse',
                            'text-opacity': 1,
                            'color': 'red',                            
                            'background-color': 'pink',
                            'border-color': 'red', 
                            'border-width': '1px',
                            'font-size': '0.5em',     
                            'width' : 15,
                            'height': 15                    
                        }
                    },	
                    {
                        selector: 'node[class="sample"]',
                        style: {
                            'color': 'purple',
                            'shape': 'triangle',
                            //'padding': 15,
                            'label':  el => `${el.data('label') ? el.data('label') : el.data('id')}`, 
                            'text-opacity': 1,
                            'background-color': 'plum',
                            'border-color': 'purple', 
                            'border-width': '1px',
                            'font-size': '0.5em',     
                            'width' : 15,
                            'height': 15                    
                        }
                    },	
                    {
                        selector: 'edge',
                        style: {
                            'curve-style': 'taxi',
                            'taxi-direction': 'downward',
                            'taxi-turn': 15,
                            'edge-distances': 'intersection',
                            'taxi-turn-min-distance': 15,
                            'source-endpoint': 'outside-to-node',
                            'target-endpoint': 'outside-to-node',
                            'width': 3,
                            'target-arrow-shape': 'none',
                            'line-color': 'gray',
                            'line-style': 'solid',
                            'target-arrow-color': '#9dbaea'
                        }
                    }
                ]                
            }
		}
	},
    watch: {
        // show visual indicator of currently selected node if selected elsewhere
        selectedID(newValue) {            
            const cyi = (this.$refs.cy || {}).instance || null
            if(!cyi) return 
            cyi.elements("node:selected").unselect()           
            cyi.$id(newValue).select()            
        }
    },
	computed: { 
        gridSpacing(){ return this.gridSize }, 
        nodes() {
            return []
                .concat(this.$store.getters.phases)
                .concat(this.$store.getters.groups)
                .concat(this.$store.getters.subgroups)
                .concat(this.$store.getters.contexts)
                //.concat(this.$store.getters.finds)    // don't display on graph
                //.concat(this.$store.getters.samples)  // don't display on graph
        },
        edges() {
            return (this.$store.getters.edges).filter(e => e.data.type == "above")
        }, 
        selectedID() {
            return this.$store.getters.selectedID            
        },             
        /*elements() {
            return []
            .concat(this.$store.getters.edges).filter(e => e.data.type == "above")
                .concat(this.$store.getters.phases)
                .concat(this.$store.getters.groups)
                .concat(this.$store.getters.subgroups)
                .concat(this.$store.getters.contexts)
                //.concat(this.$store.getters.finds)    // don't display on graph
                //.concat(this.$store.getters.samples)  // don't display on graph
                
        }*/                   
    },
    /*watch: {
        elements: async function () {
            const cyi = (this.$refs.cy || {}).instance
            this.redoLayout(cyi)            
        }
    },*/
	methods: {
        preConfig(cytoscape) {
            cytoscape.use(dagre) 
            cytoscape.use(gridGuide) // gridGuide(cytoscape)
            cytoscape.use(cyCanvas)
            //cytoscape.use(Layers)

        },

        // notify store that a node has been selected in the diagram
        nodeSelected(event, node){
            this.$store.dispatch('setSelectedID', node.data.id)
        },
         
        afterCreated(cytoscape) {
            
            cytoscape.gridGuide({
                // On/Off Modules
                /* From the following four snap options, at most one should be true at a given time */
                snapToGridOnRelease: false, // Snap to grid on release
                snapToGridDuringDrag: true, // Snap to grid during drag
                snapToAlignmentLocationOnRelease: false, // Snap to alignment location on release
                snapToAlignmentLocationDuringDrag: false, // Snap to alignment location during drag
                distributionGuidelines: true, // Distribution guidelines
                geometricGuideline: true, // Geometric guidelines
                initPosAlignment: false, // Guideline to initial mouse position
                centerToEdgeAlignment: false, // Center to edge alignment
                resize: false, // Adjust node sizes to cell sizes
                parentPadding: false, // Adjust parent sizes to cell sizes by padding
                drawGrid: true, // Draw grid background
            
                // General
                gridSpacing: this.gridSize, // Distance between the lines of the grid.
                snapToGridCenter: true, // Snaps nodes to center of gridlines. When false, snaps to gridlines themselves. Note that either snapToGridOnRelease or snapToGridDuringDrag must be true.
            
                // Draw Grid
                zoomDash: true, // Determines whether the size of the dashes should change when the drawing is zoomed in and out if grid is drawn.
                panGrid: true, // Determines whether the grid should move then the user moves the graph if grid is drawn.
                gridStackOrder: 0, // Namely z-index
                gridColor: '#dedede', // Color of grid lines
                lineWidth: 1.0, // Width of grid lines
            
                // Guidelines
                guidelinesStackOrder: 4, // z-index of guidelines
                guidelinesTolerance: 2.00, // Tolerance distance for rendered positions of nodes' interaction.
                guidelinesStyle: { // Set ctx properties of line. Properties are here:
                    strokeStyle: "#8b7d6b", // color of geometric guidelines
                    geometricGuidelineRange: 400, // range of geometric guidelines
                    range: 100, // max range of distribution guidelines
                    minDistRange: 10, // min range for distribution guidelines
                    distGuidelineOffset: 10, // shift amount of distribution guidelines
                    horizontalDistColor: "#ff0000", // color of horizontal distribution alignment
                    verticalDistColor: "#00ff00", // color of vertical distribution alignment
                    initPosAlignmentColor: "#0000ff", // color of alignment to initial mouse location
                    lineDash: [0, 0], // line style of geometric guidelines
                    horizontalDistLine: [0, 0], // line style of horizontal distribution guidelines
                    verticalDistLine: [0, 0], // line style of vertical distribution guidelines
                    initPosAlignmentLine: [0, 0], // line style of alignment to initial mouse position
                },
            
                // Parent Padding
                parentSpacing: -1 // -1 to set paddings of parents to gridSpacing
            })
            
            //this.drawPhases(cytoscape)
        },

        // draw phases separately
       // drawPhases(cyi) {
            //const cyi = (this.$refs.cy || {}).instance || null      
            //if(!cyi) return
            /*const layers = cyi.layers()
            layers.nodeLayer.insertAfter('html-static').node.innerHTML = 'Static Test Label'
            layers.renderPerNode(layers.append('canvas'), (ctx, node, bb) => {
                if(node._private.data.class == 'phase') {
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(0, 0, 600, bb.h);
                }
            });  */

        //},
        
        // export visible part of diagram to PNG file
        exportPartPNG(cyi) { this.exportPNG(cyi, false) },

        // export entire diagram to PNG file
        exportFullPNG(cyi) { this.exportPNG(cyi, true) },

        // export diagram to PNG file
        exportPNG(cyi, full=false) {
            if(!cyi) return
            const png64 = cyi.png({full: full, output: 'blob'});            
            const fileName = `phaser-${ moment().format("YYYYMMDDHHmmss") }.png`
            
            let blob = new Blob([png64], { type: 'image/png' })
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, fileName)
            } else {
                let link = document.createElement('a')
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    let url = URL.createObjectURL(blob)
                    link.setAttribute('href', url)
                    link.setAttribute('download', fileName)
                    link.style.visibility = 'hidden'
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                }
            }
        },

        clear(cyi) {
            cyi.zoom(1)
            cyi.pan({x: 0, y: 0})
        },

        // zoom diagram
        zoomIn(cyi) { this.zoomMe(cyi, 1.25) },
        zoomOut(cyi) { this.zoomMe(cyi, 0.75) },
        zoomMe(cyi, zoomBy=1) {
            if(!cyi) return
            cyi.zoom({
                level: cyi.zoom() * zoomBy,
                position: {
                    x: Math.round((cyi.extent().x1 + cyi.extent().x2) / 2),
                    y: Math.round((cyi.extent().y1 + cyi.extent().y2) / 2),
                }
            })
        },

        zoomFit(cyi) {
            if(!cyi) return            
            cyi.fit()
        },

        redoLayout(cyi) {
            if(!cyi) return
            this.clear(cyi)
            cyi.layout(this.config.layout).run() 
            //this.drawPhases(cyi)
        },
        layoutStop() {
            // update node x,y positions within store following auto-layout, as
            // cytoscape-vue "sync" doesn't do it? (only syncs manual positions)
            const cyi = (this.$refs.cy || {}).instance || null
            if(!cyi) return
            
            cyi.elements("node").forEach(node => { 
                this.$store.dispatch('updateNode', { 
                    data: node.data(), 
                    position: node.position() 
                })
            })
        }
    },

	// lifecycle hooks
    beforeCreate() {},
    created() {},   
    afterCreated() {
        // if(this.cyi) this.cyi.layout.run()
    }, 
	beforeMount() {},
	mounted() {
        let self = this  
        const cyi = (this.$refs.cy || {}).instance || null      
        if(!cyi) return
                
        // cytoscape diagram event handlers
        cyi.on('click tap', 'node', function(evt) {
            self.selectedElementID = evt.target.id() 
            //document.querySelector("#cytoscape-div > canvas:nth-child(2)").style.zIndex = "0"           
        })

        // drawing phases on supplementary layer
        var layer = cyi.cyCanvas();
        var canvas = layer.getCanvas();
        var ctx = canvas.getContext('2d');
        cyi.on("render cyCanvas.resize pan", function() {
            
            layer.resetTransform(ctx);
            layer.clear(ctx)

            // Draw fixed elements
            //ctx.fillRect(0, 0, 100, 100); // Top left corner

            layer.setTransform(ctx);

            // Draw phase elements relative to cy nodes
            let extent = cyi.extent()            
            cyi.nodes('[class = "phase"]')
                //.filter(node => node.data.class == "phase")
                .forEach(function(node) {
                    let dims = node.layoutDimensions()
                    let x = extent.x1
                    let y = node.position().y - (dims.h/2)
                    let w = extent.w
                    let h = dims.h
                   
                    // draw phase outline (dashed red)
                    ctx.strokeStyle = "red"
                    ctx.setLineDash([5,5]);
                    ctx.strokeRect(x, y, w, h);  
                    
                     // draw phase fill
                    ctx.globalAlpha = 0.2;
                    ctx.fillStyle = "ivory";
                    ctx.fillRect(x,y, w,h)
                    ctx.globalAlpha = 1.0;
            });
        });


        // override height setting on cytoscape-vue div, else always 600px!
        // see https://github.com/rcarcasses/vue-cytoscape/issues/47
        document.getElementById("cytoscape-div").style.minHeight="900px" 
                
        // event bus message handlers (events fired from menu bar)
        self.$root.$on("diagramClear", () => self.clear(cyi))
        self.$root.$on("diagramZoomIn", () => self.zoomIn(cyi))
        self.$root.$on("diagramZoomOut", () => self.zoomOut(cyi))
        self.$root.$on("diagramZoomFit", () => self.zoomFit(cyi))
        self.$root.$on("diagramRedoLayout", () => self.redoLayout(cyi))        
        self.$root.$on("diagramExportPartPNG", () => self.exportPartPNG(cyi))
        self.$root.$on("diagramExportFullPNG", () => self.exportFullPNG(cyi))

        // ensure parent change is updated on diagram (grouping)
        // cytoscape data.parent is immutable so must call 'move'
        self.$root.$on("nodeParentChanged", (node) => {
            let eles = cyi.elements(`[id = "${node.data.id}"]`)
            if(node.data.parent !== "")
                eles.move({ parent: node.data.parent }) 
            else    // removing from group
                eles.move({ parent: null })
        })
    },
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
	destroyed() {
        // ckear event listeners to avoid memory leaks. See:
        // https://blog.usejournal.com/vue-js-best-practices-c5da8d7af48d
        //self.$root.$off()
    }
}
</script>

<style scoped>
    #diagram2 { position: absolute; }
</style>