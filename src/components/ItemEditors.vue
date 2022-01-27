<template>
	<b-tabs 
		v-model="tabIndex" 
		class="my-1" 
		align="left" 
		active-nav-item-class="font-weight-bold">		
		<b-tab v-for="nc in [...nodeClasses, 'edge']" :key="nc" class="my-2">
			<template v-slot:title>
				<span>{{ capitalize(nc) }}s</span>
				<b-badge
					variant="outline" 
					class="border secondary pb-1 m-0 ml-2">
					<span>{{ itemCount(nc) }}</span>					
				</b-badge>
			</template>
			<ItemEditor :itemClass="nc"/>
		</b-tab>		
		<b-tab>
			<template v-slot:title>Validation</template>
			<ValidationAsync/>
		</b-tab>
		<b-tab>
			<template v-slot:title>Temporal</template>
			<TemporalRelationships/>			
		</b-tab>
		<b-tab lazy>
			<template v-slot:title>Metadata</template>
			<MetaEditor/>
		</b-tab>	
		<b-tab>
			<template v-slot:title>Search (experimental)</template>
			<SearchControls/>			
		</b-tab>
    </b-tabs>
</template>

<script>
import { ref, computed, watch, inject } from "@vue/composition-api" // Vue 2 only. for Vue 3 use "from '@vue'"
import ItemEditor from '@/components/ItemEditor'
import ValidationAsync from '@/components/ValidationAsync'
import MetaEditor from '@/components/MetaEditor'
import SearchControls from '@/components/SearchControls'
import TemporalRelationships from '@/components/TemporalRelationships'
import { NodeClass, capitalize } from '@/global/PhaserCommon'

export default {
	components: {
		ItemEditor,
		ValidationAsync,
		MetaEditor,
		SearchControls,
		TemporalRelationships,
	},
	setup() {
		const store = inject('store')	
		const tabIndex = ref(0)
		const selectedID = computed(() => store.getters.selectedID)	
		const nodeClasses = Object.values(NodeClass) 			

		const itemCount = nc => {
			switch(nc) {
				case NodeClass.PHASE: return store.getters.phases.length
				case NodeClass.GROUP: return store.getters.groups.length
				case NodeClass.SUBGROUP: return store.getters.subgroups.length
				case NodeClass.CONTEXT: return store.getters.contexts.length
				case NodeClass.DATING: return store.getters.datings.length
				case NodeClass.PERIOD: return store.getters.periods.length
				case "edge": return store.getters.edges.length
				default: return 0
			}
		}

		// display tab corresponding to the currently selected item (may be bode or edge)
		watch(selectedID, (newID) => {			
			if(store.getters.isNode(newID)) {
				// if it's a node, display tab according to node.data.class
				let nc = store.getters.nodeByID(newID).data?.class				
				switch(nc) {
					case NodeClass.PHASE: tabIndex.value = 0;break;
					case NodeClass.GROUP: tabIndex.value = 1;break;
					case NodeClass.SUBGROUP: tabIndex.value = 2;break;
					case NodeClass.CONTEXT: tabIndex.value = 3;break;
					case NodeClass.DATING: tabIndex.value = 4;break;
					case NodeClass.PERIOD: tabIndex.value = 5;break;
				}
			}
			else if(store.getters.isEdge(newID)) {
				// if it's an edge, display edges tab	
				tabIndex.value = 6
			}
			else return					
		})

		return { 
			//edgeCount, 
			tabIndex, 
			selectedID, 
			nodeClasses, 
			itemCount, 
			capitalize 
		}
	}
}
</script>