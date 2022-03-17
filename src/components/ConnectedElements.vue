<template>
    <div>
        <span>Derived relationships</span>
        <StatusKey/>
      
        <b-table sort-icon-left outlined small show-empty
            ref="relationships"
            id="relationships"  
            style="height: 150px;"                  
            :no-border-collapse="true"
            :sticky-header="true" 
            :items="tableData" 
            :fields="tableFields"
            class="shadow-sm"
            :tbody-tr-class="rowClass">
            <template #cell(sourceLabel)="row">
                <NodeIconLink :nodeID="row.item.sourceID"/>
            </template>
            <template #cell(targetLabel)="row">
                <NodeIconLink :nodeID="row.item.targetID"/>
            </template>
            <template #cell(sourceDates)="row">
                <YearRangeDisplay 
                    :minYear="row.item.sourceDates.minYear" 
                    :maxYear="row.item.sourceDates.maxYear"
                    :showDuration="true"/>                                                    
            </template> 
            <template #cell(targetDates)="row">
                <YearRangeDisplay 
                    :minYear="row.item.targetDates.minYear" 
                    :maxYear="row.item.targetDates.maxYear"
                    :showDuration="true"/>                
            </template>
        </b-table>
    </div>      
</template>
<script>
import { inject, computed } from "@vue/composition-api" // Vue 2 only. for Vue 3 use "from '@vue'"
import { rangeRelationship, isPhase, isGroup, isSubGroup, isContext, relationshipStatus } from '@/composables/PhaserCommon'
import NodeIconLink from '@/components/NodeIconLink'
import YearRangeDisplay from '@/components/YearRangeDisplay'
import StatusKey from '@/components/StatusKey'

export default {
    components: { 
        NodeIconLink, 
        YearRangeDisplay,
        StatusKey 
    },
    props: {
        contextID: {
			type: String,
			required: false,
			default: ""	
		}
    },
	setup(props) {
		const store = inject('store')        
       
        // conditional colour coding of rows
        const rowClass = (item, type) => {
            if (!item || type !== 'row') 
                return             
            
            let sourceNodeClass = store.getters.classByID(item.sourceID)
            let targetNodeClass = store.getters.classByID(item.targetID)
            return relationshipStatus(sourceNodeClass, targetNodeClass, item.stratRelationship, item.tempRelationship)
        } 
        
        /*
        // get subset of elements connected either by stratigraphy or by containment
        const getConnectedElements = nodeID => {

            // get direct stratigraphic links to/from specified node
            let connectedEdges = []
                .concat(store.getters.edgesBySource(nodeID))
                .concat(store.getters.edgesByTarget(nodeID))
            
            // get unique IDs for all connected elements
            // (connected by stratigraphy or containment)
            let connectedNodeIDs = new Set()

            connectedEdges.forEach(edge => {
                // add source and target IDs
                connectedNodeIDs.add(edge.data.source)
                connectedNodeIDs.add(edge.data.target)

                // add source node ancestry IDs (includes subgroups, groups and phases)
                store.getters
                    .ancestorsOfID(edge.data.source)
                    .forEach(node => connectedNodeIDs.add(node.data.id))

                // add target node ancestry IDs (includes subgroups, groups and phases)
                store.getters
                    .ancestorsOfID(edge.data.target)
                    .forEach(node => connectedNodeIDs.add(node.data.id))
            })
            
            // get all elements in the identified subset of IDs
            let connectedNodes = [...connectedNodeIDs]
                .map(id => store.getters.nodeByID(id))                
            
            // needed to be ordered for diagram nesting to work in cytoscape
            // but we're not using that now so don't bother with this stage
            // let phases = connectedNodes.filter(isPhase)
            // let groups = connectedNodes.filter(isGroup)
            // let subgroups = connectedNodes.filter(isSubGroup)
            // let contexts = connectedNodes.filter(isContext)
            // let nodes = [].concat(phases).concat(groups).concat(subgroups).concat(contexts)
            
            return {
                nodes: connectedNodes, //nodes
                edges: connectedEdges
            }
        }*/

        // get derived stratigraphic links
        const getDSR = contextID => {
            let dsr = []

            // ensure its a valid node ID before proceeding
            const context = store.getters.nodeByID(contextID)
            if(!context) return dsr

            // get direct stratigraphic links to/from specified context
            const connectedEdges = []
                .concat(store.getters.edgesBySource(contextID))
                .concat(store.getters.edgesByTarget(contextID))

            // get ancestry of all directly connected contexts
            const contextAncestry = new Map()
            connectedEdges.forEach(edge => {
               [edge.data.source, edge.data.target].forEach(nodeID => {
                    if(!contextAncestry.has(nodeID)) {
                        const ancestors = store.getters
                            .ancestorsOfID(nodeID)      // elements hierarchically containing this context
                            .map(node => node.data.id)  // we only need the identifier not the full element
                            .concat(nodeID)             // add ID of this element (not included in ancestors)
                        contextAncestry.set(nodeID, ancestors) // storing array of ancestor IDs for this context
                    }
               })
            })

            // get derived stratigraphic links
            connectedEdges.forEach(edge => {

                // get ancestry of both source and target contexts               
                let sourceAncestry = new Set(contextAncestry.get(edge.data.source))
                let targetAncestry = new Set(contextAncestry.get(edge.data.target))

                // remove any IDs the 2 sets have in common
                sourceAncestry.forEach(id => {
                    if(targetAncestry.has(id)) {
                        sourceAncestry.delete(id)
                        targetAncestry.delete(id)
                    }
                }) 

                // derived stratigraphic links to THIS context
                sourceAncestry.forEach(sourceID => {
                    targetAncestry.forEach(targetID => { 
                        if(sourceID === contextID || targetID === contextID) {                       
                            dsr.push({ 
                                sourceID: sourceID, 
                                targetID: targetID, 
                                edgeType: edge.data.type
                            })
                        }
                    })
                }) 
            })
            
            return dsr
        } 

        const tableData = computed(() => {
            const dsr = getDSR(props.contextID) // getConnectedElements(props.contextID)

            return dsr.map(item => {
                const sourceDates = store.getters.derivedNodeDates(item.sourceID)
                const targetDates = store.getters.derivedNodeDates(item.targetID)

                return {
                    sourceID: item.sourceID,
                    targetID: item.targetID,
                    sourceDates: sourceDates,
                    targetDates: targetDates,
                    stratRelationship: item.edgeType,                    
                    tempRelationship: rangeRelationship(sourceDates, targetDates)
                }
            })
            
            
            /*return connectedElements.edges.map(edge => {
                const sourceDates = store.getters.derivedNodeDates(edge.data.source)
                const targetDates = store.getters.derivedNodeDates(edge.data.target)

                return { 
                    sourceID: edge.data.source,
                    sourceClass: store.getters.classByID(edge.data.source),
                    sourceLabel: store.getters.labelByID(edge.data.source),
                    sourceDates: sourceDates,
                    stratRelationship: edge.data.type,
                    tempRelationship: rangeRelationship(sourceDates, targetDates),
                    targetClass: store.getters.classByID(edge.data.target),
                    targetID: edge.data.target,
                    targetLabel: store.getters.labelByID(edge.data.target),
                    targetDates: targetDates,
                }
            })*/
        })

        const tableFields = [
            {
				key: "sourceLabel",
				label: "source",
                sortable: false				
			}, 
            {		
				key: 'sourceDates',
				label: 'years (duration)',                
				sortable: false					
			},           
            {		
				key: 'stratRelationship',
				label: 'stratigraphic',
				sortable: false					
			},
            {		
				key: 'tempRelationship',
				label: 'temporal',
				sortable: false					
			},
            {
				key: "targetLabel",
				label: "target",
                sortable: false		
			}, 
            {		
				key: 'targetDates',
				label: 'years (duration)',                
				sortable: false					
			}, 
        ]
        
		return { store, rowClass, tableFields, tableData }
	}

}
</script>

<style scoped>
#holder {
    height: 200px;
    width: 100%;
}
a:hover {
	color: red;	
}
.status {
    z-index: 5;
    padding: 0px 4px;
    margin: 0px;
    border: 1px solid lightgray;
}
/deep/ .status-valid {
    background-color: #c3e6cb;    
}
/deep/ .status-uncertain {
    background-color: gold; /* was #ffeeba; */
}
/deep/ .status-needsmore {
    background-color: moccasin; /* was lightyellow; */
}
/deep/ .status-invalid {
    background-color: #f5c6cb;
}
/deep/ .status-unknown {
    background-color: white;
}
</style>