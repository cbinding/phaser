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
				<b-form-group label="Identifier" label-for="itemLabel">	
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
				<ItemLookup label="Type" 
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
		<ItemLookup v-if="itemClass != 'phase'"
			label="Within" 
			:disabled="disabled"
			class="shadow-sm"
			:placeholder="`${itemClass} parent`" 
			v-model="((selectedItem || {}).data || {}).parent"  
			:options="parentLookupOptions" 
			@change="parentChanged"/>
			</b-col>
			<b-col>
				<b-form-checkbox :disabled="disabled" v-if="itemClass == 'dating'" 
					v-model="((selectedItem || {}).data || {}).included"  
					name="check-button" switch @change="includeChanged">Include in calculations</b-form-checkbox>						
			</b-col>
		</b-form-row>  	
		
		<Dating v-if="itemClass == 'dating' || itemClass == 'phase'" 
			:disabled="disabled" 
			:dating="((selectedItem || {}).data || {}).dating"
			@change="datingChanged"/>
		
		<DerivedDating v-if="itemClass !== 'dating'"
			:nodeID="((selectedItem || {}).data || {}).id"/>

        <!--<DatingYearRange v-else label="Dating"	
			:disabled="disabled"
			:dating="((selectedItem || {}).data || {}).dating"
			@change="datingChanged"/>-->	

		<Stratigraphy v-if="itemClass == 'context'" 
			:sourceID="((selectedItem || {}).data || {}).id"
			:disabled="disabled"/>

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
import DerivedDating from '@/components/DerivedDating'

export default {
	name: 'ItemEditor',
	components: {
		ItemTable,
		ItemLookup,
		//DatingYearRange,
		Stratigraphy,
		Dating,
		DerivedDating	
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
		parentLookupOptions() { 
			switch(this.itemClass) {
				case NodeClass.GROUP: return this.$store.getters.phaseOptionsGrouped
				case NodeClass.SUBGROUP: return this.$store.getters.groupOptionsGrouped
				case NodeClass.CONTEXT: return this.$store.getters.contextParentOptions			
				//case NodeClass.FIND: return this.$store.getters.contextOptionsGrouped	
				//case NodeClass.SAMPLE: return this.$store.getters.contextOptionsGrouped	
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
				//case NodeClass.FIND: return this.$store.getters.findTypeOptions
				//case NodeClass.SAMPLE: return this.$store.getters.sampleTypeOptions
				case NodeClass.DATING: return this.$store.getters.datingTypeOptions
				default: return []
			}
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
				this.selectedItem.data.include = value
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