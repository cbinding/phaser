<template>
	<b-form-group class="px-2 shadow-sm"  label="Derived dating">
        <b-form-row>             
            <b-col> 
                <b-form-group class="my-2"
                    label="Minimum year"
                    label-for="minYearInput">
                    <b-form-input number 
                        name="minYearInput" 
                        :disabled="true"
                        type="number" 
                        :value="Number(dating.minYear)"/> 
                </b-form-group>                           
            </b-col>            
            <b-col> 
                <b-form-group class="my-2"
                    label="Maximum year"
                    label-for="maxYearInput">
                    <b-form-input number 
                        name="maxYearInput" 
                        :disabled="true"
                        type="number" 
                        :value="Number(dating.maxYear)"/> 
                </b-form-group>     
            </b-col>
        </b-form-row>
    </b-form-group>
</template>

<script>
import PhaserCommon from '@/mixins/PhaserCommon.js'

export default {
	name: 'DerivedDating',
	components: {
		
	},
	mixins: [ PhaserCommon ],
	props: {
        nodeID: {
			type: String,
			required: false,
			default: "" 
		}		
	},
	data() { return {} },
	computed: {	
		dating() {
			return this.$store.getters.derivedDates(this.nodeID)
		}
	},
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
<!--note see https://github.com/vuejs/awesome-vue for VUE examples and resources-->