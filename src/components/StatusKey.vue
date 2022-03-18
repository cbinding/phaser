<template>
	<span v-b-toggle="'statuskey'" class="px-1 mx-2 ext-secondary position-absolute">
        <div><b-icon-key class="mr-1"/>Key</div>
        <b-collapse id="statuskey">               
            <b-list-group>
                <b-list-group-item class="status status-valid">valid</b-list-group-item>
                <b-list-group-item class="status status-uncertain">uncertain</b-list-group-item>
                <b-list-group-item class="status status-needsmore">ambiguous</b-list-group-item>
                <b-list-group-item class="status status-invalid">contradicted</b-list-group-item>
                <b-list-group-item class="status status-unknown">lacks dates</b-list-group-item>                
            </b-list-group>
        </b-collapse>
    </span>
</template>

<style scoped>
.status {
    z-index: 5;
    padding: 0px 4px;
    margin: 0px;
    border: 1px solid lightgray;
}
/deep/ .status-valid {
    background-color: #c3e6cb;    
}
/deep/ .status-uncertain {
    background-color: orange;
}
/deep/ .status-needsmore {
    background-color: moccasin; 
}
/deep/ .status-invalid {
    background-color: #f5c6cb;
}
/deep/ .status-unknown {
    background-color: white;
}
</style>