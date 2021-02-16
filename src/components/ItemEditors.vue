<template>
	<b-tabs v-model="tabIndex" class="my-1">
		<b-tab v-for="nc in nodeClasses" :key="nc" class="my-2">
			<template v-slot:title>
				<span>{{ capitalize(nc) }}{{ nc !== "dating" ? "s" : "" }}</span>
				<b-badge pill variant="outline" class="border secondary pb-1 m-0 ml-2">
					<span v-if="nc === 'phase'">{{ $store.getters.phases.length }}</span>
					<span v-else-if="nc === 'group'">{{ $store.getters.groups.length }}</span>
					<span v-else-if="nc === 'subgroup'">{{ $store.getters.subgroups.length }}</span>
					<span v-else-if="nc === 'context'">{{ $store.getters.contexts.length }}</span>
					<span v-else-if="nc === 'find'">{{ $store.getters.finds.length }}</span>
					<span v-else-if="nc === 'sample'">{{ $store.getters.samples.length }}</span>
					<span v-else-if="nc === 'dating'">{{ $store.getters.datings.length }}</span>
					<span v-else>0</span>
				</b-badge> 																	
			</template>
			<ItemEditor :itemClass="nc"/>
		</b-tab> 

		<!--
		<b-tab>
			<template v-slot:title>
				<span>Problems</span>
				<b-badge pill variant="outline" class="border secondary pb-1 m-0 ml-2">
					<span>0</span>
				</b-badge> 
			</template>
		</b-tab>
		-->
    </b-tabs>
</template>

<script>
import PhaserCommon from '@/mixins/PhaserCommon.js'
import ItemEditor from '@/components/ItemEditor'
import {NodeClass} from '@/mixins/constants.js'

export default {
	name: 'ItemEditors',
	components: {
		ItemEditor
	},
	mixins: [ PhaserCommon ],
	props: {},
	data() {
		return {
			tabIndex: 0
		}
	},
	computed: {
		selectedID(){
			return this.$store.getters.selectedID
		},
		nodeClasses() {
			return Object.values(NodeClass)
			.filter(nc => nc !== NodeClass.FIND && nc !== NodeClass.SAMPLE) //deprecated these
		}		
	},
	watch: {
		selectedID(newValue) {
			// display the tab containing the selected item
			let node = this.$store.getters.nodeByID(newValue)
			let nc = ((node || {}).data || {}).class
			switch(nc) {
				case NodeClass.PHASE: this.tabIndex = 0;break;
				case NodeClass.GROUP: this.tabIndex = 1;break;
				case NodeClass.SUBGROUP: this.tabIndex = 2;break;
				case NodeClass.CONTEXT: this.tabIndex = 3;break;
				case NodeClass.DATING: this.tabIndex = 4;break;
				default: this.tabIndex = 0;break;
			}
		}
	},
	methods: {},
	// lifecycle hooks
	beforeCreate() {},
	created() {},
	beforeMount() {},
	mounted() {},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
	destroyed() {}
}
</script>

<style scoped>
</style>