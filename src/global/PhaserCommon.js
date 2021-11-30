import _capitalize  from "lodash/capitalize"
import _uniqueId from "lodash/uniqueId"

export const NodeClass = Object.freeze({
    PHASE: "phase",	
    GROUP: "group",
    SUBGROUP: "subgroup",
    CONTEXT: "context",
    //FIND: "find",
    //SAMPLE: "sample",
    DATING: "dating",
    PERIOD: "period"
})

export const getJSON = (uri, success=()=>{}, error=()=>{}) => {
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
}
        
export const capitalize = str => _capitalize(str)
export const uniqueId = str => _uniqueId(str)

export const utf8_hex = str => {
    return Array.from(str)
        .map(c => c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16).padStart(2, '0') :
            encodeURIComponent(c).replace(/%/g,'').toLowerCase())
        .join('')
}

export const hex_utf8 = hex => decodeURIComponent('%' + hex.match(/.{1,2}/g).join('%'))
        
export const str2hex = str => Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('')

// functions for validating PHASER node date ranges
export const clean = s => (s || "").toString().trim()
export const lower = s => clean(s).toLowerCase()
export const upper = s => clean(s).toUpperCase()
export const classIs = (node, nc) => lower(node?.data?.class || "") == lower(nc)
export const isPhase = node => classIs(node, NodeClass.PHASE)
export const isGroup = node => classIs(node, NodeClass.GROUP) 
export const isSubGroup = node => classIs(node, NodeClass.SUBGROUP) 
export const isContext = node => classIs(node, NodeClass.CONTEXT)
export const isDating = node => classIs(node, NodeClass.DATING)

// check for a valid dating range
export const isValidRange = range => {
	if(!range) return false
	if(!Number.isInteger(range.minYear)) return false
	if(!Number.isInteger(range.maxYear)) return false
	return (range.minYear <= range.maxYear)
}

// check if a number is within a range
export const inRange = (num, range) => {
	if(!Number.isInteger(num) || !isValidRange(range)) return false	
	return (num >= range.minYear && num <= range.maxYear)
} 

// overall duration for node (years) based on dates and tolerances
export const rangeDuration = range => {
	if(isValidRange(range))
		return (range.maxYear - range.minYear) + 1
	else
		return 0	
}

// A before B?
export const rangeBefore = (rangeA, rangeB) => {	
	if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		return false 
	else
		return (rangeA.maxYear < rangeB.minYear)	
}

// A after B?
export const rangeAfter = (rangeA, rangeB) => rangeBefore(rangeB, rangeA)

// A meets B?
export const rangeMeets = (rangeA, rangeB) => {
	if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		return false 
	else
		return (rangeA.maxYear == rangeB.minYear)
}

// A metBy B?
export const rangeMetBy = (rangeA, rangeB) => rangeMeets(rangeB, rangeA)

// A overlaps B?
export const rangeOverlaps = (rangeA, rangeB) => {
	if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		return false 
	else
		return (rangeA.minYear < rangeB.minYear
			&& rangeA.maxYear > rangeB.minYear 
			&& rangeA.maxYear < rangeB.maxYear)	
}

// A overlapped by B?
export const rangeOverlappedBy = (rangeA, rangeB) => rangeOverlaps(rangeB, rangeA)

// A starts B?
export const rangeStarts = (rangeA, rangeB) => {
	if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		return false 
	else
		return (rangeA.minYear == rangeB.minYear
			&& rangeA.maxYear < rangeB.maxYear)
}

// A startedBy B?
export const rangeStartedBy = (rangeA, rangeB) => rangeStarts(rangeB, rangeA)

// A during B?
export const rangeWithin = (rangeA, rangeB) => {
	if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		return false 
	else
		return (rangeA.minYear > rangeB.minYear 
			&& rangeA.maxYear < rangeB.maxYear)
}

// A contains B?
export const rangeContains = (rangeA, rangeB) => rangeWithin(rangeB, rangeA)

// A finishes B?
const rangeFinishes = (rangeA, rangeB) => {
	if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		return false 
	else
		return (rangeA.maxYear == rangeB.maxYear 
			&& rangeA.minYear > rangeB.minYear)
}

// A finishedBy B?
export const rangeFinishedBy = (rangeA, rangeB) => rangeFinishes(rangeB, rangeA)

// A sameAs B?
export const rangeSameAs = (rangeA, rangeB) => {
	if(!isValidRange(rangeA) || !isValidRange(rangeB)) 
		return false 
	else
		return (rangeA.minYear == rangeB.minYear 
			&& rangeA.maxYear == rangeB.maxYear)
}