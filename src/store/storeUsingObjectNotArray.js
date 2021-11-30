//import Vue from "vue"
import Vuex from "vuex"
//import { createStore } from 'vuex'

//Vue.use(Vuex)

const state = {        
    appName: "Phaser", 
    nodes: { 
        "context-123": { id: "context-123", label: "1st node"}, 
        "context-234": { id: "context-234", label: "2nd node"}, 
        "context-345": { id: "context-345", label: "3rd node"}
    }    
}

const getters = { 
    appName: (state) => state.appName,
    nodes: (state) => Object.values(state.nodes),
    nodeByID: (state) => id => state.nodes[id]    
}

const actions = {
    insertNode({commit}, node) { 
        commit('UPDATE_NODE', node)            
    },
    updateNode({commit}, node) {
		commit('UPDATE_NODE', node)
	},
    deleteNode({commit}, node) {
        commit('DELETE_NODE', node)
    }
}

const mutations = { 
    // performs an insert if the node doesn't exist       
    UPDATE_NODE: (state, node) => {
        state.nodes[node.id] = node // add or replace
    },
    DELETE_NODE: (state, node) => {
        //let nodes = state.nodes
        if(Object.hasOwn(state.nodes, node.id))
           state.nodes[node.id] = null            
    }        
}

//export default createStore({
export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})