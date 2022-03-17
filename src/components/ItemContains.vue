<template>
	<b-overlay :show="busy">
		<b-input-group-prepend>Contains</b-input-group-prepend>
		<b-list-group 				
			name="contains"
			class="shadow-sm border overflow-auto" 
			style="height: 90px; resize: vertical;"   
			:disabled="disabled">
			<b-list-group-item v-for="(item, index) in items"
				class="px-2 py-0 m-0"							 
				:key="index">
				<NodeIconLink :nodeID="item.data.id"/>                							
			</b-list-group-item>
		</b-list-group>	
	</b-overlay>		
</template>
<script>
import { inject, ref, watch, computed } from "@vue/composition-api" // Vue 2 only. for Vue 3 use "from '@vue'"
import { isPeriod } from '@/composables/PhaserCommon.js'
import NodeIconLink from '@/components/NodeIconLink'
export default {
    name: 'ItemContains',
	components: {
		NodeIconLink
    },
    props: {
        id: {
            type: String,
            required: false,
			default: null
        },
		disabled: {
			type: Boolean,
			required: false,
			default: false 
		}
    },
	setup(props) {
		const store = inject('store')					
		const items = ref([])
		const busy = ref(false) //for async population??
		
		const getContainedItems = async (id) => {			
			let node = store.getters.nodeByID(id)
			if(node) {
				if(isPeriod(node)) {
					// list all nodes that reference this period
					items.value = store.getters.nodes.filter(n => n.data.period === id)
				}
				else {
					// hierarchical containment relationships 
					// list all descendants of selected node
					items.value = store.getters.descendantsOfID(id) 
				}
			}		
		}
		// computed properties are synchronous 
		// so using watcher and async function instead
		const nodeID = computed(() => props.id)
		watch(nodeID, async (newID) => {
			busy.value = true
			items.value = []
			await getContainedItems(newID)
			busy.value = false
		}, { immediate:true })	
		
        /*const items = computed(() => {
			let node = store.getters.nodeByID(props.id)
			if(node) {
				if(isPeriod(node)) {
					// list all nodes that reference this period
					return store.getters.nodes.filter(n => n.data.period === props.id)
				}
				else {
					// hierarchical containment relationships 
					// list all descendants of selected node
					return store.getters.descendantsOfID(props.id) 
				}
			}
			else
				return []
		})*/

        return { store, items, busy }

	}
}
</script>
<style scoped>
a:hover {
	color:red;
}
</style>