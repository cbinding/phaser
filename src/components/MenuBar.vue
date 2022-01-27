<template>
	<b-navbar toggleable="sm" id="nav" class="border-bottom">
		<b-navbar-toggle target="nav-collapse"/>
		<b-collapse id="nav-collapse" is-nav>	
			<b-navbar-nav>		
				<b-nav-item-dropdown text="File">
					<b-dropdown-item-button  @click="clearAll">
						<b-icon-file-earmark-plus class="mr-2" />
						<span>New</span>						
					</b-dropdown-item-button>
					<b-dropdown-item-button  @click="openFileDialog">
						<b-icon-upload class="mr-2" />
						<span>Open (JSON)...</span>						
						<b-form-file plain 
							id="fileOpen" 
							style="display: none" 							
							accept=".json"                
							@input="fileLoad">
						</b-form-file>					
					</b-dropdown-item-button>
					<!--<b-dropdown-item-button v-b-modal.modalFileOpenFromURL>
						<b-icon-upload class="mr-2" />
						<span>Open from URL...</span>	
						<FileOpenFromURL />							
					</b-dropdown-item-button>-->					
					<b-dropdown-item-button @click="fileSave">
						<b-icon-download class="mr-2" />
						<span>Save (JSON)...</span>						
					</b-dropdown-item-button>					
					<b-dropdown-divider/>
					<b-dropdown-item-button v-b-modal.modalPeriodsImport>
						<b-icon-box-arrow-in-left class="mr-2" />
						<span>Import Perio.do collection...</span>	
						<PeriodsImport />							
					</b-dropdown-item-button>
					<b-dropdown-item-button v-b-modal.modalCsvImport @click="setupModal('contexts')">
						<b-icon-box-arrow-in-left class="mr-2" />
						<span>Import context stratigraphy (CSV)...</span>
						<CsvImport :mode="csvImportMode" />						
					</b-dropdown-item-button>
					<b-dropdown-item-button v-b-modal.modalCsvImport @click="setupModal('datings')">
						<b-icon-box-arrow-in-left class="mr-2" />
						<span>Import dating records (CSV)...</span>
						<!--<CsvImport :expectedFields="['identifier', 'type', 'withinContext', 'minYear', 'maxYear']" />-->						
					</b-dropdown-item-button>			
					<b-dropdown-item-button disabled>
						<b-icon-box-arrow-right class="mr-2" />
						<span>Export context stratigraphy (CSV)...</span>
					</b-dropdown-item-button>
					<b-dropdown-divider/>
					<b-dropdown-item-button @click="exportPartPNG">
						<b-icon-box-arrow-right class="mr-2" />
						<span>Export visible diagram (PNG)...</span>
					</b-dropdown-item-button>	
					<b-dropdown-item-button @click="exportFullPNG">
						<b-icon-box-arrow-right class="mr-2" />
						<span>Export full diagram (PNG)...</span>
					</b-dropdown-item-button>				
				</b-nav-item-dropdown>
				<b-nav-item-dropdown text="View">
					<b-dropdown-item-button @click="zoomIn">
						<b-icon-zoom-in class="mr-2" />
						<span>Zoom in</span>
					</b-dropdown-item-button>
					<b-dropdown-item-button @click="zoomOut">
						<b-icon-zoom-out class="mr-2" />
						<span>Zoom out</span>
					</b-dropdown-item-button>
					<b-dropdown-item-button @click="zoomFit">
						<b-icon-arrows-fullscreen class="mr-2" />
						<span>Zoom to fit</span>
					</b-dropdown-item-button>
					<b-dropdown-divider/>					
					<b-dropdown-item-button @click="redoLayout('dagre')">
						<b-icon-diagram-3 class="mr-2" />
						<span>Redo Layout</span>
					</b-dropdown-item-button>
					<!--<b-dropdown-divider/>	
					<b-dropdown-item-button v-b-modal.modalTemporalRelationships>
						<b-icon-calendar-range class="mr-2" />
						<span>Temporal Relationships...</span>
						<TemporalRelationships />
					</b-dropdown-item-button>-->
					<!--
					<b-dropdown-item-button @click="redoLayout('elk')">
						<b-icon-diagram-3 class="mr-2" />
						<span>Redo Layout (ELK)</span>
					</b-dropdown-item-button>
					<b-dropdown-item-button @click="redoLayout('klay')">
						<b-icon-diagram-3 class="mr-2" />
						<span>Redo Layout (KLAY)</span>
					</b-dropdown-item-button>
					<b-dropdown-item-button @click="redoLayout('breadthfirst')">
						<b-icon-diagram-3 class="mr-2" />
						<span>Redo Layout (BreadthFirst)</span>
					</b-dropdown-item-button>
					-->
				</b-nav-item-dropdown>
				<b-nav-item-dropdown text="Help">
					<b-dropdown-item-button v-b-modal.modalAbout>
						<b-icon-question-circle class="mr-2" />
						<span>{{ `About ${ store.getters.appName }...` }}</span>
						<HelpAbout />					
					</b-dropdown-item-button>
				</b-nav-item-dropdown>
			</b-navbar-nav>
		</b-collapse>
		<!--<b-navbar-brand href="#" id="brand" tag="h1" class="mb-0 primary">The Matrix</b-navbar-brand>-->
		<b-navbar-brand href="#" v-b-modal.modalAbout>
			<img src="phaser-spacedout-logo.png" width="94" height="25" alt="PHASER"/>
		</b-navbar-brand>
	</b-navbar>	
</template>

<script>
import { inject, ref } from '@vue/composition-api' // Vue 2 only. for Vue 3 use "from '@vue'"
import CsvImport from '@/components/CsvImport'
//import FileOpenFromURL from '@/components/FileOpenFromURL'
import PeriodsImport from '@/components/PeriodsImport'
import HelpAbout from '@/components/HelpAbout'
//import moment from 'moment'
import EventBus from '@/global/EventBus.js'
import { timestamp } from '@/global/PhaserCommon'

//npm run seeimport TemporalRelationships from '@/components/TemporalRelationships'

export default {
	components: {
		CsvImport,
		//FileOpenFromURL,
		PeriodsImport,
		HelpAbout,
		//TemporalRelationships
	},

	setup(props, context) {
		const store = inject('store')  
		// programmatically display the file dialog
		const openFileDialog = () => document.getElementById("fileOpen").click()

		const clearAll = () => {
			// todo - this works but is deprecated, needs correct syntax
			context.root.$bvModal.msgBoxConfirm('This will clear all current data, are you sure?',{
				//title: 'New file',
				size: 'sm',
				buttonSize: 'sm',
				centered: true,
				okTitle: 'Yes',
				cancelTitle: 'No',
			}).then(value => {
				if(value) { 
					store.dispatch('clearAll') 
					context.emit('diagram-clear')
				}
			})	
		}

		const csvImportMode = ref("contexts")
		const setupModal = (mode) => csvImportMode.value = mode

		const fileLoad = (file) => {
			if(!file) return
			
            const reader = new FileReader()
            reader.onload = function(e) { 
                const fileContents = JSON.parse(e.target.result)
                store.dispatch('loadMatrixData', fileContents)				
            }
            reader.readAsText(file)
		}

		const fileSave = () => {
			const data = { 
				about: store.getters.about,
				elements: {
					nodes: store.getters.nodes,
					edges: store.getters.edges
				}
			}
			// const fileName = `phaser-${ moment().format("YYYYMMDDHHmmss") }.json`
			const fileName = `phaser-${ timestamp() }.json`
            saveToFile(JSON.stringify(data), fileName)
		}

		// this function from https://forum.vuejs.org/t/saving-form-data/38714
        const saveToFile = (jsonData, fileName) => {
            let blob = new Blob([jsonData], { type: 'text/plain;charset=utf-8;' })
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, fileName)
            } else {
                let link = document.createElement('a')
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    let url = URL.createObjectURL(blob)
                    link.setAttribute('href', url)
                    link.setAttribute('download', fileName)
                    link.style.visibility = 'hidden'
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                }
            }
        }

		// event bus calls - phaser diagram component has handlers for these			
		const exportPartPNG = () => EventBus.$emit('diagram-export-part-png')			
		const exportFullPNG = () => EventBus.$emit('diagram-export-full-png')			
		const zoomIn = () => EventBus.$emit("diagram-zoom-in")	
		const zoomOut = () => EventBus.$emit('diagram-zoom-out') 		
		const zoomFit = () => EventBus.$emit('diagram-zoom-fit') 		
		const redoLayout = (name="dagre") => EventBus.$emit('diagram-redo-layout', name)
		
		return {
			setupModal,
			csvImportMode,
			openFileDialog, 
			clearAll,
			fileLoad,
			fileSave,
			saveToFile,
			exportPartPNG,
			exportFullPNG,
			zoomIn,
			zoomOut,
			zoomFit,
			redoLayout,
			store
		}
	}	
}
</script>

<style scoped>
#nav {
	background:whitesmoke;	
}
#brand {
	color: darkgray;
}
</style>