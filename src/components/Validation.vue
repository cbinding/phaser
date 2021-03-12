<template>
    <div class="m-2">
	<b-container fluid class="p-0">
		<b-row align-h="between">	
            <b-col>
				<b-button pill
					size="sm"
					variant="outline-primary"
					class="text-left shadow" 
					title="Redo validation" 
					alt="Redo validation"			
					@click.stop="validateAll()">
					<b-icon-arrow-clockwise />Redo validation</b-button>
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
						autocomplete="off"
						placeholder="filter validation records"/>					
				</b-form-group>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<b-table show-empty style="height: 600px;"
					id="datatable"
					sort-icon-left
					hover outlined selectable small 
					:no-border-collapse="false"
					sticky-header="600px" 
					select-mode="single"
					primary-key="id"
					:items="items" 
					:fields="fields"
					:filter="filter"						
					class="overflow-auto shadow-sm mb-2"
					:tbody-tr-class="rowClass"
					@row-selected="rowSelected">									
				</b-table>				
			</b-col>
		</b-row>
	</b-container>
    </div>
</template>

<script>
//import { locales } from 'moment'

export default {
	name: 'Validation',
	components: { },
	mixins: [ ],
	props: {
		name: {
			type: String,
			required: false,
			default: "Fred" 
		}		
	},
	data() {
		return {
			filter: "",
            sortBy: "data.label",
			sortDesc: false	
		}
	},
	computed: {	
		fields() {
			return [			
				{
					key: "valid",
					label: "result",
                    formatter: value => value ? "✓" : "✗",				
					sortable: true														
				},
				{
					key: "test",
					label: "test",
                    sortable: true														
				},
				{
					key: "description",
					label: "description",
					sortable: true					
				}
            ]
        },
        items() {
            return [
                { valid: true, test: "Group within phase", description: "Test 1 result" },
                { valid: true, test: "Subgroup within phase", description: "Test 2 result" },  
                { valid: false, test: "Context within phase", description: "Test 3 result" },  
                { valid: false, test: "4", description: "Test 4 result" },   
				{ valid: true, test: "5", description: "Test 5 result" },  
				{ valid: false, test: "6", description: "Test 6 result" }, 
				{ valid: true, test: "7", description: "Test 7 result" },  
				{ valid: false, test: "8", description: "Test 8 result" },  
				{ valid: false, test: "9", description: "Test 9 result" },  
				{ valid: true, test: "10", description: "Test 10 result" },                 
            ]
        }
	},
	methods: {
        validateAll() {},
        rowSelected() {},
		rowClass(item, type) {
			if (!item || type !== 'row') return
			return item.valid ? 'table-success' : 'table-danger'
      }
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
