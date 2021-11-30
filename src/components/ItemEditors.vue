<template>
	<b-tabs v-model="tabIndex" class="my-1">
		<b-tab v-for="nc in nodeClasses" :key="nc" class="my-2">
			<template v-slot:title>
				<span>{{ capitalize(nc) }}{{ nc !== "dating" ? "s" : "" }}</span>
				<b-badge pill 
					variant="outline" 
					class="border secondary pb-1 m-0 ml-2">
					<span>{{ itemCount(nc) }}</span>					
				</b-badge>
			</template>
			<ItemEditor :itemClass="nc"/>
		</b-tab>		
		<b-tab>
			<template v-slot:title>
				<span>Edges</span>
				<b-badge variant="outline" class="border secondary pb-1 m-0 ml-2">
					<span>{{ store.getters.edges.length }}</span>
				</b-badge>
			</template>
			<ItemEditor itemClass="edge"/>
		</b-tab>

		<b-tab>
			<template v-slot:title>
				<span>Validation</span>				
			</template>
			<Validation/>
		</b-tab>
		
    </b-tabs>
</template>

<script>
import { ref, computed, watch, inject } from "@vue/composition-api" // Vue 2 only. for Vue 3 use "from '@vue'"
//import PhaserCommon from '@/global/PhaserCommon.js'
import ItemEditor from '@/components/ItemEditor'
import Validation from '@/components/Validation'
import { NodeClass, capitalize } from '@/global/PhaserCommon.js'

export default {
	components: {
		ItemEditor,
		Validation
	},
	setup() {
		const store = inject('store')	
		const tabIndex = ref(0)
		const selectedID = computed(() => store.getters.selectedID)
		const nodeClasses = computed(() => Object.values(NodeClass)) 
			//.filter(nc => nc !== NodeClass.FIND && nc !== NodeClass.SAMPLE) //deprecated these

		const itemCount = nc => {
			switch(nc) {
				case NodeClass.PHASE: return store.getters.phases.length
				case NodeClass.GROUP: return store.getters.groups.length
				case NodeClass.SUBGROUP: return store.getters.subgroups.length
				case NodeClass.CONTEXT: return store.getters.contexts.length
				case NodeClass.DATING: return store.getters.datings.length
				case NodeClass.PERIOD: return store.getters.periods.length
				default: return 0
			}
		}

		watch(selectedID, (newValue) => {			
			// display the tab containing the selected item
			let node = store.getters.nodeByID(newValue)
			if(node) {
				let nc = node.data?.class || NodeClass.PHASE
				switch(nc) {
					case NodeClass.PHASE: tabIndex.value = 0;break;
					case NodeClass.GROUP: tabIndex.value = 1;break;
					case NodeClass.SUBGROUP: tabIndex.value = 2;break;
					case NodeClass.CONTEXT: tabIndex.value = 3;break;
					case NodeClass.DATING: tabIndex.value = 4;break;
					case NodeClass.PERIOD: tabIndex.value = 5;break;					
					default: break;
				}
			}
		})

		return { store, tabIndex, selectedID, nodeClasses, itemCount, capitalize }
	}
}
</script>