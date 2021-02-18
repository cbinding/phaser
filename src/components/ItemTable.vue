<template>
    <b-container fluid class="p-0">
		<b-row>			
			<b-col>
				<b-button pill
					size="sm"
					variant="outline-primary"
					class="text-left shadow" 
					:title="`add ${itemClass}`" 
					:alt="`add ${itemClass}`"			
					@click.stop="createItem()">
					<b-icon-plus />Add {{ itemClass }}</b-button>
				</b-col>
			<b-col>
				<b-form-group
					label="Filter"
					label-for="filter-input"
					label-cols-sm="3"
					label-align-sm="right"
					label-size="sm"
					class="mb-2">
					<template v-slot:label>
						<b-icon-search />
					</template>
					<b-form-input 
						size="md"
						id="filter-input"
						class="shadow-sm"
						v-model="filter"
						type="search"
						:placeholder="`filter ${itemClass}s`"/>					
				</b-form-group>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<b-table show-empty style="height: 250px;"
					id="datatable"
					sort-icon-left
					hover outlined selectable small 
					:no-border-collapse="false"
					sticky-header="300px" 
					select-mode="single"
					primary-key="id"
					:items="items" 
					:fields="fields"
					:filter="filter"						
					class="overflow-auto shadow-sm"
					@row-selected="rowSelected">
					<template #cell(actions)="row">
						<div class="text-right">															
							<b-icon-x-circle width="15" height="15"
								class="action mr-2" 
								:title="`delete ${itemClass} ${row.item.data.label}`" 
								:alt="`delete ${itemClass}`"							
								@click.stop="deleteItem(row.item)"/>		
						</div>				
					</template>					
				</b-table>
				<!--<div class="text-right">
					<b-icon-plus-circle
						class="action mr-2" 
						:title="`add ${itemClass}`" 
						:alt="`add ${itemClass}`"			
						@click.stop="createItem()"/>			
				</div>-->
			</b-col>
		</b-row>
	</b-container>
	
</template>

<script>
import PhaserCommon from '@/mixins/PhaserCommon.js'
import {NodeClass} from '@/mixins/constants.js'

export default {
	name: 'ItemTable',
	components: {},
	mixins: [ PhaserCommon ],
	props: {		
		itemClass: {
			type: String,
			required: false,
			default: NodeClass.PHASE,
			validator: value => Object.values(NodeClass).includes(value)
		}
	},
	data() { 
		return {			
			filter: "",
			selectedID: "",
			fields: [				
				/*{
					key: "data.id",
					label: "id",
					sortable: true					
				},*/
				// displaying label as if identifier
				{
					key: "data.label",
					label: "id",
					sortable: true					
				},
				... (this.itemClass == NodeClass.PHASE) ? [] : [{
					key: "data.type",
					label: "type",
					sortable: true					
				}],   
				... (this.itemClass == NodeClass.PHASE) ? [] : [{
					key: "data.parent",
					label: "within",
					sortByFormatted: true,
					formatter: this.tableParentFormatter,
					sortable: true					
                }],                
				... (this.itemClass == NodeClass.PHASE || this.itemClass == NodeClass.DATING) ? [{
					// virtual column with custom formatter
					key: 'minyear',
					label: 'entered min year',
					sortByFormatted: true,
					formatter: this.tableMinYearFormatter,
					sortable: true,
					class: "text-right"
					}] : [],
				... (this.itemClass == NodeClass.PHASE || this.itemClass == NodeClass.DATING) ? [{
					// virtual column with custom formatter
					key: 'maxyear',
					label: 'entered max year',
					sortByFormatted: true,
					formatter: this.tableMaxYearFormatter,
					sortable: true,
					class: "text-right"
					}] : [],
				... (this.itemClass != NodeClass.DATING) ? [{
					// virtual column with custom formatter
					key: 'derivedminyear',
					label: 'derived min year',
					sortByFormatted: true,
					formatter: this.derivedMinYearFormatter,
					sortable: true,
					class: "text-right"
					}] : [],
				... (this.itemClass != NodeClass.DATING) ? [{
					// virtual column with custom formatter
					key: 'derivedmaxyear',
					label: 'derived max year',
					sortByFormatted: true,
					formatter: this.derivedMaxYearFormatter,
					sortable: true,
					class: "text-right"
					}] : [],
				... (this.itemClass == NodeClass.DATING) ? [{
						key: "data.included",
						label: "included",	
						formatter: value => value ? "✓" : "✗",				
						sortable: true,
						class: "text-center"				
					}] : [],     
				/*{
					key: "data.dating.minYear",
					label: "min year",
					sortable: true
				},
				{
					key: "data.dating.maxYear",
					label: "max year",
					sortable: true
				},*/
				{ 	
					key: "actions", 
					label: ""
				}
			]		
		}
	},
	computed: {
		items() {
			switch(this.itemClass) {
				case NodeClass.PHASE:
					return this.$store.getters.phases
				case NodeClass.GROUP:
					return this.$store.getters.groups
				case NodeClass.SUBGROUP:
					return this.$store.getters.subgroups
				case NodeClass.CONTEXT:
					return this.$store.getters.contexts
				case NodeClass.FIND:
					return this.$store.getters.finds
				case NodeClass.SAMPLE:
					return this.$store.getters.samples
				case NodeClass.DATING:
					return this.$store.getters.datings
				default:
					return []
			}
		},			
		//totalRows() { return this.items.length }
	},
	mounted() {},
	methods: {				
		createItem() {
			let self = this
			switch(self.itemClass) {
				case NodeClass.PHASE: 
					self.$store.dispatch('createPhase'); break;
				case NodeClass.GROUP: 
					self.$store.dispatch('createGroup'); break;
				case NodeClass.SUBGROUP: 
					self.$store.dispatch('createSubGroup'); break;
				case NodeClass.CONTEXT: 
					self.$store.dispatch('createContext'); break;
				case NodeClass.FIND: 
					self.$store.dispatch('createFind'); break;
				case NodeClass.SAMPLE: 
					self.$store.dispatch('createSample'); break;
				case NodeClass.DATING: 
					self.$store.dispatch('createDating'); break;				
			}
		},

		updateItem(item) {
			if(item) this.$store.dispatch('updateNode', item)

		},
			
		deleteItem(item) {
			let self = this
			self.$bvModal.msgBoxConfirm(`Delete ${ this.itemClass } "${item.data.label}" - are you sure?`)
				.then(value => { 
					if(value) { 
						this.$emit('itemDeleted', item.data.id)
						self.$store.dispatch('deleteNode', item) 
					}
				})		
		},
		
		/*selectItem(item) {
			this.selectedID = item.data.id
		},*/
		
		rowSelected(items) {
			if(items.length > 0) {
				this.$emit('itemSelected', items[0])				
			}	
		},
		// display node parent as label not id
		tableParentFormatter(value, key, item) {
			return(this.$store.getters.nodeLabel(item.data.parent))
		},	
		tableMinYearFormatter(value, key, item) {
			let dating = item.data.dating
            let year = dating.minYear
            let tolv = dating.minYearTolValue 						
            let tolu = dating.minYearTolUnit
            return this.tableYearFormat(year, tolv, tolu)
        },
        tableMaxYearFormatter(value, key, item) {
			let dating = item.data.dating
            let year = dating.maxYear
            let tolv = dating.maxYearTolValue 						
            let tolu = dating.maxYearTolUnit
            return this.tableYearFormat(year, tolv, tolu)
        },
        tableYearFormat(year, tolv, tolu) {
            if(year == null || year == "")
				return ""
			else if(tolv == 0)
				return `${year}`
			else
				return `${year}±${tolv}${tolu == "years" ? "y" : "%"}`
        },
		derivedMinYearFormatter(value, key, item) { 
			return this.$store.getters.derivedDates(item.data.id).minYear 
		},
		derivedMaxYearFormatter(value, key, item) { 
			return this.$store.getters.derivedDates(item.data.id).maxYear 
		},
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

