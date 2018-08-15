document.addEventListener("DOMContentLoaded", () => {
  renderPups(fetchPups())

  const filterButton = document.querySelector("#good-dog-filter")
  // filterButton.dataset.state = false

  filterButton.addEventListener("click", () => {
    // const filter = filterButton.dataset.state
    clearPups()
    renderPups(fetchPups(), filter)

    if(filter) {
      filterButton.dataset.state = false
      filterButton.innerText = "Filter good dogs: ON"
    }
    if(!filter) {
      filterButton.dataset.state = true
      filterButton.innerText = "Filter good dogs: OFF"
    }
  })
})

async function fetchPups() {
  const response = await fetch("http://localhost:3000/pups")
  return response.json()
}

async function setGoodBad(id, goodBad) {
  const body = {isGoodDog: goodBad}
  await fetch(`http://localhost:3000/pups/${id}`, {
    method: 'PATCH',
    headers: new Headers({
		    'Content-Type': 'application/json'
      }),
    body: JSON.stringify(body)
  }).then(console.log)
}

async function fetchIsGoodDog(id) {
  const response = await fetch(`http://localhost:3000/pups/${id}`)
  return response.json().then(res => res.isGoodDog)
}

class PupCard {
  constructor(obj) {
    this.id = obj.id
    this.name = obj.name
    this.isGoodDog = obj.isGoodDog
    this.image = obj.image
  }

  isGood() {
    return this.isGoodDog ? "Good Dog!" : "Bad Dog!"
  }

  toggleGoodBad(target) {
    fetchIsGoodDog(this.id).then(r => {
      r ? this.setBad(target) : this.setGood(target)
    })
  }

  setGood(target) {
    setGoodBad(this.id, true)
    target.innerText = "Good Dog!"
  }

  setBad(target) {
    setGoodBad(this.id, false)
    target.innerText = "Bad Dog!"
  }
}

function renderPups(data) {
  const filterButton = document.querySelector("#good-dog-filter")
  // const filter = filterButton.dataset.state
  console.log(filterButton.dataset.state)
  clearPups()
  if(filterButton.dataset.state) {
    data = data.then(pups => {
      return pups.filter(pup => pup.isGoodDog === true)
    })
  }

  data.then(pups => {
    const dogBar = document.querySelector('#dog-bar')
    pups.forEach(pup => {
      const span = document.createElement('span')
      span.innerText = pup.name
      span.dataset.id = pup.id
      span.onclick = () => renderPup(pup)
      dogBar.append(span)
    })
  })
}

function renderPup(pup) {
  clearPup()
  const activeCard = new PupCard(pup)

  const pupInfo = document.querySelector("#dog-info")

  const dogImg = document.createElement("img")
  dogImg.src = activeCard.image

  const dogHeader = document.createElement("h2")
  dogHeader.innerText = activeCard.name

  const dogButton = document.createElement("button")
  dogButton.innerText = activeCard.isGood()
  dogButton.onclick = (e) => activeCard.toggleGoodBad(e.target)

  pupInfo.append(dogImg, dogHeader, dogButton)
}

function clearPup() {
  const pupInfo = document.querySelector("#dog-info")
  pupInfo.innerHTML = ""
}

function clearPups() {
  const dogBar = document.querySelector("#dog-bar")
  dogBar.innerHTML = ""
}

// function toggleButtonText(btn, isGoodDog) {
//   console.log(btn.target.innerText)
//   if(isGoodDog) {
//     btn.target.innerHTML = "Bad Dog!"
//     console.log(btn.target.innerText)
//   }
//   else {
//     btn.target.innerHTML = "Good Dog!"
//     console.log(btn.target.innerText)
//   }
// }

// function toggleFilterButtonText() {
//   const filterButton = document.querySelector("#good-dog-filter")
//   const state = filterButton.dataset.state
//   if(state) {
//     filterButton.innerText = "Filter good dogs: ON"
//     filterButton.dataset.state = false
//   }
//   else {
//     filterButton.innerText = "Filter good dogs: OFF"
//     filterButton.dataset.state = true
//   }
//
// }
