<template>
    <b-form-group class="px-2 shadow-sm"  label="">
        <b-form-row>             
            <b-col> 
                <b-form-group 
                    valid-feedback=""
                    :invalid-feedback="validationMessage"
                    :state="validateMinYear">            
                    <b-form-group class="my-2"
                        label="Minimum (earliest) Year"
                        label-for="minYearInput">
                        <b-form-input number 
                            :disabled="disabled" 
                            placeholder="Minimum year"
                            name="minYearInput" 
                            class="shadow-sm"
                            type="number" 
                            :value="local.minYear" 
                            @change="changed('minYear', $event)"/>
                    </b-form-group>
                    <DatingYearTolerance v-if="showTolerances"
                        :disabled="disabled"
                        :tolerance-value="local.minYearTolValue" 
                        :tolerance-unit="local.minYearTolUnit"             
                        @change-value="changed('minYearTolValue', $event)"
                        @change-unit="changed('minYearTolUnit', $event)" />                                  
                </b-form-group>
            </b-col> 
            <b-col>
                <b-form-group  
                    valid-feedback=""
                    :invalid-feedback="validationMessage"
                    :state="validateMaxYear">
                    <b-form-group class="my-2"
                        label="Maximum (latest) year"
                        label-for="maxYearInput">
                        <b-form-input number 
                            :disabled="disabled"
                            placeholder="Maximum year" 
                            class="shadow-sm"
                            name="maxYearInput" 
                            type="number" 
                            :value="local.maxYear"
                            @change="changed('maxYear', $event)"/>
                    </b-form-group>
                    <DatingYearTolerance v-if="showTolerances"
                        :disabled="disabled"
                        :tolerance-value="local.maxYearTolValue" 
                        :tolerance-unit="local.maxYearTolUnit"             
                        @change-value="changed('maxYearTolValue', $event)"
                        @change-unit="changed('maxYearTolUnit', $event)" />                     
                </b-form-group>
            </b-col>       
       </b-form-row>         
    </b-form-group>
</template>

<script>
import { computed } from '@vue/composition-api' // Vue 2 only. for Vue 3 use "from '@vue'"
import DatingYearTolerance from '@/components/DatingYearTolerance.vue'

export default {	
	components: {
        DatingYearTolerance
	},	
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
        showTolerances: {
            type: Boolean,
            required: false,
            default: true
        }		
    },  	
    setup(props, context) {
        const local = computed(() => {
            return {
                minYear: Number((props.dating || {}).minYear),  
                maxYear: Number((props.dating || {}).maxYear),  
                minYearTolValue: Number((props.dating || {}).minYearTolValue),  
                maxYearTolValue: Number((props.dating || {}).maxYearTolValue),  
                minYearTolUnit: (props.dating || {}).minYearTolUnit || "years",
                maxYearTolUnit: (props.dating || {}).maxYearTolUnit || "years"
            }
        })
        const currentYear = computed(() => new Date().getFullYear())
        const validateMinYear = computed(() => {
            return (!Number.isNaN(Number(local.value.minYear)))
                && local.value.minYear <= local.value.maxYear
                && local.value.minYear <= currentYear.value
        })
        const validateMaxYear = computed(() => {
            return (!Number.isNaN(Number(local.value.maxYear)))
                && local.value.minYear <= local.value.maxYear
                && local.value.maxYear <= currentYear.value
        }) 
        const validationMessage = computed(() => {
            if(Number.isNaN(Number(local.value.minYear)))
                return "Please enter a valid year"
            if(Number.isNaN(Number(local.value.maxYear)))
                return "Please enter a valid year"
            else if(local.value.minYear > local.value.maxYear) 
                return "Min year cannot exceed max year"
            else if(local.value.minYear > currentYear.value)
                return "Min year cannot exceed current year"
            else
                return "something else wrong"
        })            
        const changed = (key, value) => {
            context.emit('change', { ...props.dating, [key]: value })
        }  
        return {
			local, 
            validateMinYear, 
            validateMaxYear,  
            validationMessage,             
            changed
        }   
    }	
}
</script>

<style scoped>
</style>
