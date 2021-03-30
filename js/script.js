var starterSenate = document.getElementById('senate-data')
var attenSenate = document.getElementById('senate-atten')
var loySenate = document.getElementById('senate-loyal')
var starterHouse = document.getElementById('house-data')
var attenHouse = document.getElementById('house-atten')
var loyHouse = document.getElementById('house-loyal')
//CONTROL TO KNOW WHAT DATA WE NEED TO CALL
if(starterSenate || attenSenate || loySenate){
   searchData('senate')
}else if(starterHouse || attenHouse || loyHouse){
   searchData('house')
}else{
   const btnRead = document.getElementById('btnRead')
   btnRead.addEventListener('click', function(){
      textoRead(btnRead.getAttribute('aria-expanded'))
   })
}
//FUNCTION TO FETCH DATA
function searchData(tipoDato){
   fetch(`https://api.propublica.org/congress/v1/113/${tipoDato}/members.json`,{
      headers:{
         'X-API-Key': 'vClPX6SYxjLQUsBflH1sS0QmF5hApJdCUYX4WMC5'
      }
   })
   .then(response => response.json())
   .then(data => {
      mainProgram(data.results[0].members)
   })
}
//FUNCION PARA CREAR EL OBJETO STATISTICS
function crtStat(dataRoot){
   const ingr = dataRoot
   const statistics = 
   {
      
   }
   statistics.numOfDemocrats = 0
   statistics.numOfRepublicans = 0
   statistics.numOfIndependents = 0
   statistics.avgFavPartDemocrats = 0
   statistics.avgFavPartRepublicans = 0
   statistics.avgFavPartIndependents = 0
   statistics.avgMostEngMembers = 0
   statistics.avgLeastEngMembers = 0
   statistics.avgMostLoyMembers = 0
   statistics.avgLeastLoyMembers = 0
   // CONTAR CANTIDAD DE POLÍTICOS
   var contDemo = 0
   var contRepu = 0
   var contInde = 0
   var votPartyDemo = 0
   var votPartyRepu = 0
   var votPartyIndep = 0
   for (var i = 0; i < ingr.length; i++) {
      if(ingr[i].party == 'D') {
         votPartyDemo +=  ingr[i].votes_with_party_pct
         contDemo++
      }else if (ingr[i].party == 'R') {
         votPartyRepu += ingr[i].votes_with_party_pct
         contRepu++
      }else {
         votPartyIndep += ingr[i].votes_with_party_pct
         contInde++
      }
   }
   statistics.numOfDemocrats = contDemo
   statistics.numOfRepublicans = contRepu
   statistics.numOfIndependents = contInde
   //CARGO PROMEDIO DE DATOS
   statistics.avgFavPartDemocrats = (votPartyDemo/contDemo).toFixed(2)
   statistics.avgFavPartRepublicans = (votPartyRepu/contRepu).toFixed(2)
   statistics.avgFavPartIndependents = contInde != 0 ? (votPartyIndep/contInde).toFixed(2) : 0
   //El que más falto
   //Reordeno primero el orden de la API en base a los que más faltaron
   var memPorc = Math.ceil((ingr.length) * 0.10)
   ingr.sort((a, b) => b.missed_votes_pct - a.missed_votes_pct)
   statistics.avgLeastEngMembers = ingr.slice(0, memPorc)
   //CLEANING NO REPRESENTATIVE DATA missed_votes a.total_votes - b.total_votes
   var indxIni = 0
   ingr.sort((a, b) => a.missed_votes_pct - b.missed_votes_pct)
   ingr.map( ingr => ingr.total_votes == 0 && indxIni++)
   var arrWithRepre = ingr.slice(0, (memPorc+indxIni))
   var arrClean = arrWithRepre.filter( mem => mem.total_votes != 0)
   statistics.avgMostEngMembers = arrClean.slice()
   //LOS MENOS LEALES
   ingr.sort((a,b) => b.votes_with_party_pct - a.votes_with_party_pct)
   statistics.avgMostLoyMembers = ingr.slice(0, memPorc)
   ingr.sort((a, b) => b.votes_against_party_pct - a.votes_against_party_pct)
   statistics.avgLeastLoyMembers = ingr.slice(0, memPorc)
   
   return statistics
}
//FUNCION PROGRAMA PRINCIPAL
function mainProgram(dataRoot){
   if(starterSenate || starterHouse){
      starterPage(dataRoot, starterSenate, starterHouse)
   }else if(attenSenate || attenHouse){
      attendanceMemb(dataRoot, attenSenate, attenHouse)
   }else if(loySenate || loyHouse){
      loyaltyMemb(dataRoot, loySenate, loyHouse)
   }else{
      console.log("Something gone wrong in the line 95")
   }
}
//FUNCTION TO MAKE IN THE STARTER PAGE
function starterPage(dataRoot){  
   if(starterSenate){
      createTdStarter(dataRoot, starterSenate, dataRoot.length)
   }else if(starterHouse){
      createTdStarter(dataRoot, starterHouse, dataRoot.length)
   }else{
      console.log("Something gone wrong in the line 105")
   }
}
//FUNCTION TO MAKE IN THE ATTENDANCE PAGE
function attendanceMemb(dataRoot, attenSenate, attenHouse){
   var membStati = crtStat(dataRoot)
   if(attenHouse){
      const rowPartys = document.getElementsByClassName('houGlance')

      createTdGlance(membStati.numOfRepublicans, membStati.avgFavPartRepublicans, rowPartys, 0)
      createTdGlance(membStati.numOfDemocrats, membStati.avgFavPartDemocrats, rowPartys, 1)
      createTdGlance(membStati.numOfIndependents, membStati.avgFavPartIndependents,  rowPartys, 2)

      const rowMembLeastAtt = document.getElementById('houMembLeastAtt')
      createTdMemberAtt('avgLeastEngMembers', 'missed_votes', 'missed_votes_pct', membStati.avgLeastEngMembers.length, rowMembLeastAtt, membStati)

      const rowMembMostAtt = document.getElementById('houMembMostAtt')
      createTdMemberAtt('avgMostEngMembers', 'missed_votes', 'missed_votes_pct', membStati.avgMostEngMembers.length, rowMembMostAtt, membStati)
      
   }else if(attenSenate){
      const rowPartys = document.getElementsByClassName('senGlance')

      createTdGlance(membStati.numOfRepublicans, membStati.avgFavPartRepublicans, rowPartys, 0)
      createTdGlance(membStati.numOfDemocrats, membStati.avgFavPartDemocrats, rowPartys, 1)
      createTdGlance(membStati.numOfIndependents, membStati.avgFavPartIndependents,  rowPartys, 2)

      const rowMembLeastAtt = document.getElementById('senMemLeastAtt')
      createTdMemberAtt('avgLeastEngMembers', 'missed_votes', 'missed_votes_pct', membStati.avgLeastEngMembers.length, rowMembLeastAtt, membStati)

      const rowMembMostAtt = document.getElementById('senMembMostAtt')
      createTdMemberAtt('avgMostEngMembers', 'missed_votes', 'missed_votes_pct', membStati.avgMostEngMembers.length, rowMembMostAtt, membStati)
   }else{
      console.log("Something gone wrong in the line 137")
   }
}
//FUNCTION TO MAKE IN THE LOYAL PAGE
function loyaltyMemb(dataRoot, loySenate, loyHouse){
   var membStati = crtStat(dataRoot)
   if(loyHouse){
      const rowPartys = document.getElementsByClassName('houGlance')

      createTdGlance(membStati.numOfRepublicans, membStati.avgFavPartRepublicans, rowPartys, 0)
      createTdGlance(membStati.numOfDemocrats, membStati.avgFavPartDemocrats, rowPartys, 1)
      createTdGlance(membStati.numOfIndependents, membStati.avgFavPartIndependents,  rowPartys, 2)
      
      const rowLeastLoy = document.getElementById('houMembLeastLoy')
      createTdMemberLoy('avgLeastLoyMembers', membStati.avgLeastLoyMembers.length, rowLeastLoy, membStati)

      const rowMostLoy = document.getElementById('houMembMostLoy')
      createTdMemberLoy('avgMostLoyMembers', membStati.avgMostLoyMembers.length, rowMostLoy, membStati)
   }else if(loySenate){
      const rowPartys = document.getElementsByClassName('senGlance')
      
      createTdGlance(membStati.numOfRepublicans, membStati.avgFavPartRepublicans, rowPartys, 0)
      createTdGlance(membStati.numOfDemocrats, membStati.avgFavPartDemocrats, rowPartys, 1)
      createTdGlance(membStati.numOfIndependents, membStati.avgFavPartIndependents,  rowPartys, 2)

      const rowLeastLoy = document.getElementById('senMembLeastLoy')
      createTdMemberLoy('avgLeastLoyMembers', membStati.avgLeastLoyMembers.length, rowLeastLoy, membStati)

      const rowMostLoy = document.getElementById('senMembMostLoy')
      createTdMemberLoy('avgMostLoyMembers', membStati.avgMostLoyMembers.length, rowMostLoy, membStati)
   }else{
      console.log("Something gone wrong in the line 171")
   }
}
//FUNCTION TO CREATE THE TABLE DATA FOR GLANCE
function createTdGlance(numbMemb, porcMemb, arrayData, indx){
   var data1
   var data2
   data1 = document.createElement('td')
   data1.innerHTML = numbMemb
   data2 = document.createElement('td')
   data2.innerHTML = porcMemb + ' %'
   arrayData[indx].appendChild(data1)
   arrayData[indx].appendChild(data2)
}
//FUNCTION TO CREATE THE TABLE DATA FOR ATTENDANCE
function createTdMemberAtt(tipeOfData, typeOfParameter1, typeOfParameter2, listMem, rowFather, rawData){
   var data1
   var dataA
   var data2
   var data3
   var rowMem
   for(var i = 0; i < listMem; i++){
      rowMem = document.createElement('tr')
      data1 = document.createElement('td')
      dataA = document.createElement('a')
      dataA.setAttribute('href', rawData[`${tipeOfData}`][i].url)
      dataA.setAttribute('target', '_blank')
      dataA.innerHTML = nameCheck(rawData[`${tipeOfData}`][i].first_name, rawData[`${tipeOfData}`][i].middle_name, rawData[`${tipeOfData}`][i].last_name)
      data2 = document.createElement('td')
      data2.innerHTML = rawData[`${tipeOfData}`][i][`${typeOfParameter1}`] 
      data3 = document.createElement('td')
      data3.innerHTML = (rawData[`${tipeOfData}`][i][`${typeOfParameter2}`]).toFixed(2) + ' %'

      data1.appendChild(dataA)
      rowMem.appendChild(data1)
      rowMem.appendChild(data2)
      rowMem.appendChild(data3)
      rowFather.appendChild(rowMem)
   }
}
//FUNCTION TO CREATE THE TABLE DATA FOR LOYALTY
function createTdMemberLoy(tipeOfData, listMem, rowFather, rawData){
   var data1
   var dataA
   var data2
   var data3
   var rowMem
   for(var i = 0; i < listMem; i++){
      rowMem = document.createElement('tr')
      data1 = document.createElement('td')
      dataA = document.createElement('a')
      dataA.setAttribute('href', rawData[`${tipeOfData}`][i].url)
      dataA.setAttribute('target', '_blank')

      dataA.innerHTML = nameCheck(rawData[`${tipeOfData}`][i].first_name, rawData[`${tipeOfData}`][i].middle_name, rawData[`${tipeOfData}`][i].last_name)
      data2 = document.createElement('td')
      data2.innerHTML =  Math.trunc(countOfVotes(tipeOfData, rawData[`${tipeOfData}`][i].votes_with_party_pct, rawData[`${tipeOfData}`][i].votes_against_party_pct ,rawData[`${tipeOfData}`][i].total_votes, rawData[`${tipeOfData}`][i].missed_votes))
      data3 = document.createElement('td')
      data3.innerHTML = (rawData[`${tipeOfData}`][i].votes_with_party_pct).toFixed(2) + ' %'
      
      data1.appendChild(dataA)
      rowMem.appendChild(data1)
      rowMem.appendChild(data2)
      rowMem.appendChild(data3)
      rowFather.appendChild(rowMem)
   } 
}
//FUNCTION TO KNOW WHAT TYPE OF OPERATION DO
function countOfVotes(typeOperation ,voteWithPartPct, voteAgaPartPct, votTotal, votMiss){
   if(typeOperation == 'avgMostLoyMembers'){
      return ((votTotal - votMiss) * voteWithPartPct) / 100
   }else{
      return ((votTotal - votMiss) * voteAgaPartPct) / 100
   }
}
//FUNCTION TO CREATE THE TABLE DATA FOR THE STARTER PAGES
function createTdStarter(rawData, rowFather, arrLeng){
   var data1
   var dataA
   var data2
   var data3
   var data4
   var data5
   var rowMem
   for(var i = 0; i < arrLeng; i++){
      rowMem = document.createElement('tr')
      data1 = document.createElement('td')
      dataA = document.createElement('a')
      dataA.setAttribute('href', rawData[i].url)
      dataA.setAttribute('target', '_blank')
      dataA.innerHTML = nameCheck(rawData[i].first_name, rawData[i].middle_name, rawData[i].last_name)
      data2 = document.createElement('td')
      data2.innerHTML = rawData[i].party
      data2.style.color = colorPartido(data2.innerHTML)
      data3 = document.createElement('td')
      data3.innerHTML = rawData[i].state
      data4 = document.createElement('td')
      data4.innerHTML = rawData[i].seniority
      data5 = document.createElement('td')
      data5.innerHTML = parseFloat(rawData[i].votes_with_party_pct).toFixed(2) + ' %'

      data1.appendChild(dataA)
      rowMem.appendChild(data1)
      rowMem.appendChild(data2)
      rowMem.appendChild(data3)
      rowMem.appendChild(data4)
      rowMem.appendChild(data5)
      rowFather.appendChild(rowMem)
   }
}
//FUNCTION TO VERIFY MIDDLE NAME
function nameCheck(firstName, middleName, lastName)
{
   if(middleName == null)
   {
      return firstName + ' ' + lastName
   }else{
      return firstName + ' ' + middleName + ' ' + lastName
   }
}
//CHANGE READ MORE READ LESS
function textoRead(comparador)
{
   comparador == "true" ? btnRead.innerText = "Read Less" : btnRead.innerText = "Read More"
}
//PRINT THE DATA WITYH THE COLOR OF HIS PARTY
function colorPartido(partidoActual)
{
   if(partidoActual == 'D')
   {
      return '#0015BC'
   }else if(partidoActual == 'R')
   {
      return '#FF0000'
   }
}