<template>
    <div class="m-2">
		<ItemTable 
			:itemClass="itemClass" 
			class="mb-2" 
			@item-selected="itemSelected" 
			@item-deleted="itemDeleted"/>
		
		<b-form-row v-if="fields.includes('redolayout')">		
			<b-col style="text-align: right">
				<b-button pill
					size="sm"
					:disabled="disabled" 
					variant="outline-primary"
					class="text-left shadow" 
					title="redo layout" 
					alt="redo layout"			
					@click.stop="redoCompoundNodeLayout">
					<b-icon-diagram-3 class="mr-2" />
					<span>{{`Redo layout for this ${itemClass}`}}</span>
				</b-button>
			</b-col>			
		</b-form-row>
		<b-form-row>
			<!--<b-col>
				<b-form-group label="Identifier" label-for="itemID">	
					<b-form-input text 
						:disabled="true"
						class="shadow-sm" 
						:placeholder="`${itemClass} identifier`" 
						type="text"
						name="itemID" 
						:value="((selectedItem || {}).data || {}).id"/>						
				</b-form-group>
			</b-col>-->
			<b-col>
				<!--<b-form-group v-if="fields.includes('label')" 
					label="Identifier" 
					label-for="itemLabel">	
					<b-form-input text 
						:disabled="disabled"
						class="shadow-sm" 
						:placeholder="`${itemClass}`" 
						type="text"
						name="itemLabel"
						autocomplete="off" 
						v-model.trim="((selectedItem || {}).data || {}).label" 
						@change="labelChanged"/>
				</b-form-group>-->

				<ItemLabel v-if="fields.includes('label')" 
					:disabled="disabled" 
					:placeholder="`${itemClass}`" 
					v-model.lazy="((selectedItem || {}).data || {}).label" 
					@input="labelChanged"/>

				<ItemLabel v-if="fields.includes('uri')" 
					:disabled="disabled" 
					label="URI"
					:placeholder="`${itemClass}`" 
					v-model.lazy="((selectedItem || {}).data || {}).uri" 
					@input="uriChanged"/>

				<ItemLookup v-if="fields.includes('period')"
					label="Period" 
					:disabled="disabled"
					v-model="((selectedItem || {}).data || {}).period"  
					:options="periodOptions" 
					@change="periodChanged"/>
			
				<ItemLookup v-if="fields.includes('type')"
					label="Type" 
					mode="input"
					:disabled="disabled" 
					:placeholder="`${itemClass} type`" 
					v-model="((selectedItem || {}).data || {}).type" 
					:options="typeLookupOptions"
					@change="typeChanged"/> 

				<ItemLookup v-if="fields.includes('cud')"
					label="Construction/Use/Disuse" 
					:disabled="disabled" 
					v-model="((selectedItem || {}).data || {}).cud"
					:options="[
						{ value: 'C', text: 'construction' }, 
						{ value: 'U', text: 'use' }, 
						{ value: 'D', text: 'disuse' },
						{ value: 'CU', text: 'construction &amp; use' }, 
						{ value: 'CD', text: 'construction &amp; disuse' },
						{ value: 'UD', text: 'use &amp; disuse' },
						{ value: 'CUD', text: 'construction &amp; use &amp; disuse' }
					]" 
					@change="cudChanged"/>				
			</b-col>
			<b-col>
				<ItemLookup v-if="fields.includes('parent')"
					label="Within" 
					:disabled="disabled"
					class="shadow-sm"
					:placeholder="`${itemClass} parent`" 
					v-model="((selectedItem || {}).data || {}).parent"  
					:options="parentLookupOptions" 
					@change="parentChanged"/>	

				<ItemList v-if="fields.includes('contains')"	 			
					label="Contains" 
					:disabled="true" 
					:items="itemContains"/>
				
				<ItemList v-if="fields.includes('periodContains')"	 			
					label="Contains" 
					:disabled="true" 
					:items="periodContains"/>
			</b-col>
		</b-form-row> 

		<b-form-row>	
			<b-col>	
				<b-form-group v-if="fields.includes('description')" 
					label="Description"				
					label-for="itemDescription">	
					<b-form-textarea 
						:disabled="disabled"
						class="shadow-sm" 
						:placeholder="`${itemClass} description`" 
						rows="2"
						max-rows="2"
						name="itemDescription" 
						v-model.trim="((selectedItem || {}).data || {}).description" 
						@change="descriptionChanged"/>
				</b-form-group>
			</b-col>
		</b-form-row>

		<b-form-row>	
			<b-col>		
				<!--<DatingYearRange v-if="fields.includes('yearrange')"  
					:disabled="disabled" 
					:dating="((selectedItem || {}).data || {}).dating"
					@change="datingChanged"/>-->
				<DatingYearRange v-if="fields.includes('yearrange')"  
					:disabled="disabled" 
					:dating="((selectedItem || {}).data || {}).dating"
					@change="datingChanged"/>
				<SciDating v-if="fields.includes('scidating')"  
					:disabled="disabled" 
					:dating="((selectedItem || {}).data || {}).dating"
					@change="datingChanged"/>
			</b-col>
		</b-form-row> 

		<b-form-row>
			<b-col>
				<b-form-checkbox v-if="fields.includes('included')" 
					:disabled="disabled" 
					v-model="((selectedItem || {}).data || {}).included" 
					:value="true"
					:unchecked-value="false" 
					name="check-button" 
					switch 
					@change="includeChanged">Included in calculations</b-form-checkbox>						
			</b-col>
			<b-col>
				<b-form-group v-if="fields.includes('association')"
					label="Association"				
					label-for="itemAssociation">
					<b-form-select 
						:disabled="this.disabled"
						v-model="((selectedItem || {}).data || {}).association"
						name="itemAssociation" 
						class="shadow-sm"                
						:options="[
							{ value: 'direct', text: 'direct' }, 
							{ value: 'residual', text: 'residual' }, 
							{ value: 'intrusive', text: 'intrusive' }, 
							{ value: 'other', text: 'other' }
						]" 
						@change="associationChanged"/>
				</b-form-group>
			</b-col>	
		</b-form-row>
			
		<b-form-row>	
			<b-col>
				<Stratigraphy v-if="fields.includes('stratigraphy')" 
					:sourceID="((selectedItem || {}).data || {}).id"
					:disabled="disabled"/>
			</b-col>
		</b-form-row>

		<!--<div>{{ `[x: ${(position || {}).x}, y: ${(position || {}).y}]`}}</div>-->
	</div>		
</template>

<script>
import { ref, computed, inject } from "@vue/composition-api" // Vue 2 only. for Vue 3 use "from '@vue'"
import { NodeClass } from '@/global/PhaserCommon.js'
import ItemTable from '@/components/ItemTable'
import ItemLookup from '@/components/ItemLookup'
//import DatingYearRange from '@/components/DatingYearRange'
import Stratigraphy from '@/components/Stratigraphy'
//import DatingYearRange from '@/components/DatingYearRange'
import DatingYearRange from '@/components/DatingYearRange'
import SciDating from '@/components/SciDating'
import ItemLabel from '@/components/ItemLabel'
import ItemList from '@/components/ItemList'
import EventBus from "@/global/EventBus.js"

export default {
	name: 'ItemEditor',
	components: {
		ItemTable,
		ItemLookup,
		//DatingYearRange,
		Stratigraphy,
		//DatingYearRange,
		DatingYearRange,
		SciDating,
		ItemLabel,
		ItemList
		
	},
	props: {
		itemClass: {
			type: String,
			required: false,
			default: NodeClass.PHASE,
			validator: value => [...Object.values(NodeClass), "edge"].includes(value) 
		}
	},
	setup(props) {
		const store = inject('store')
		const selectedItem = ref(null)
		const disabled = computed(() => selectedItem.value == null)
		const position = computed(() => selectedItem?.position)
		const periodOptions = store.getters.periodOptions

		const fields = computed(() => { 
			switch(props.itemClass) {
				case NodeClass.PHASE: return ["label", "description", "contains", "containsGroups", "containsSubGroups", "containsContexts", "yearrange", "redolayout", "period"]
				case NodeClass.GROUP: return ["label", "type", "parent", "contains", "containsSubGroups", "containsContexts", "description", "redolayout", "cud", "period"]
				case NodeClass.SUBGROUP: return ["label", "type", "parent", "contains", "containsContexts", "description", "redolayout", "cud", "period"]
				case NodeClass.CONTEXT: return ["label", "type", "parent", "contains", "containsDatings", "description", "stratigraphy", "cud", "period"]	
				case NodeClass.DATING: return ["label", "type", "parent", "description", "scidating", "included", "association", "period"]
				case NodeClass.PERIOD: return ["label", "uri", "description", "periodContains", "yearrange"]
				default: return []
			}			
		})

		const parentLookupOptions = computed(() => { 
			switch(props.itemClass) {
				case NodeClass.GROUP: return store.getters.phaseOptionsGrouped
				case NodeClass.SUBGROUP: return store.getters.groupOptionsGrouped
				case NodeClass.CONTEXT: return store.getters.contextParentOptions			
				case NodeClass.DATING: return store.getters.contextOptionsGrouped	
				default: return []
			}			
		})

		const typeLookupOptions = computed(() => { 
			switch(props.itemClass) {
				case NodeClass.PHASE: return store.getters.phaseTypeOptions
				case NodeClass.GROUP: return store.getters.groupTypeOptions
				case NodeClass.SUBGROUP: return store.getters.groupTypeOptions
				case NodeClass.CONTEXT: return store.getters.contextTypeOptions
				case NodeClass.DATING: return store.getters.datingTypeOptions
				default: return []
			}
		})

		const itemContains = computed(() => {
			let id = ""			
			if(selectedItem.value)
				id = selectedItem.value.data?.id || ""
			if(id !== "")
				return store.getters.descendantsOfID(id)
					.map(n => `(${n.data.class}) ${n.data.label}`)					
			else
				return [] 
		})

		const periodContains = computed(() => { 
			let id = ""			
			if(selectedItem.value)
				id = selectedItem?.value.data?.id || ""
			if(id !== "") {
				return store.getters.nodes
					.filter(n => n.data.period == id)
					.map(n => `(${n.data.class}) ${n.data.label}`)
					//.sort((a,b) => a - b) // ensures numeric values still sorted correctly
					//.join(", ")
			}
			else
				return []
		})

		const itemSelected = (item) => {
            selectedItem.value = item
			//this.$store.dispatch('setSelectedID', ((this.selectedItem || {}).data || {}).id)
			store.dispatch('setSelectedID', selectedItem?.value.data?.id)

        }

		const itemDeleted = (id) => {
			//if(((this.selectedItem || {}).data || {}).id == id)
			if(selectedItem.value) {
				if(selectedItem.value.data.id == id)
					selectedItem.value = null
			}
		}

		const labelChanged = () => itemChanged()
		const uriChanged = () => itemChanged()
		const descriptionChanged = () => itemChanged()
		
		const redoCompoundNodeLayout = () => {
			// comunicate this to cytoscape diagram via event bus
			if(selectedItem.value) {
				EventBus.$emit('redo-compound-node-layout', selectedItem.value)
			}
		}

		const parentChanged = (value) => {
			if(selectedItem.value) {
				// new parent group for context chosen
				if(selectedItem.value.data.parent != value) {
					selectedItem.value.data.parent = value
					// comunicate this change to cytoscape diagram via event bus
					EventBus.$emit('node-parent-changed', selectedItem.value) 
					// also flag the change to parent control
					itemChanged()
				}	
			}
		}

		const typeChanged = (value) => {
			if(selectedItem.value) {
				selectedItem.value.data.type = value
				itemChanged()
			}
		}

		const datingChanged = (dating) => {	
			if(selectedItem.value) {
				selectedItem.value.data.dating = dating
				itemChanged()
			}
		}

		const includeChanged = (value) => {	
			if(selectedItem.value) {
				selectedItem.value.data.included = value
				itemChanged()
			}
		}

		const associationChanged = (value) => {	
			if(selectedItem.value) {
				selectedItem.value.data.association = value
				itemChanged()
			}
		}

		const cudChanged = (value) => {	
			if(selectedItem.value) {
				selectedItem.value.data.cud = value
				itemChanged()
			}
		}

		const periodChanged = (value) => {	
			if(selectedItem.value) {
				selectedItem.value.data.period = value
				itemChanged()
			}
		}

		const itemChanged = () => {
            store.dispatch('updateNode', selectedItem.value)
		}	     

		return { 
			selectedItem, 
			disabled, 
			position, 
			fields, 
			parentLookupOptions,
			typeLookupOptions, 
			itemContains,
			periodContains,
			periodOptions,
			itemSelected,
			itemDeleted,
			labelChanged,
			uriChanged,
			descriptionChanged,
			redoCompoundNodeLayout,
			parentChanged,
			typeChanged,
			datingChanged,
			includeChanged,
			associationChanged,
			cudChanged,
			periodChanged,
			itemChanged
		}
	}
}
</script>