import _capitalize  from 'lodash/capitalize'

const PhaserCommon = {
    data: function() {
        return {}
    }, 
    methods: {
        getJSON(uri, success=()=>{}, error=()=>{}) {
            let options = {
                method: 'GET', 
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                } 
            }
            fetch(uri, options)
                .then(response => response.json())
                .then(success)
                .catch(error)
        },
        
        capitalize(str){
			return _capitalize(str)
		}
    }
}
export default PhaserCommon
