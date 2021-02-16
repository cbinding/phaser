<template>
	<b-card no-body>
        <b-tabs card justified>   
			<b-tab title="General">
                <b-card-text>(general settings)</b-card-text>
            </b-tab>         
            <b-tab title="Phase">
                <b-card-text>(phase settings)</b-card-text>
            </b-tab>
            <b-tab title="Group">
                <b-card-text>(group settings)</b-card-text>
            </b-tab>
			<b-tab title="Sub-group">
                <b-card-text>(sub-group settings)</b-card-text>
            </b-tab>
            <b-tab title="Context">
                <b-card-text>(context settings)</b-card-text>
            </b-tab>
            <b-tab title="Connector">
                <b-card-text>(connector settings)</b-card-text>
            </b-tab>			
        </b-tabs>
    </b-card>
</template>

<script>
export default {
	name: 'Settings',
	components: { 
	},
	props: {
		name: {
			type: String,
			default: "Fred" 
		}		
	},
	data: function() {
		return {
			hello: "Hello"
		}
	},
	computed: {	
		fullMessage: function() {
			return this.hello + " " + this.name
		}
	},
	methods: { }
}
</script>

<style scoped>

</style>
