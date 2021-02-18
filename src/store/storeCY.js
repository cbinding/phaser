import Vue from "vue"
import Vuex from "vuex"
// import VuexPersist from 'vuex-persist'
import createPersistedState from "vuex-persistedstate"
import _merge  from "lodash/merge"
import {NodeClass} from "@/mixins/constants.js"

Vue.use(Vuex)

/*
const vuexLocalStorage = new VuexPersist({
    key: 'vuex', // The key to store the state on in the storage provider.
    storage: window.localStorage // or window.sessionStorage or localForage
})
*/

export default new Vuex.Store({
	// strict: true,
    // plugins: [vuexLocalStorage.plugin],
    plugins: [ createPersistedState({ storage: window.localStorage }) ],
	state: {
        selectedID: "",
        about: { // not used yet..
            project: "My example project",
            descrip: "Example data for testing VUEX. Using Cytoscape graph elements structure",
            creator: "Ceri Binding, University of South Wales",
            contact: "ceri.binding@southwales.ac.uk",
            created: "2021-01-07",
            updated: "2021-01-07", 
            version: "1.0",           
        },  
        graph: {
            nodes: [],
            edges: []
        }, 
        types: {            
            groupTypes: [
                "Building", 
                "Corn-drying oven", 
                "Ditch overall", 
                "Drain", 
                "Four-post structure", 
                "Hearth", 
                "Kiln", 
                "Oven", 
                "Post-hole: group", 
                "Road", 
                "Structure", 
                "Well"  
            ],
            contextTypes: [ // TODO: load from external JSON. Part of config?
                "Animal disturbance",
                "Animal disturbance: fill",
                "Ard mark",
                "Ard mark: fill",
                "Bank",
                "Beam slot",
                "Beam slot: fill",
                "Beam",
                "Coffin",
                "Coffin: fill",
                "Coffin: stain",
                "Corn-drying oven: cut",
                "Corn-drying oven: fill",
                "Corn-drying oven: wall",
                "Cremation pit",
                "Cremation pit: fill",
                "Cremation vessel",
                "Cremation vessel: fill",
                "Cremation",
                "Ditch segment",
                "Ditch segment: fill",
                "Ditch",
                "Ditch: fill",
                "Drain: capping",
                "Drain: construction trench fill",
                "Drain: construction trench",
                "Drain: fill",
                "Drain: lining",
                "Drain: packing",
                "Drain: pipe",
                "Drove way",
                "Enclosure",
                "Feature",
                "Feature: fill",
                "Floor",
                "Floor: tessellated",
                "Flue",
                "Flue: fill",
                "Foundation: cut",
                "Foundation: layer",
                "Furnace",
                "Grave",
                "Grave: fill",
                "Gully",
                "Gully: fill",
                "Hearth pit",
                "Hearth pit: fill",
                "Hearth: debris",
                "Hoof print",
                "Hoof print: fill",
                "Interface",
                "Kiln: debris",
                "Kiln: fill",
                "Kiln: lining",
                "Layer",
                "Layer: accumulation",
                "Layer: buried soil",
                "Layer: levelling",
                "Layer: natural",
                "Layer: occupation",
                "Layer: plough soil",
                "Layer: redeposited natural",
                "Layer: rubble",
                "Layer: subsoil",
                "Layer: topsoil",
                "Lens",
                "Linear feature",
                "Linear feature: fill",
                "Modern intrusion",
                "Modern intrusion: fill",
                "Natural feature",
                "Natural feature: fill",
                "Palaeochannel",
                "Palaeochannel: fill",
                "Pit",
                "Pit, cess",
                "Pit, cess: fill",
                "Pit: fill",
                "Pit: lining",
                "Plough furrow",
                "Plough furrow: fill",
                "Plough mark",
                "Plough mark: fill",
                "Post-hole",
                "Post-hole: fill",
                "Post-hole: packing",
                "Post-pad",
                "Post-pipe",
                "Post-pipe: fill",
                "Pottery: spread",
                "Quarry pit",
                "Quarry pit: fill",
                "Ring ditch",
                "Robbing trench",
                "Robbing trench: fill",
                "Stake",
                "Stake-hole",
                "Stake-hole: fill",
                "Stoke hole",
                "Stoke hole: fill",
                "Surface",
                "Surface: earth/clay",
                "Surface: metalled",
                "Surface: mortar",
                "Surface: paved",
                "Threshold",
                "Tree hollow",
                "Tree hollow: fill",
                "Trial trench",
                "Trial trench: fill",
                "Vessel",
                "Vessel: fill",
                "Wall",
                "Wall: construction trench fill",
                "Wall: construction trench",
                "Well: construction pit fill",
                "Well: construction pit",
                "Well: fill",
                "Well: lining",
                "Wheel rut",
                "Wheel rut: fill"
            ],
            /*findTypes: [
                "find type A",
                "find type B",
                "find type C"
            ],
            sampleTypes: [
                "sample type A",
                "sample type B",
                "sample type C"
            ],*/
            datingTypes: [
                "find",
                "sample",
                "manual"
            ],
            periodTypes: [
                { id: "1", label: "Roman", min: 43, max: 410 },
                { id: "1", label: "Medieval", min: 1066, max: 1540 },
            ]         
        }     
    },	
    
	getters: { 
        // basic elements of graph structure       
        nodes: state => state.graph.nodes,
        edges: state => state.graph.edges,
        //elements: (state, getters) => getters.nodes.concat(getters.edges),  
        
        // specialized elements of graph structure
        phases: (state, getters) => getters.nodes.filter(n => n.data.class === NodeClass.PHASE),
		groups: (state, getters) => getters.nodes.filter(n => n.data.class === NodeClass.GROUP),
        subgroups: (state, getters) => getters.nodes.filter(n => n.data.class === NodeClass.SUBGROUP),
        contexts: (state, getters) => getters.nodes.filter(n => n.data.class === NodeClass.CONTEXT),
        //finds: (state, getters) => getters.nodes.filter(n => n.data.class === NodeClass.FIND),
        //samples: (state, getters) => getters.nodes.filter(n => n.data.class === NodeClass.SAMPLE),
        datings: (state, getters) => getters.nodes.filter(n => n.data.class === NodeClass.DATING),

        // currently selected node ID - for UI
        selectedID: state => state.selectedID,

        // options for lookup controls        
        //phaseTypes: state => state.types.phaseTypes,
        //groupTypes: state => state.types.groupTypes,
        //contextTypes: state => state.types.contextTypes,        
        //findTypes: state => state.types.findTypes,
        //sampleTypes: state => state.types.sampleTypes,
        phaseTypeOptions: state => state.types.phaseTypes.map(s => { return { value: s, text: s }}),
        groupTypeOptions: state => state.types.groupTypes.map(s => { return { value: s, text: s }}),
        contextTypeOptions: state => state.types.contextTypes.map(s => { return { value: s, text: s }}),
        //findTypeOptions: state => state.types.findTypes.map(s => { return { value: s, text: s }}),
        //sampleTypeOptions: state => state.types.sampleTypes.map(s => { return { value: s, text: s }}),
        datingTypeOptions: state => state.types.datingTypes.map(s => { return { value: s, text: s }}),
        /*
        phaseOptions: (state, getters) => getters.phases
            .map(n => { return { value: n.data.id, text: n.data.label }})
            .sort((a, b) => (a.text || a.label || "").localeCompare(b.text || b.label || "")),
        groupOptions: (state, getters) => getters.groups
            .map(n => { return { value: n.data.id, text: n.data.label }})
            .sort((a, b) => (a.text || a.label || "").localeCompare(b.text || b.label || "")),
        subgroupOptions: (state, getters) => getters.subgroups
            .map(n => { return { value: n.data.id, text: n.data.label }})
            .sort((a, b) => (a.text || a.label || "").localeCompare(b.text || b.label || "")),
        contextOptions: (state, getters) => getters.contexts
            .map(n => { return { value: n.data.id, text: n.data.label }})
            .sort((a, b) => (a.text || a.label || "").localeCompare(b.text || b.label || "")),        
        */
        phaseOptionsGrouped: (state, getters) => {
            const options = getters.phases
                .map(n => { return { value: n.data.id, text: n.data.label }})
                .sort((a, b) => (a.text || a.label || "").localeCompare(b.text || b.label || ""))
            return options.length == 0 ? [] : [{ label: "Phase", options: options }]          
        },
        groupOptionsGrouped: (state, getters) => {
            const options = getters.groups
                .map(n => { return { value: n.data.id, text: n.data.label }})
                .sort((a, b) => (a.text || a.label || "").localeCompare(b.text || b.label || ""))
            return options.length == 0 ? [] : [{ label: "Group", options: options }]  
           // ... (getters.groupOptions.length == 0) ? [] : [{ label: "Groups", options: getters.groupOptions }]
        },
        subgroupOptionsGrouped: (state, getters) => {
            const options = getters.subgroups
                .map(n => { return { value: n.data.id, text: n.data.label }})
                .sort((a, b) => (a.text || a.label || "").localeCompare(b.text || b.label || ""))
            return options.length == 0 ? [] : [{ label: "Subgroup", options: options }] 
            // ... (getters.subgroupOptions.length == 0) ? [] : [{ label: "Subgroups", options: getters.subgroupOptions }]
        },
        contextOptionsGrouped: (state, getters) => {
            const options = getters.contexts
                .map(n => { return { value: n.data.id, text: n.data.label }})
                .sort((a, b) => (a.text || a.label || "").localeCompare(b.text || b.label || ""))
            return options.length == 0 ? [] : [{ label: "Context", options: options }] 
        },       
        /*contextOptionsGrouped: (state, getters) => [
            ... (getters.contextOptions.length == 0) ? [] : [{ label: "Contexts", options: getters.contextOptions }]
        ],*/
        
        // context parent could be subgroup, group or phase. May have same label, so grouping options to disambiguate
        contextParentOptions: (state, getters) => [
            ...getters.phaseOptionsGrouped,
            ...getters.groupOptionsGrouped,
            ...getters.subgroupOptionsGrouped
        ],         

        // hierarchical querying functionality
        childrenOfIDs: (state, getters) => ids => getters.nodes.filter(n => ids.includes(n.data.parent)),
        childrenOfID: (state, getters) => id => getters.childrenOfIDs([id]),    
        
        descendantsOfIDs: (state, getters) => ids => {
            let descendants = []
            let childNodes = getters.childrenOfIDs(ids)
            let iteration = 0 // to break self referential loops
            while(childNodes.length > 0 && iteration < 5) {
                descendants = descendants.concat(childNodes)
                childNodes = getters.childrenOfIDs(childNodes.map(n => n.data.id))
                iteration++                
            }           
            return descendants
        },
        descendantsOfID: (state, getters) => id => getters.descendantsOfIDs([id]),
        
        //datingsForID: (state, getters) => id => getters.descendantsOfID(id)
            //.filter(n => n.data.class == NodeClass.DATING && n.data.included),        

        // derive min/max years from hierarchical descendant datings
        derivedDates: (state, getters) => id => {
            let minYear = Number.MAX_VALUE
            let maxYear = Number.MIN_VALUE
            
            getters.descendantsOfID(id)
                .filter(n => n.data.class == NodeClass.DATING && n.data.included && n.data.dating)
           // getters.datingsForID(id)
                .map(n => ((n || {}).data || {}).dating)
                //.filter(dating => dating) 
                .forEach(d => {
                    let clean = {
                        minYear: Number(d.minYear),
                        maxYear: Number(d.maxYear),
                        minYearTolValue: Number(d.minYearTolValue),
                        maxYearTolValue: Number(d.maxYearTolValue),
                        minYearTolUnit: d.minYearTolUnit,
                        maxYearTolUnit: d.maxYearTolUnit
                    }
                    
                    // apply minYear tolerance (if present)
                    if(clean.minYearTolUnit == "percent") 
                        clean.minYear -= (clean.minYear * (clean.minYearTolValue / 100))
                    else
                        clean.minYear -= clean.minYearTolValue

                    // apply maxYear tolerance (if present)
                    if(clean.maxYearTolUnit == "percent") 
                        clean.maxYear += (clean.maxYear * (clean.maxYearTolValue / 100)) 
                    else
                        clean.maxYear += clean.maxYearTolValue 

                    // less than the current minimum?
                    if(minYear > clean.minYear) minYear = clean.minYear
                    // more than the current maximum?
                    if(maxYear < clean.maxYear) maxYear = clean.maxYear
                })
            // return overall rounded min/max year after tolerances applied
            return { 
                minYear: minYear < Number.MAX_VALUE ? Math.round(minYear) : null, 
                maxYear: maxYear > Number.MIN_VALUE ? Math.round(maxYear) : null
            }
        },
        
        // node and edge selection
        nodeByID: (state, getters) => id => getters.nodes.find(n => n.data.id === id),
        edgeByID: (state, getters) => id => getters.edges.find(e => e.data.id === id), 
        nodeLabel: (state, getters) => id => ((getters.nodeByID(id) || {}).data || {}).label || id,
        edgesBySource: (state, getters) => source => getters.edges.filter(e => e.data.source === source),
        edgesByTarget: (state, getters) => target => getters.edges.filter(e => e.data.target === target),

        newPhase: (state, getters) => { 
            const nc = NodeClass.PHASE
            // get next available phase ID to use
            let nextID = 1
            while(getters.nodeByID(`${nc}-${nextID}`)) nextID++ 
            const id = `${nc}-${nextID}`
            return { 
                data: { 
                    id: id, 
                    class: nc, 
                    label: nextID.toString(), 
                    description: "",
                    dating: {
                        label: "",
                        minYear: null,
                        maxYear: null,
                        minYearTolValue: 0,
                        maxYearTolValue: 0,
                        minYearTolUnit: "years",
                        maxYearTolUnit: "years"                        
                    } 
                }, 
                position: { 
                    x: 0, 
                    y: 0 
                } 
            }
        },

        newGroup: (state, getters) => { 
            const nc = NodeClass.GROUP
            // get next available group ID to use
            let nextID = 1
            while(getters.nodeByID(`${nc}-${nextID}`)) nextID++ 
            const id = `${nc}-${nextID}`
            return { 
                data: { 
                    id: id, 
                    class: nc, 
                    parent: "", 
                    type: "",                    
                    label: nextID.toString(), 
                    description: ""
                }, 
                position: { 
                    x: 0, 
                    y: 0 
                } 
            }
        },

        newSubGroup: (state, getters) => { 
            const nc = NodeClass.SUBGROUP
            // get next available subgroup ID to use
            let nextID = 1
            while(getters.nodeByID(`${nc}-${nextID}`)) nextID++ 
            const id = `${nc}-${nextID}`
            return { 
                data: { 
                    id: id, 
                    class: nc, 
                    parent: "", 
                    type: "",
                    label: nextID.toString(), 
                    description: ""                    
                }, 
                position: { 
                    x: 0, 
                    y: 0 
                } 
            }
        },

        newContext: (state, getters) => { 
            const nc = NodeClass.CONTEXT
            // get next available context ID to use 
            let nextID = 1
            while(getters.nodeByID(`${nc}-${nextID}`)) nextID++ 
            const id = `${nc}-${nextID}`
            return { 
                data: { 
                    id: id, 
                    class: nc, 
                    parent: "", 
                    type: "",
                    label: nextID.toString(),
                    description: ""                    
                }, 
                position: { 
                    x: 0, 
                    y: 0 
                } 
            }
        },

        /*newFind: (state, getters) => { 
            const nc = NodeClass.FIND
            // get next available context ID to use 
            let nextID = 1
            while(getters.nodeByID(`${nc}-${nextID}`)) nextID++ 
            const id = `${nc}-${nextID}`
            return { 
                data: { 
                    id: id, 
                    class: nc, 
                    parent: "",
                    label: nextID.toString(), 
                    type: "",
                    dating: {
                        label: "",
                        minYear: null,
                        maxYear: null,
                        minYearTolValue: 0,
                        maxYearTolValue: 0,
                        minYearTolUnit: "years",
                        maxYearTolUnit: "years"
                    }  
                }, 
                position: { 
                    x: 0, 
                    y: 0 
                } 
            }
        },*/

        /*newSample: (state, getters) => { 
            const nc = NodeClass.SAMPLE
            // get next available context ID to use 
            let nextID = 1
            while(getters.nodeByID(`${nc}-${nextID}`)) nextID++ 
            const id = `${nc}-${nextID}`
            return { 
                data: { 
                    id: id, 
                    class: nc, 
                    parent: "",
                    label: nextID.toString(), 
                    type: "",
                    dating: {
                        label: "",
                        minYear: null,
                        maxYear: null,
                        minYearTolValue: 0,
                        maxYearTolValue: 0,
                        minYearTolUnit: "years",
                        maxYearTolUnit: "years"
                    }  
                }, 
                position: { 
                    x: 0, 
                    y: 0 
                } 
            }
        },   */
        
        newDating: (state, getters) => { 
            const nc = NodeClass.DATING
            // get next available context ID to use 
            let nextID = 1
            while(getters.nodeByID(`${nc}-${nextID}`)) nextID++ 
            const id = `${nc}-${nextID}`
            return { 
                data: { 
                    id: id, 
                    class: nc, 
                    parent: "",
                    type: "",                    
                    label: nextID.toString(), 
                    description: "",
                    included: true,
                    dating: {
                        label: "",
                        minYear: null,
                        maxYear: null,
                        minYearTolValue: 0,
                        maxYearTolValue: 0,
                        minYearTolUnit: "years",
                        maxYearTolUnit: "years"
                    }  
                }, 
                position: { 
                    x: 0, 
                    y: 0 
                }
            } 
        },

        newEdge: (state, getters) => {
            // get next available edge ID to use 
            let nextID = 1            
            while(getters.edgeByID(`edge-${nextID}`)) nextID++ 
            const id = `edge-${nextID}` 
            return { data: { id: id, source: "", target: "", type: "" } }
        }
    },
    
    //code modified from https://codeburst.io/build-a-simple-todo-app-with-vue-js-1778ae175514
    // mutations are synchronous, keep them as simple as possible
	mutations: {        
        INSERT_NODE(state, node) {
            const nodes = state.graph.nodes
            const index = nodes.findIndex(n => n.data.id === node.data.id)  // check if id exists     
            if(index === -1)                    // id doesn't exist
                nodes.push(node)                // add the node            
        },
        UPDATE_NODE(state, node) {
            const nodes = state.graph.nodes
            const index = nodes.findIndex(n => n.data.id === node.data.id)  // check if id exists     
            if(index !== -1) {                   // id exists
                Vue.set(nodes, index, node) // see if this works better? trying to ensure reactivity of grouping
                //nodes.splice(index, 1, node)  // otherwise this will work.. replace the node
                
            }
        },
        // currently selected node ID - for visual indication
        SELECT_ID(state, id) {
            state.selectedID = id || ""
        },

        DELETE_NODE(state, node) {
            const nodes = state.graph.nodes
            const index = nodes.findIndex(n => n.data.id === node.data.id)
            if(index !== -1)                    // id exists
                nodes.splice(index, 1)          // remove 
        },
        DELETE_NODES(state) {
            state.graph.nodes = []
        },
        INSERT_EDGE(state, edge) {
            const edges = state.graph.edges
            const index = edges.findIndex(e => e.data.id === edge.data.id)
            if(index === -1)                    // id doesn't exist
                edges.push(edge)                // add the edge            
        },
        UPDATE_EDGE(state, edge) {
            const edges = state.graph.edges
            const index = edges.findIndex(e => e.data.id === edge.data.id)
            if(index !== -1)  {                  // id exists
                Vue.set(edges, index, edge) // see if this works? trying to ensure reactivity of grouping
                //edges.splice(index, 1, edge)    // otherwise this will work.. replace the edge
            }
        },
        DELETE_EDGE(state, edge) {
            const edges = state.graph.edges
            const index = edges.findIndex(e => e.data.id === edge.data.id)
            if(index !== -1)            // exists, remove 
                edges.splice(index, 1)  // remove 
        },
        DELETE_EDGES(state) {
            state.graph.edges = []
        }		
	},
	actions: {
        // loadContextTypes(){}, // [part of config?]
        // loadGroupTypes(){},   // [part of config?] 
	
        async loadMatrixData({commit, dispatch}, data){
            // actions are asynchronous so ensure order of actions
            await dispatch('clearAll', commit)

            let phases = (data.nodes || []).filter(n => n.data.class == NodeClass.PHASE)
            let groups = (data.nodes || []).filter(n => n.data.class == NodeClass.GROUP)
            let subgroups = (data.nodes || []).filter(n => n.data.class == NodeClass.SUBGROUP)
            let contexts = (data.nodes || []).filter(n => n.data.class == NodeClass.CONTEXT)
            //let finds = (data.nodes || []).filter(n => n.data.class == NodeClass.FIND)
            //let samples = (data.nodes || []).filter(n => n.data.class == NodeClass.SAMPLE)
            let datings = (data.nodes || []).filter(n => n.data.class == NodeClass.DATING)

            // not just insertNode, need to ensure each object has all required properties
            phases.forEach(item => dispatch('insertPhase', item, commit))
            groups.forEach(item => dispatch('insertGroup', item, commit))
            subgroups.forEach(item => dispatch('insertSubGroup', item, commit))
            contexts.forEach(item => dispatch('insertContext', item, commit))  
            //finds.forEach(item => dispatch('insertFind', item, commit))
            //samples.forEach(item => dispatch('insertSample', item, commit))  
            datings.forEach(item => dispatch('insertDating', item, commit))       
            //await dispatch('insertNodes', data.nodes || [], commit)
            await dispatch('insertEdges', data.edges || [], commit)
        },
        //saveMatrixData(){},

        clearAll({commit}) {
            // mutations are synchronous so this is OK
            commit('DELETE_NODES')
            commit('DELETE_EDGES')
            Promise.resolve() // See https://blog.usejournal.com/vue-js-best-practices-c5da8d7af48d
        },        
        insertNode({commit}, node) { 
            commit('INSERT_NODE', node)            
        },
        insertNodes({commit, dispatch}, nodes) {
            nodes.forEach(node => dispatch('insertNode', node, commit))
            Promise.resolve() 
        },
		updateNode({commit}, node) {
			commit('UPDATE_NODE', node)
		},
        setSelectedID({commit}, id) {
            commit('SELECT_ID', id)
        },
		deleteNode({commit}, node) {
			commit('DELETE_NODE', node)
        },
        
        createEdge({commit, dispatch, getters}) {
            let edge = getters.newEdge
            //commit('CREATE_EDGE', edge) 
            dispatch('insertEdge', edge, commit)  
        },
        insertEdge({commit}, edge) {
            if(!edge.data.id)
                edge.data.id = `edge-${edge.data.source || 'source'}-${edge.data.target || 'target'}`
            commit('INSERT_EDGE', edge)            
        },
        insertEdges({commit, dispatch}, edges) {
            edges.forEach(edge => dispatch('insertEdge', edge, commit))	
            Promise.resolve() 
        },
		updateEdge({commit}, edge) {
			commit('UPDATE_EDGE', edge)
		},
		deleteEdge({commit}, edge) {
			commit('DELETE_EDGE', edge)
        }, 

        insertPhase({commit, dispatch, getters}, item) {
            // ensure item being added has all required properties  
            let node = _merge({}, getters.newPhase, item)
            dispatch('insertNode', node, commit)  
        },
        insertGroup({commit, dispatch, getters}, item) {
            // ensure item being added has all required properties        
            let node = _merge({}, getters.newGroup, item)
            dispatch('insertNode', node, commit)  
        },
        insertSubGroup({commit, dispatch, getters}, item) {
            // ensure item being added has all required properties        
            let node = _merge({}, getters.newSubGroup, item)
            dispatch('insertNode', node, commit)  
        },
        
        insertContext({commit, dispatch, getters}, item) {
            // ensure item being added has all required properties        
            let node = _merge({}, getters.newContext, item)
            dispatch('insertNode', node, commit)  
        }, 
        /*insertFind({commit, dispatch, getters}, item) {
            // ensure item being added has all required properties        
            let node = _merge({}, getters.newFind, item)
            dispatch('insertNode', node, commit)  
        }, 
        insertSample({commit, dispatch, getters}, item) {
            // ensure item being added has all required properties        
            let node = _merge({}, getters.newSample, item)
            dispatch('insertNode', node, commit)  
        },*/
        insertDating({commit, dispatch, getters}, item) {
            // ensure item being added has all required properties        
            let node = _merge({}, getters.newDating, item)
            dispatch('insertNode', node, commit)  
        },


        createPhase({commit, dispatch, getters}) {
            let node = getters.newPhase
            //commit('CREATE_NODE', node)  
            dispatch('insertNode', node, commit)
        },
        createGroup({commit, dispatch, getters}) {
            let node = getters.newGroup
            //commit('CREATE_NODE', node) 
            dispatch('insertNode', node, commit) 
        },    
        createSubGroup({commit, dispatch, getters}) {
            let node = getters.newSubGroup
            //commit('CREATE_NODE', node)  
            dispatch('insertNode', node, commit) 
        },          
        createContext({commit, dispatch, getters}) {
            let node = getters.newContext
            //commit('CREATE_NODE', node)  
            dispatch('insertNode', node, commit)         
        },
        /*createFind({commit, dispatch, getters}) {
            let node = getters.newFind
            dispatch('insertNode', node, commit)
        },
        createSample({commit, dispatch, getters}) {
            let node = getters.newSample
            dispatch('insertNode', node, commit)
        },*/
        createDating({commit, dispatch, getters}) {
            let node = getters.newDating
            dispatch('insertDating', node, commit)
        },       
		/*addContext({commit}, context){
			commit('ADD_NODE', context)
        },
        addContexts({commit}, contexts){
			commit('ADD_NODES', contexts)
        },
		editContext({commit}, context){
			commit('UPDATE_NODE', context)
		},
		removeContext({commit}, context){
			commit('REMOVE_NODE', context)
        } */       
	}	
})