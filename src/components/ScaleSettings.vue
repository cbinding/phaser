<template>    
    <b-button-group class="bg-secondary" id="scaleSettings">
        <b-button alt="Zoom out" title="Zoom out" @click="zoomOutClicked"><b-icon-zoom-out/></b-button> 
		<b-input-group v-if="showSlider"> 
			<b-form-input 
                id="scaleSlider" 
                class="bg-secondary border-0"
				type="range" 
				:value="value"
				:title="value"
				:step="valueStep" 
                :min="valueMin" 
				:max="valueMax"
                @change="setValue"
                @input="setValue"/>             				
		</b-input-group>
        <b-tooltip target="scaleSettings" triggers="hover" variant="secondary">{{ value.toFixed(1) }}</b-tooltip>	
		<b-button alt="Zoom in" title="Zoom in" @click="zoomInClicked"><b-icon-zoom-in/></b-button>	
        <b-button alt="Scale to fit" title="Scale to fit" @click="zoomFitClicked"><b-icon-arrows-fullscreen/></b-button>	
	</b-button-group>   
</template>

<script>
export default {
	name: 'ScaleSettings',
	components: {},
	props: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 10
        },
        step: {
            type: Number,
            default: 1
        },
        value: {
            type: Number,
            default: 0
        },
        showSlider: {
            type: Boolean,
            default: true
        }
    },
	data: function() {
		return {}
	},
	computed: {
        valueMin: function() {
            return parseFloat(this.min)
        },
        valueMax: function() {
            return parseFloat(this.max)
        },
        valueStep: function() {
            return parseFloat(this.step)
        }
	},
	methods: { 
		clamp: function(num, min, max) {
			const MIN = parseFloat(min) || 0.0
			const MAX = parseFloat(max) || 1.0
			const NUM = parseFloat(num) || 0.0
			return Math.min(Math.max(NUM, MIN), MAX)
        },

        fix: function(num) {
            return parseFloat(num.toFixed(1))	
        }, 

        zoomInClicked: function() {
			this.setValue(this.value + this.valueStep)
        },
        
        zoomOutClicked: function() {
			this.setValue(this.value - this.valueStep)
        },  

         zoomFitClicked: function() {
			this.$emit('scaleToFit')
		},       
		
        setValue(newValue) {
            //if(this.value != newValue) {
            let fixed = this.clamp(newValue, this.valueMin, this.valueMax)
            this.$emit('change', fixed)
            //} 
        }
	}
}
</script>

<style scoped>
</style>