import _capitalize  from "lodash/capitalize"
import _uniqueId from "lodash/uniqueId"

// useful string functions
export const capitalize = str => _capitalize(str)
export const uniqueId = str => _uniqueId(str)

// Constants for Allen temporal relationships. 
//Usage (e.g.) AllenType.BEFORE
export const AllenType = Object.freeze({
	BEFORE: "before",	
	AFTER: "after",
	MEETS: "meets",
	METBY: "metby",
	OVERLAPS: "overlaps",
	OVERLAPPEDBY: "overlappedby",
	STARTS: "starts",
	STARTEDBY: "startedby",
	FINISHES: "finishes",
	FINISHEDBY: "finishedby",
	WITHIN: "within",
	CONTAINS: "contains",
	EQUALS: "equals"
})

// Constants for stratigraphic relationships. 
// Usage (e.g.) stratType.ABOVE
export const StratType = Object.freeze({
	ABOVE: "above",	
	BELOW: "below",
	EQUAL: "equal"
})

// Constants for node class. Usage (e.g.) NodeClass.PHASE
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
export const classIs = (node, nc) => lower(node?.data?.class || "") == lower(nc)
export const isPhase = node => classIs(node, NodeClass.PHASE)
export const isGroup = node => classIs(node, NodeClass.GROUP) 
export const isSubGroup = node => classIs(node, NodeClass.SUBGROUP) 
export const isContext = node => classIs(node, NodeClass.CONTEXT)
export const isDating = node => classIs(node, NodeClass.DATING)

// check for a valid year range: {minYear: <integer>, maxYear: <integer>}
export const isValidRange = range => {
	if(!range) return false
	if(!Number.isInteger(range.minYear)) return false
	if(!Number.isInteger(range.maxYear)) return false
	return (range.minYear <= range.maxYear)
}

// check if an integer is within bounds of a given year range
export const inRange = (num, range) => {
	if(!Number.isInteger(num) || !isValidRange(range)) return false	
	return (num >= range.minYear && num <= range.maxYear)
} 

// overall year range duration
export const rangeDuration = range => {
	if(isValidRange(range))
		return (range.maxYear - range.minYear) + 1
	else
		return 0	
}

// Range A before B? (expects ranges: { minYear: <integer>, maxYear: <integer> })
export const rangeBefore = (rangeA, rangeB) => {	
	if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		return false 
	else
		return (rangeA.maxYear < rangeB.minYear)	
}

// Range A after B? (expects ranges: { minYear: <integer>, maxYear: <integer> })
export const rangeAfter = (rangeA, rangeB) => rangeBefore(rangeB, rangeA)

// Range A meets B? (expects ranges: { minYear: <integer>, maxYear: <integer> })
export const rangeMeets = (rangeA, rangeB) => {
	if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		return false 
	else
		return (rangeA.maxYear == rangeB.minYear)
}

// Range A metBy B? (expects ranges: { minYear: <integer>, maxYear: <integer> })
export const rangeMetBy = (rangeA, rangeB) => rangeMeets(rangeB, rangeA)

// Range A overlaps B? (expects ranges: { minYear: <integer>, maxYear: <integer> })
export const rangeOverlaps = (rangeA, rangeB) => {
	if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		return false 
	else
		return (rangeA.minYear < rangeB.minYear
			&& rangeA.maxYear > rangeB.minYear 
			&& rangeA.maxYear < rangeB.maxYear)	
}

// Range A overlapped by B? (expects ranges: { minYear: <integer>, maxYear: <integer> })
export const rangeOverlappedBy = (rangeA, rangeB) => rangeOverlaps(rangeB, rangeA)

// Range A starts B? (expects ranges: { minYear: <integer>, maxYear: <integer> })
export const rangeStarts = (rangeA, rangeB) => {
	if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		return false 
	else
		return (rangeA.minYear == rangeB.minYear
			&& rangeA.maxYear < rangeB.maxYear)
}

// Range A startedBy B? (expects ranges: { minYear: <integer>, maxYear: <integer> })
export const rangeStartedBy = (rangeA, rangeB) => rangeStarts(rangeB, rangeA)

// Range A during B?
export const rangeWithin = (rangeA, rangeB) => {
	if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		return false 
	else
		return (rangeA.minYear > rangeB.minYear 
			&& rangeA.maxYear < rangeB.maxYear)
}

// Range A contains B? (expects ranges: { minYear: <integer>, maxYear: <integer> })
export const rangeContains = (rangeA, rangeB) => rangeWithin(rangeB, rangeA)

// Range A finishes B? (expects ranges: { minYear: <integer>, maxYear: <integer> })
export const rangeFinishes = (rangeA, rangeB) => {
	if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		return false 
	else
		return (rangeA.maxYear == rangeB.maxYear 
			&& rangeA.minYear > rangeB.minYear)
}

// Range A finishedBy B? (expects ranges: { minYear: <integer>, maxYear: <integer> })
export const rangeFinishedBy = (rangeA, rangeB) => rangeFinishes(rangeB, rangeA)

// Range A equals B? (equals in terms of dates, not same obj reference)
// (expects ranges: { minYear: <integer>, maxYear: <integer> })
export const rangeEquals = (rangeA, rangeB) => {
	if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		return false 
	else
		return (rangeA.minYear == rangeB.minYear 
			&& rangeA.maxYear == rangeB.maxYear)
}

// Allen relationship betweeen 2 ranges (expects ranges: { minYear: <integer>, maxYear: <integer> })
export const rangeRelationship = (rangeA, rangeB) => {
	let rel = ""
		
	//if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		//rel = "none"
	if (rangeBefore(rangeA, rangeB)) 
		rel = AllenType.BEFORE
	else if (rangeAfter(rangeA, rangeB)) 
		rel = AllenType.AFTER
	else if (rangeMeets(rangeA, rangeB)) 
		rel = AllenType.MEETS
	else if (rangeMetBy(rangeA, rangeB)) 
		rel = AllenType.METBY
	else if (rangeOverlaps(rangeA, rangeB)) 
		rel = AllenType.OVERLAPS
	else if (rangeOverlappedBy(rangeA, rangeB)) 
		rel = AllenType.OVERLAPPEDBY
	else if (rangeStarts(rangeA, rangeB)) 
		rel = AllenType.STARTS
	else if (rangeStartedBy(rangeA, rangeB)) 
		rel = AllenType.STARTEDBY
	else if (rangeFinishes(rangeA, rangeB)) 
		rel = AllenType.FINISHES
	else if (rangeFinishedBy(rangeA, rangeB)) 
		rel = AllenType.FINISHEDBY
	else if (rangeWithin(rangeA, rangeB)) 
		rel = AllenType.WITHIN
	else if (rangeContains(rangeA, rangeB)) 
		rel = AllenType.CONTAINS
	else if (rangeEquals(rangeA, rangeB)) 
		rel = AllenType.EQUALS
	return rel
}