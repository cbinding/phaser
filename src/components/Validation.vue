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
					@click.stop="refresh()">
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
					:busy="isBusy"
					sort-icon-left
					hover outlined small 
					:no-border-collapse="true"
					sticky-header="600px" 
					select-mode="single"					
					primary-key="id"
					:items="items" 
					:fields="fields"
					:filter="filter"						
					class="overflow-auto shadow-sm mb-2"
					:tbody-tr-class="tableRowClass">
					<template #table-busy>
						<div class="text-center text-danger my-2">
							<b-spinner class="align-middle"></b-spinner>
							<strong>Validating...</strong>
						</div>
					</template>
					<template #cell(actions)="row">						
						<b-button size="sm" @click="row.toggleDetails">Details</b-button>
					</template>	
					<template #row-details="row">
						<b-card no-body>
						<b-list-group>
							<b-list-group-item v-for="(result, key) in row.item.results" 
								:key="key" 
								:variant="result.passed ? 'success': row.item.optional ? 'warning' : 'danger'">
								<span v-if="result.passed">✓</span>
								<span v-else>✗</span>
								<span class="ml-2">{{ result.description }}</span>
							</b-list-group-item>
						</b-list-group>
						</b-card>
					</template>								
				</b-table>								
			</b-col>
		</b-row>
	</b-container>
    </div>
</template>

<script>
import { ref } from '@vue/composition-api' // Vue 2 only. for Vue 3 use "from '@vue'"
import { NodeClass, rangeAfter } from "@/global/PhaserCommon.js"

export default {	
	setup(props, context) {
		const isBusy = ref(false)
		const filter = ref("")
        const sortBy = ref("test")
		const sortDesc = ref(false)
		const items = ref([])

		const fields = [			
			{
				// virtual column with custom formatter
				key: "result",
				label: "result",
                sortByFormatted: true,
				formatter: (value, key, item) => item.results.some(result => result.passed == false) ? "✗" : "✓",
				sortable: true,
				class: "text-center"														
			},
			{
				key: "testName",
				label: "description",
                sortable: true														
			},
			{
				key: "passed",
				label: "✓ passed",
				sortByFormatted: true,
				formatter: (value, key, item) => item.results.filter(r => r.passed == true).length,
                sortable: true,
				class: "text-right"														
			},
			{
				key: "failed",
				label: "✗ failed",
				sortByFormatted: true,
				formatter: (value, key, item) => item.results.filter(r => r.passed == false).length,
                sortable: true,
				class: "text-right"														
			},
			{
				// virtual column with custom formatter
				key: "total",
				label: "total",
                sortByFormatted: true,
				formatter: (value, key, item) => item.results.length,
				sortable: true,
				class: "text-right"													
			},
			{ key: 'actions', label: '' }
        ]
		
        const tableRowClass = (item, type) => {
			if (!item || type !== 'row') 
				return "table-light"
			if (item.results.length == 0) 
				return "table-light"
			if (item.results.some(result => result.passed == false)) 
				if(item.optional) return 'table-warning'
				else return 'table-danger' 
			else return 'table-success'
		}    

		const clear = () => items.value = []

        const refresh = () => { 
			isBusy.value = true
			clear()

			// run phase tests
			testPhaseContainsAtLeastOneContext()
			testPhaseDefinesDateRange()
			testPhaseAllocatedToPeriod()

			// run group tests
			testGroupContainsAtLeastOneContext()
			testGroupAllocatedToPhase()			
			testGroupAllocatedToPeriod()

			// run subgroup tests
			testSubgroupContainsAtLeastOneContext()						
			testSubgroupParentMustBeGroup()
			testSubgroupAllocatedToPhase()
			testSubgroupAllocatedToPeriod()

			// run context tests
			testContextAboveContext() 	
			testContextAllocatedToPhase()	
			testContextAllocatedToPeriod()
			testContextHasType()

			// run period tests
			testPeriodDefinesDateRange()
			isBusy.value = false
		}
			
		const testNodeDescendantIsContext = (node) => {
			let descendants = context.root.$store.getters.descendantsOfID(node?.data?.id)
			return descendants.some(node => node.data?.class == NodeClass.CONTEXT)			
		}

		const testNodeAllocatedToPhase = (node) => {
			let ancestors = context.root.$store.getters.ancestorsOfNode(node)			
			return ancestors.some(item => item.data.class == NodeClass.PHASE)		
		}

		const testNodeAllocatedToPeriod = (node) => node?.data?.period ? true : false		
				
		const testPhaseContainsAtLeastOneContext = () => {
			let test = { results: [], optional: false, testName: "Phases must contain at least one context" }
			context.root.$store.getters.phases.forEach(phase => {
				let passed = testNodeDescendantIsContext(phase)
				test.results.push({
					passed: passed,			
					description: `Phase "${phase.data.label}" ${passed ? "contains" : "does not contain"} contexts`	
				})								
			})
			items.value.push(test)				
		}

		const testPhaseDefinesDateRange = () => {
			let test = { results: [], optional: true, testName: "Phases should define a date range" }
			context.root.$store.getters.phases.forEach(phase => {
				let passed = phase.data.dating.minYear && phase.data.dating.maxYear				
				test.results.push({
					passed: passed,				
					description: `Phase "${phase.data.label}" ${passed ? "defines" : "does not define"} a date range`	
				})					
			})
			items.value.push(test)	
		}

		const testPhaseAllocatedToPeriod = () => {
			let test = { results: [], optional: true, testName: "Phases should be allocated to a period" }
			context.root.$store.getters.phases.forEach(phase => {	
				let passed = testNodeAllocatedToPeriod(phase)	
				test.results.push({
					passed: passed,				
					description: `Phase "${phase.data.label}" is ${passed ? "" : "not"} allocated to a period`		
				})				
			})
			items.value.push(test)				
		}

		const testGroupContainsAtLeastOneContext = () => {
			let test = { results: [], optional: false, testName: "Groups must contain at least one context" }
			context.root.$store.getters.groups.forEach(group => {
				let passed = testNodeDescendantIsContext(group)
				test.results.push({
					passed: passed,				
					description: `Group "${group.data.label}" ${passed ? "contains" : "does not contain"} contexts`
				})						
			})
			items.value.push(test)
		}

		const testGroupAllocatedToPhase = () => {
			let test = { results: [], optional: false, testName: "Groups must be allocated to a phase" }
			context.root.$store.getters.groups.forEach(group => {				
				let passed = testNodeAllocatedToPhase(group)	
				test.results.push({
					passed: passed,				
					description: `Group "${group.data.label}" is ${passed ? "" : "not"} allocated to a phase`
				})							
			})
			items.value.push(test)
		}

		const testGroupAllocatedToPeriod = () => {
			let test = { results: [], optional: true, testName: "Groups should be allocated to a period" }
			context.root.$store.getters.groups.forEach(group => {							
				let passed = testNodeAllocatedToPeriod(group)
				test.results.push({
					passed: passed,				
					description: `Group "${group.data.label}" is ${passed ? "" : "not"} allocated to a period`
				})						
			})
			items.value.push(test)	
		}

		const testSubgroupContainsAtLeastOneContext = () => {
			let test = { results: [], optional: false, testName: "Subgroups must contain at least one context" }
			context.root.$store.getters.subgroups.forEach(subgroup => {								
				let passed = testNodeDescendantIsContext(subgroup)
				test.results.push({
					passed: passed,				
					description: `Sub-Group "${subgroup.data.label}" ${passed ? "contains" : "does not contain"} contexts`
				})	
			})
			items.value.push(test)		
		}

		const testSubgroupParentMustBeGroup = () => {
			let test = { results: [], optional: false, testName: "Subgroups must be allocated to a group" }
			context.root.$store.getters.subgroups.forEach(subgroup => {
				let parent = context.root.$store.getters.nodeByID(subgroup.data.parent)				
				let passed = parent?.data?.class == NodeClass.GROUP
				test.results.push({
					passed: passed,				
					description: `Subgroup "${subgroup.data.label}" is ${passed ? "": "not"} allocated to a group`
				})				
			})
			items.value.push(test)			
		}

		const testSubgroupAllocatedToPhase = () => {
			let test = { results: [], optional: false, testName: "Subgroups must be allocated to a phase" }
			context.root.$store.getters.subgroups.forEach(subgroup => {								
				let passed = testNodeAllocatedToPhase(subgroup)
				test.results.push({
					passed: passed,				
					description: `Subgroup "${subgroup.data.label}" is ${passed ? "" : "not"} allocated to a phase`
				})					
			})
			items.value.push(test)
		}

		const testSubgroupAllocatedToPeriod = () => {
			let test = { results: [], optional: true, testName: "Subgroups should be allocated to a period" }
			context.root.$store.getters.subgroups.forEach(subgroup => {				
				let passed = testNodeAllocatedToPeriod(subgroup)
				test.results.push({
					passed: passed,				
					description: `Subgroup "${subgroup.data.label}" is ${passed ? "" : "not"} allocated to a period`
				})					
			})
			items.value.push(test)				
		}

		const testContextAboveContext = () => {
			let test = { results: [], optional: false, testName: "Context stratigraphy supported by dating evidence?" }
			context.root.$store.getters.edges
				.filter(edge => edge.type = "above")
				.forEach(edge => {
					let rangeA = context.root.$store.getters.derivedDates(edge.data.source)	
					let rangeB = context.root.$store.getters.derivedDates(edge.data.target)								
					let labelA = context.root.$store.getters.nodeLabel(edge.data.source)
					let labelB = context.root.$store.getters.nodeLabel(edge.data.target)
					let passed = rangeAfter(rangeA, rangeB)	
					test.results.push({
						passed: passed,				
						description: `"${labelA}" above "${labelB}" is ${passed ? "" : "not"} supported by dating evidence`
				})					
			})
			items.value.push(test)
		}

		const testContextAllocatedToPhase = () => {
			let test = { results: [], optional: false, testName: "Contexts must be allocated to a phase" }
			context.root.$store.getters.contexts.forEach(context => {				
				let passed = testNodeAllocatedToPhase(context)		
				test.results.push({
					passed: passed,				
					description: `Context "${context.data.label}" is ${passed ? "" :  "not"} allocated to a phase`
				})						
			})
			items.value.push(test)
		}

		const testContextAllocatedToPeriod = () => {
			let test = { results: [], optional: true, testName: "Contexts should be allocated to a period" }
			context.root.$store.getters.contexts.forEach(context => {				
				let passed = testNodeAllocatedToPeriod(context)
				test.results.push({
					passed: passed,				
					description: `Context "${context.data.label}" is ${passed ? "" :  "not"} allocated to period`
				})						
			})
			items.value.push(test)	
		}

		const testContextHasType = () => {
			let test = { results: [], optional: true, testName: "Contexts should have a type" }
			context.root.$store.getters.contexts.forEach(context => {				
				let passed = (context.data?.type || "").trim()  !== "" ? true : false		
				test.results.push({
					passed: passed,				
					description: `Context "${context.data.label}" ${passed ? "has" : "does not have"} a type`
				})								
			})
			items.value.push(test)	
		}

		const testPeriodDefinesDateRange = () => {
			let test = { results: [], optional: true, testName: "Periods should define a date range" }
			context.root.$store.getters.periods.forEach(period => {				
				let passed = period.data?.dating?.minYear !== null && period.data?.dating?.maxYear !== null	
				test.results.push({
					passed: passed,				
					description: `Period "${period.data.label}" does ${passed ? "" : "not"} define a date range`
				})							
			})
			items.value.push(test)
		}

		return {
			isBusy, 
			filter, 
			sortBy,
			sortDesc,
			items,
			fields,			
			tableRowClass,
			clear,
			refresh
		}
	}
}
</script>