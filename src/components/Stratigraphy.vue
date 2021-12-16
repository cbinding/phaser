<template>
<div>
    <b-form-group label="Stratigraphy">		
		<b-form-row>
			<b-col>
				<b-form-group label="Source context">
					<b-form-input text 
						:disabled="true"
						class="shadow-sm" 
						placeholder="source" 
						type="text"
						name="itemID" 
						:value="store.getters.nodeLabel(sourceID)"/>
						<!--v-model.trim="((selectedItem || {}).data || {}).id"/>-->
				</b-form-group>
			</b-col>
			<b-col>	
				<b-form-group label="Relationship">	
					<b-form-select 
						:disabled="this.disabled"
						name="edgeTypeSelector" 
						class="shadow-sm"                
						placeholder="relationship"
						v-model="selectedEdgeType"
						:options="edgeTypes.map(t => { return { value: t, text: t } })"/>
				</b-form-group>					
			</b-col>
			<b-col>
				<b-form-group label="Target context">	
					<ItemLookup
						label=""
						:disabled="disabled" 
						:optionNone="false"					
						:options="available"
						placeholder="target"
						v-model="selectedTargetID"
						@change="targetChanged"/>
				</b-form-group>	
			</b-col>
			<b-col>	
				<b-form-group label=".">			
				<b-button pill
					size="sm"
					:disabled="disabled || sourceID == ''" 
					variant="outline-primary"
					class="text-left shadow" 
					title="add" 
					alt="add"			
					@click.stop="addItem">
					<b-icon-plus />
					<span>Add relationship</span>
				</b-button>
				</b-form-group>
			</b-col>
		</b-form-row>
		<b-form-row>
			<b-col v-for="edgeType in edgeTypes" :key="edgeType"  class="border">
				<b-form-group :label="capitalize(edgeType)">					
					<ul class="list-inline d-inline-block m-1" name="lst">
						<li v-for="item in items(edgeType)" :key="item.id" class="list-inline-item">
							<b-badge
								:title="item.id"
								class="bg-white text-dark border border-secondary shadow-sm"
								:disabled="disabled">
								<!--<span>{{ $store.getters.nodeByID(item.data.target).data.label || item.data.target }}</span>-->
								<span>{{ store.getters.nodeLabel(item.data.target) }}</span>
								<b-icon-x-circle class="action ml-2" @click.stop="removeItem(item)"/>
							</b-badge>
						</li>
					</ul>					
				</b-form-group>				
			</b-col>
			<b-col></b-col>
		</b-form-row>		
	</b-form-group>
</div>
</template>

<script>
import { ref, computed, inject } from '@vue/composition-api' // Vue 2 only. for Vue 3 use "from '@vue'"
import ItemLookup from '@/components/ItemLookup'
import { capitalize } from '@/global/PhaserCommon'

export default {
	components: { ItemLookup },
	//mixins: [ PhaserCommon ],
	props: {
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		sourceID: {
			type: String,
			required: false,
			default: ""
		}
	},
	setup(props) {
		const store = inject('store')
		const edgeTypes = ["above", "below", "equal"]
		const selectedTargetID = ref("")
		const selectedEdgeType = ref("above")

		const strat = computed(() => store.getters.edgesBySource(props.sourceID)) 
		const options = computed(() => store.getters.contextOptionsGrouped)
		const available = computed(() => {
			// target IDs for strat relationships. Exclude existing targets or current source ID
			const currentTargets = strat.value.map(item => item.data?.target).concat([props.sourceID])
			const currentOptions = options.value.length > 0 ? options.value[0].options || [] : []
			return currentOptions.filter(option => !currentTargets.includes(option.value))
		})
		const items = (edgeType) => {
			switch(edgeType) {
				case "above": return strat.value.filter(e => e.data.type == "above")
				case "below": return strat.value.filter(e => e.data.type == "below") // TODO: reciprocals not showing...
				case "equal": return strat.value.filter(e => e.data.type == "equal") // TODO: no equals relationships 
				default: return []
			}
		}
		const addItem = () => {
			let edge = { 
				data: { 
					source: props.sourceID, 
					target: selectedTargetID.value,
					type: selectedEdgeType.value
				} 
			}
			store.dispatch('insertEdge', edge)
		}
		const removeItem = (item) => store.dispatch('deleteEdge', item)			
		const targetChanged = (value) => selectedTargetID.value = value
		//const capitalize = (str) => capitalize(str)

		return {
			store,
			items, 
			addItem,
			removeItem,
			edgeTypes, 
			selectedEdgeType, 
			selectedTargetID, 
			available, 
			targetChanged,
			capitalize
		}
	}
}
</script>

<style scoped>
.action { 
	cursor: pointer;
	color:dodgerblue;
}
.action:hover {
	color:red;
}
</style>