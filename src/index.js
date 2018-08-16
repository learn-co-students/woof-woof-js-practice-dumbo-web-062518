const PUPPER_LINK = 'http://localhost:3000/pups'

document.addEventListener("DOMContentLoaded", () => {

  renderThePuppers()
  const filterButton = document.getElementById('good-dog-filter')
  filterButton.dataset.id = 'OFF'
  filterButton.addEventListener('click', filterFunction)

  function getThePuppers(){
    return fetch(PUPPER_LINK)
      .then(res => res.json())
  }

  function getOnePupper(pupId){
    return fetch(`${PUPPER_LINK}/${pupId}`)
      .then(res => res.json())
  }

  function updatePupper(id, obj){
    return fetch(`${PUPPER_LINK}/${id}`,{
      method: 'PATCH',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(obj)
    })
      .then(res => res.json())
  }

  function filterFunction(){
    const doggyBar = document.getElementById('dog-bar')
    doggyBar.innerText = ''
    if(filterButton.dataset.id === 'OFF'){
      filterButton.dataset.id = 'ON'
      filterButton.innerText = 'Filter good dogs: ON'
      filterPuppers()
    }else{
      filterButton.dataset.id = 'OFF'
      filterButton.innerText = 'Filter good dogs: OFF'
      renderThePuppers()
    }
  }

  function filterPuppers(){
      getThePuppers().then(puppers =>{
        const doggyBar = document.getElementById('dog-bar')
        doggyBar.innerText = ''
        puppers.forEach(pup => {
          if(pup.isGoodDog){
          const pupSpan = document.createElement('span')
          pupSpan.innerText = pup.name
          pupSpan.dataset.id = pup.id
          pupSpan.addEventListener('click', showDoggo)
          doggyBar.append(pupSpan)
        }
        })
      }
    )
  }

  function renderThePuppers(){
    getThePuppers().then(puppers =>{
      const doggyBar = document.getElementById('dog-bar')
      puppers.forEach(pup => {
        const pupSpan = document.createElement('span')
        pupSpan.innerText = pup.name
        pupSpan.dataset.id = pup.id
        pupSpan.addEventListener('click', showDoggo)
        doggyBar.append(pupSpan)
      })
    })
  }

  function showDoggo(e){
    const pupId = e.target.dataset.id
    getOnePupper(pupId).then(pup => {
      const displayPup = document.getElementById('dog-info')
      displayPup.innerText = ''
      const pupName = document.createElement('h2')
      pupName.innerText = pup.name
      const pupImg = document.createElement('img')
      pupImg.src = pup.image
      const pupButton = document.createElement('button')
      const pupLabel = document.createElement('p')
      pupButton.id = `pup-button${pup.id}`
      pupButton.dataset.id = pup.id
      pupLabel.id = `pup-label-${pup.id}`
      pupButton.addEventListener('click', toggleGoodBad)
      if(pup.isGoodDog){
        pupLabel.innerText = "Is good doggo"
        pupLabel.dataset.goodbad = `good`
        pupButton.innerText = "Bad Doggo!!!"
      }else{
        pupLabel.innerText = "Is bad doggo"
        pupLabel.dataset.goodbad = `bad`
        pupButton.innerText = "Good Doggo!!"
      }
      displayPup.append(pupName, pupImg, pupLabel, pupButton)
    })
  }

  function toggleGoodBad(e){
    const pupID = e.target.dataset.id
    const pupLabel = document.getElementById(`pup-label-${pupID}`)
    const pupButton = document.getElementById(`pup-button${pupID}`)
    if(pupLabel.dataset.goodbad === 'good'){
      pupLabel.innerText = "Is bad doggo"
      pupLabel.dataset.goodbad = `bad`
      pupButton.innerText = "Good Doggo!!"
      if(filterButton.dataset.id === 'ON'){
        filterPuppers()
      }
      updatePupper(pupID, {isGoodDog: false})
        if(filterButton.dataset.id === 'ON'){
          filterPuppers()
        }
    }else{
      pupLabel.innerText = "Is good doggo"
      pupLabel.dataset.goodbad = `good`
      pupButton.innerText = "Bad Doggo!!!"
      updatePupper(pupID, {isGoodDog: true})

    }
  }



})
