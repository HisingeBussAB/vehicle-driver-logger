function normalizeTripData (tripData) {

  if (tripData === null || typeof tripData !== 'object') {
    return false
  }
  let i = 0
  const trips = Object.values(tripData).map(trip => {
    i++
    const result = {}
    if (trip.start !== null && typeof trip.start === 'object') {
      const starts = Object.values(trip.start)
      const startkey = (typeof starts[0] === 'object' && starts[0].timefull !== 'undefined') ? starts[0].timefull : 'Felformaterat start/slut par' + i 

      result[startkey] = {}
      result[startkey]['start'] = {}
      result[startkey]['end'] = {}
      result[startkey]['start'] = starts.map(start => start)
      if (trip.end !== null && typeof trip.end === 'object') {
        result[startkey]['end'] = Object.values(trip.end).map(trip => trip)
      }
      return result
    }
    
  //return {['Felformaterat start/slut par' + i]: trip}
  
 
  })

return trips.reverse()
}


export default normalizeTripData