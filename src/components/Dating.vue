<template>
	<!--<b-tabs>        
        <b-tab title="Year range">
            <DatingYearRange
                :disabled="disabled"
                :dating="dating"
                :showTolerances="false"
                @change="datingChanged"/>	
		</b-tab>
        <b-tab title="Period">
            <DatingPeriod
                :disabled="disabled"
                :dating="dating"                
                @change="datingChanged"/>
            <DatingYearRange
                :disabled="true"
                :dating="dating"
                :showTolerances="false"/>
        </b-tab>
        <b-tab title="Probability range">
            <DatingYearRange
                :disabled="disabled"
                :dating="dating"
                @change="datingChanged"/>
        </b-tab>
	</b-tabs>-->
	<DatingYearRange
        :disabled="disabled"
        :dating="dating"
        @change="datingChanged"/>
</template>

<script>
import PhaserCommon from '@/mixins/PhaserCommon.js'
import DatingYearRange from '@/components/DatingYearRange.vue'
//import DatingPeriod from '@/components/DatingPeriod.vue'

export default {
	name: 'Dating',
	components: {
		DatingYearRange,
        //DatingPeriod
	},
	mixins: [ PhaserCommon ],
	props: {
		disabled: {
			type: Boolean,
			required: false,
			default: false			
		},
		dating: {
			type: Object,
			required: false,
			default: null
		},		
	},
	data() {
		return {
			
		}
	},
	computed: {},
	methods: {
        datingChanged(newValue){
			this.$emit('change', newValue)					
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