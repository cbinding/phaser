<template>
	<div class="position-relative">
        <b-card no-body v-b-toggle.legendItems 
            class="card text-secondary p-0 mx-2 mt-2 position-absolute shadow" 
            style="{ top: 0; right: 0; z-index: 100; cursor: 'pointer' }">
            <div class="card-header px-3 py-1"><b-icon-key class="mr-2"/>Key</div>
            <b-collapse id="legendItems" class="card-body m-0 px-3 py-1">               
                <b-list-group flush class="bg-light">
                    <b-list-group-item v-for="(item, index) in legendItems" :key="index" class="m-0 p-0 border-0">
                        <svg height="15" width="30">
                            <rect x="1" y="1" 
                                width="28" height="11" 
                                stroke-width="1" 
                                :fill="item.fillColor" 
                                :stroke="item.borderColor"
                                :stroke-dasharray="item.dashed ? '2 2' : ''"/>                                
                        </svg>
                        <span class="ml-1">{{item.label}}</span>
                    </b-list-group-item>
                        <!--<b-list-group-item class="m-0 p-0 border-0">
                            <svg height="15" width="25">
                                <line x1="0" y1="6" x2="25" y2="6" stroke-width="2" stroke="red" stroke-dasharray="3 2"/>                                
                            </svg>
                            <span class="ml-1">Phase</span>
                        </b-list-group-item> 
                        <b-list-group-item class="m-0 p-0 border-0">
                            <svg height="15" width="25">
                                <rect x="1" y="1" width="20" height="10" stroke-width="2" fill="honeydew" stroke="green"/>                                
                            </svg>
                            <span class="ml-1">Group</span>
                        </b-list-group-item>  
                        <b-list-group-item class="m-0 p-0 border-0">
                            <svg height="15" width="25">
                                <rect x="1" y="1" width="20" height="10" stroke-width="2" fill="aliceblue" stroke="blue"/>                                
                            </svg>
                            <span class="ml-1">Sub-Group</span>
                        </b-list-group-item> 
                        <b-list-group-item class="m-0 p-0 border-0">
                            <svg height="15" width="25">
                                <rect x="1" y="1" width="20" height="10" stroke-width="2" fill="white" stroke="black"/>                                
                            </svg>
                            <span class="ml-1">Context</span>
                        </b-list-group-item> -->
                        <!--<b-list-group-item class="m-0 p-0 border-0">
                            <svg height="15" width="25">
                                <circle cx="12" cy="7.5" r="7" stroke="red" stroke-width="1" fill="pink" />                               
                            </svg>
                            <span class="ml-1">Find</span>
                        </b-list-group-item>
                         <b-list-group-item class="m-0 p-0 border-0">
                            <svg height="15" width="25">
                                <polygon points="4,15 12,0 20,15" stroke="purple" stroke-width="1" fill="plum" />                               
                            </svg>
                            <span class="ml-1">Sample</span>
                        </b-list-group-item>-->
                </b-list-group>                    
            </b-collapse>
        </b-card>
    </div> 	
</template>

<script>

export default {
	name: 'MatrixLegend',
	components: {},
	mixins: [],
	props: {},
	data() {
        return {
            legendItems: [
                { label: "Phase", fillColor: "ivory", borderColor: "red", dashed: true },
                { label: "Group", fillColor: "honeydew", borderColor: "green" },
                { label: "Sub-Group", fillColor: "aliceblue", borderColor: "blue" },
                { label: "Context", fillColor: "white", borderColor: "black" },
                { label: "Selected", fillColor: "gold", borderColor: "black" },
            ],
        }
    },
	computed: {},
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