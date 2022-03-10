<template>
    <div class="m-0 p-0">
        <b-input-group-prepend>{{ label }}</b-input-group-prepend>
        <b-input-group size="sm">
            <b-form-input number 
                min=0
                :disabled="disabled" 
                :placeholder="placeholder"
                name="yearInput" 
                type="number" 
                :value="yearDisplay"
                @input="yearChanged($event)"/>

            <b-input-group-append>
                <b-form-checkbox button 
                    button-variant="secondary"
                    size="sm"
                    :disabled="disabled"                 
                    :value="isYearBCE"                
                    @change="suffixChanged($event)">{{ isYearBCE ? "BCE" : "CE" }}</b-form-checkbox>
            </b-input-group-append>            
        </b-input-group>
    </div>   
</template>

<script>
import { computed } from '@vue/composition-api' // Vue 2 only. for Vue 3 use "from '@vue'"

export default {
	props: {
		disabled: {
            type: Boolean,
            required: false,
            default: false
        },
        label: {
            type: String,
            required: false,
			default: "Year"
        },  
        placeholder: {
            type: String,
            required: false,
			default: "year"
        },
		year: {
			type: Number,
			required: false,
			default: null
		}
	},
	setup(props, context) {        
        
        const yearDisplay = computed({
            get() { return Math.abs(props.year) },
            set(val) { yearChanged(val) }
        }) 
        
        const isYearBCE = computed({        
            get () { return props.year < 0 },
            set (val) { suffixChanged(val) }
        }) 
            
        const yearChanged = (val) => {
            context.emit('change', val * (isYearBCE.value ? -1 : 1))            
        }
        
		const suffixChanged = (val) => {
			context.emit('change', yearDisplay.value * (val ? 1 : -1))          
		}
        
		return { 
            yearDisplay, 
            isYearBCE, 
            yearChanged, 
            suffixChanged 
        }
	}
}
</script>
