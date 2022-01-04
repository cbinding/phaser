<template>    
    <b-container class="border p-0 bg-light" fluid id="container">
        <b-row no-gutters id="header">
            <b-col>
                <MenuBar/>
            </b-col>
        </b-row>
        <!--<b-row><b-col><DatingYearTester/></b-col></b-row>-->
        <!--<b-row no-gutters id="header">
            <b-col>
                <testStore2/>
            </b-col>
        </b-row>-->
        <!--<b-row><testMiniStore/></b-row>-->
        <vue-splitter :margin="10" :defaultPercent="60">
            <div slot="left-pane">
                <b-col>
                    <MatrixDiagramCY/>
                </b-col>
            </div>
            <div slot="right-pane">
                <ItemEditors/>
            </div>            
            <!--<slot name="left-pane">
                <b-col>
                <LayoutContent/>
                </b-col>
            </slot>
            <slot name="right-pane">
                <LayoutSidebar/>
            </slot>-->
        </vue-splitter>        
    </b-container>     
</template>

<script>
import { onMounted, inject } from '@vue/composition-api' // Vue 2 only. for Vue 3 use "from '@vue'"
import MenuBar from '@/components/MenuBar'
import ItemEditors from '@/components/ItemEditors'
import MatrixDiagramCY from '@/components/MatrixDiagramCY'
import VueSplitter from "@rmp135/vue-splitter"
//import DatingYearTester from '@/components/DatingYearTester'
//import testStore2 from '@/components/testStore2'
export default { 
    components: { 
        MenuBar,
		ItemEditors,
		MatrixDiagramCY,
		VueSplitter
        //DatingYearTester
        //testStore2
    },
	setup () {
        const store = inject('store')
		onMounted(() => document.title = `${store.getters.appName} v${store.getters.appVersion}`)

        //return { DatingYearTester }
	}       
}      
</script>

<style>
html, body {
	margin: 0;
	padding: 0;
	height: 100%; /* needed for container min-height */
	/*background-color: gray;*/	
	font-family: arial, sans-serif;
	font-size: small;
	/*color: #666;*/
}
</style>