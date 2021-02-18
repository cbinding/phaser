<template>
    <div class="m-2">
		<ItemTable :itemClass="itemClass" class="mb-2" @itemSelected="itemSelected" @itemDeleted="itemDeleted"/>
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
				<b-form-group v-if="fields.includes('label')" 
					label="Identifier" 
					label-for="itemLabel">	
					<b-form-input text 
						:disabled="disabled"
						class="shadow-sm" 
						:placeholder="`${itemClass}`" 
						type="text"
						name="itemLabel" 
						v-model.trim="((selectedItem || {}).data || {}).label" 
						@change="labelChanged"/>
				</b-form-group>
			</b-col>
			<b-col>
				<ItemLookup v-if="fields.includes('type')"
					label="Type" 
					mode="input"
					:disabled="disabled" 
					:placeholder="`${itemClass} type`" 
					v-model="((selectedItem || {}).data || {}).type" 
					:options="typeLookupOptions"
					@change="typeChanged"/>   
			</b-col>
		</b-form-row>

		<!--<ItemLookup label="In phase" 
			:disabled="disabled"
			v-model="((selectedItem || {}).data || {}).inphase"  
			:options="$store.getters.phaseLookups" 
			@change="phaseChanged"/>-->
		<b-form-row>
			<b-col>
				<ItemLookup v-if="fields.includes('parent')"
					label="Within" 
					:disabled="disabled"
					class="shadow-sm"
					:placeholder="`${itemClass} parent`" 
					v-model="((selectedItem || {}).data || {}).parent"  
					:options="parentLookupOptions" 
					@change="parentChanged"/>
			</b-col>
			<b-col>
				<b-form-group v-if="fields.includes('contains')" 
					label="Contains"				
					label-for="itemContains">
					<b-form-input
						:disabled="true"
						class="shadow-sm"
						placeholder="contains" :value="itemContains"/>
				</b-form-group>		
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
				<Dating v-if="fields.includes('dating')"  
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
		</b-form-row>

		<!--<b-form-row>	
			<b-col>		
				<DerivedDating v-if="fields.includes('derivedDating')"
					:nodeID="((selectedItem || {}).data || {}).id"/>
			</b-col>
		</b-form-row>-->

        <!--<DatingYearRange v-else label="Dating"	
			:disabled="disabled"
			:dating="((selectedItem || {}).data || {}).dating"
			@change="datingChanged"/>-->	
		<b-form-row>	
			<b-col>
				<Stratigraphy v-if="fields.includes('stratigraphy')" 
					:sourceID="((selectedItem || {}).data || {}).id"
					:disabled="disabled"/>
			</b-col>
		</b-form-row>
		<!--<div>{{ `x: ${((selectedItem || {}).position || {}).x}, y: ${((selectedItem || {}).position || {}).y}`}}</div>-->
	</div>		
</template>

<script>
import {NodeClass} from '@/mixins/constants.js'
import ItemTable from '@/components/ItemTable'
import ItemLookup from '@/components/ItemLookup'
//import DatingYearRange from '@/components/DatingYearRange'
import Stratigraphy from '@/components/Stratigraphy'
import Dating from '@/components/Dating'
//import DerivedDating from '@/components/DerivedDating'

export default {
	name: 'ItemEditor',
	components: {
		ItemTable,
		ItemLookup,
		//DatingYearRange,
		Stratigraphy,
		Dating,
		//DerivedDating	
	},
	mixins: [ ],
	props: {
		itemClass: {
			type: String,
			required: false,
			default: NodeClass.PHASE,
			validator: value => Object.values(NodeClass).includes(value) // Object.prototype.hasOwnProperty.call(NodeClass, value)			
		}
	},
	data() { 
        return { 
            selectedItem: null
        } 
    },
	computed: {
		disabled() { return this.selectedItem == null },
		fields() { // not used yet..
			switch(this.itemClass) {
				case NodeClass.PHASE: return ["label", "description", "contains", "dating"]
				case NodeClass.GROUP: return ["label", "type", "parent", "contains", "description"]
				case NodeClass.SUBGROUP: return ["label", "type", "parent", "contains", "description"]
				case NodeClass.CONTEXT: return ["label", "type", "parent", "contains", "description", "stratigraphy"]		
				case NodeClass.DATING: return ["label", "type", "parent", "description", "dating", "included"]
				default: return []				
			}			
		},
		parentLookupOptions() { 
			switch(this.itemClass) {
				case NodeClass.GROUP: return this.$store.getters.phaseOptionsGrouped
				case NodeClass.SUBGROUP: return this.$store.getters.groupOptionsGrouped
				case NodeClass.CONTEXT: return this.$store.getters.contextParentOptions			
				case NodeClass.DATING: return this.$store.getters.contextOptionsGrouped	
				default: return []				
			}			
		}, 
		typeLookupOptions() { 
			switch(this.itemClass) {
				case NodeClass.PHASE: return this.$store.getters.phaseTypeOptions
				case NodeClass.GROUP: return this.$store.getters.groupTypeOptions
				case NodeClass.SUBGROUP: return this.$store.getters.groupTypeOptions
				case NodeClass.CONTEXT: return this.$store.getters.contextTypeOptions
				case NodeClass.DATING: return this.$store.getters.datingTypeOptions
				default: return []
			}
		},
		itemContains() { 
			let id = ((this.selectedItem || {}).data || {}).id || ""
			if(id !== "")
				return this.$store.getters.childrenOfID(id).map(n => n.data.label).join(", ")
			else
				return "" 
		}
	},
	methods: {
        itemSelected(item) {
            this.selectedItem = item
			this.$store.dispatch('setSelectedID', ((this.selectedItem || {}).data || {}).id)

        },
		itemDeleted(id) {
			if(((this.selectedItem || {}).data || {}).id == id)
				this.selectedItem = null
		},
		labelChanged() {
			this.itemChanged()
		},
		descriptionChanged() {
			this.itemChanged()
		},
		/*phaseChanged(value) {
			if(this.selectedItem) {
				this.selectedItem.data.inphase = value
				this.changed()
			}
		},*/
		parentChanged(value) {
			if(this.selectedItem) {
				// new parent group for context chosen
				if(this.selectedItem.data.parent != value) {
					this.selectedItem.data.parent = value
					// comunicate this change to cytoscape diagram via event bus
					this.$root.$emit('nodeParentChanged', this.selectedItem) 
					// also flag the change to parent control
					this.itemChanged()
				}	
			}
		},		
		typeChanged(value) {
			if(this.selectedItem) {
				this.selectedItem.data.type = value
				this.itemChanged()
			}
		},
		datingChanged(dating) {	
			if(this.selectedItem) {
				this.selectedItem.data.dating = dating
				this.itemChanged()
			}
		},
		includeChanged(value) {	
			if(this.selectedItem) {
				this.selectedItem.data.included = value
				this.itemChanged()
			}
		},
		itemChanged() {
            this.$store.dispatch('updateNode', this.selectedItem)
		},	        
    },
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