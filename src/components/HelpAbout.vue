<template>
	<b-modal centered id="modalAbout" title="About">
		<div class="text-center">
			<img src="phaser-spacedout-logo.png" class="mb-3">
			<p>Version {{ version }}</p>				
			<p>A stratigraphic matrix editing tool</p>
			<p>Created as part of the MATRIX project</p>
			<a target="_blank" href="https://stratigraphic.github.io/matrix/">https://stratigraphic.github.io/matrix/</a>
		</div>
		<!--this removes default buttons from b-modal-->
		<template #modal-footer><div></div></template>
	</b-modal>	
</template>
<script>
import { inject } from "@vue/composition-api" // Vue 2 only. for Vue 3 use "from '@vue'"
export default {
	setup() {
		const store = inject('store')		
		//const version = context.root.$store.getters.appVersion
		const version = store.getters.appVersion
		return { version }
	}
}
</script>