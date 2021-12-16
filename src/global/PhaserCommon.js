import _capitalize  from "lodash/capitalize"
import _uniqueId from "lodash/uniqueId"

// useful string functions
export const capitalize = str => _capitalize(str)
export const uniqueId = str => _uniqueId(str)

// node class constants, usage: NodeClass.PHASE
export const NodeClass = Object.freeze({
    PHASE: "phase",	
    GROUP: "group",
    SUBGROUP: "subgroup",
    CONTEXT: "context",
    DATING: "dating",
    PERIOD: "period"
})

// string timestamp "YYYYMMDDTHHMMSS", used for file naming e.g. "20211225T120523"
export const timestamp = () => new Date().toISOString().replaceAll(/[:.\-Z]/g,"")

// get JSON data from a URI
export const getJSON = (uri, success=()=>{}, error=()=>{}) => {
    let defaultOptions = {
        method: 'GET', 
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        } 
    }
    fetch(uri, defaultOptions)
        .then(response => response.json())
        .then(success)
        .catch(error)
}

// used to avoid node/edge IDs containing invalid characters when built from data.id values
//export const str2hex = str => Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
export const utf8_to_hex = str => {
    return Array.from(str)
        .map(c => c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16).padStart(2, '0') :
            encodeURIComponent(c).replace(/%/g,'').toLowerCase())
        .join('')
}
// reverse of the above...
export const hex_to_utf8 = hex => decodeURIComponent('%' + hex.match(/.{1,2}/g).join('%'))
        
// parseInt without causing an error
export const tryParseInt = (value, defaultValue) => {
	//let parsedValue = parseInt(value, 10)
	//return (isNaN(parsedValue)) ? defaultValue : parsedValue
	let inputValue = clean(value)
	let outputValue = defaultValue

    if(inputValue.length > 0 && !isNaN(inputValue)) {
        outputValue = parseInt(inputValue)
    }         
    return outputValue
} 

// functions mainly used for validating PHASER node date ranges
export const clean = s => (s || "").toString().trim()
export const lower = s => clean(s).toLowerCase()
export const upper = s => clean(s).toUpperCase()
export const nodeLabel = (node, includeClass=false) => {
    if(!node) return ""
    let nodeLabel = clean(node.data?.label || node.data?.id || "")
    let nodeClass = clean(node.data?.class || "node")
    return includeClass ? `(${nodeClass}) ${nodeLabel}` : nodeLabel
}
export const classIs = (node, nc) => lower(node?.data?.class || "") == lower(nc)
export const isPhase = node => classIs(node, NodeClass.PHASE)
export const isGroup = node => classIs(node, NodeClass.GROUP) 
export const isSubGroup = node => classIs(node, NodeClass.SUBGROUP) 
export const isContext = node => classIs(node, NodeClass.CONTEXT)
export const isDating = node => classIs(node, NodeClass.DATING)

// check for a valid dating range - {minYear: <value>, maxYear: <value>}
export const isValidRange = range => {
	if(!range) return false
	if(!Number.isInteger(range.minYear)) return false
	if(!Number.isInteger(range.maxYear)) return false
	return (range.minYear <= range.maxYear)
}

// check if a number is within a given range
export const inRange = (num, range) => {
	if(!Number.isInteger(num) || !isValidRange(range)) return false	
	return (num >= range.minYear && num <= range.maxYear)
} 

// overall duration for node (years) based on dates (but not including tolerances?)
export const rangeDuration = range => {
	if(isValidRange(range))
		return (range.maxYear - range.minYear) + 1
	else
		return 0	
}

// Range A before B? (expects ranges: { minYear: <value>, maxYear: <value> })
export const rangeBefore = (rangeA, rangeB) => {	
	if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		return false 
	else
		return (rangeA.maxYear < rangeB.minYear)	
}

// Range A after B?
export const rangeAfter = (rangeA, rangeB) => rangeBefore(rangeB, rangeA)

// Range A meets B?
export const rangeMeets = (rangeA, rangeB) => {
	if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		return false 
	else
		return (rangeA.maxYear == rangeB.minYear)
}

// Range A metBy B?
export const rangeMetBy = (rangeA, rangeB) => rangeMeets(rangeB, rangeA)

// Range A overlaps B?
export const rangeOverlaps = (rangeA, rangeB) => {
	if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		return false 
	else
		return (rangeA.minYear < rangeB.minYear
			&& rangeA.maxYear > rangeB.minYear 
			&& rangeA.maxYear < rangeB.maxYear)	
}

// Range A overlapped by B?
export const rangeOverlappedBy = (rangeA, rangeB) => rangeOverlaps(rangeB, rangeA)

// Range A starts B?
export const rangeStarts = (rangeA, rangeB) => {
	if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		return false 
	else
		return (rangeA.minYear == rangeB.minYear
			&& rangeA.maxYear < rangeB.maxYear)
}

// Range A startedBy B?
export const rangeStartedBy = (rangeA, rangeB) => rangeStarts(rangeB, rangeA)

// Range A during B?
export const rangeWithin = (rangeA, rangeB) => {
	if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		return false 
	else
		return (rangeA.minYear > rangeB.minYear 
			&& rangeA.maxYear < rangeB.maxYear)
}

// Range A contains B?
export const rangeContains = (rangeA, rangeB) => rangeWithin(rangeB, rangeA)

// Range A finishes B?
const rangeFinishes = (rangeA, rangeB) => {
	if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		return false 
	else
		return (rangeA.maxYear == rangeB.maxYear 
			&& rangeA.minYear > rangeB.minYear)
}

// Range A finishedBy B?
export const rangeFinishedBy = (rangeA, rangeB) => rangeFinishes(rangeB, rangeA)

// Range A sameAs B? (sameAs in terms of dates, not same obj reference)
export const rangeSameAs = (rangeA, rangeB) => {
	if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		return false 
	else
		return (rangeA.minYear == rangeB.minYear 
			&& rangeA.maxYear == rangeB.maxYear)
}