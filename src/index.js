document.addEventListener('DOMContentLoaded', init)

function init() {
  fetchDogs()
}

async function fetchDogs() {
  let data
  await fetch('http://localhost:3000/pups')
  .then( resp => resp.json() )
  .then( json => data = json )
  // console.log(data);
  displayDogs(data)
}

const displayDogs = (dogArray) => {
  const dogBar = document.getElementById('dog-bar')
  filterDogs(dogArray)

  async function changeDogStatus(id, dogStatus) {
    let data = dogStatus
    await fetch(`http://localhost:3000/pups/${id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        isGoodDog: data
      })
    })
    .then( resp => resp.json() )
  }

  function filterDogs(dogArray) {
    const yes = "Filter good dogs: ON"
    const no = "Filter good dogs: OFF"
    let newDogArray = []
    const dogFilter = document.getElementById('good-dog-filter')
    dogFilter.addEventListener("click", () => {
      if (dogFilter.textContent == "Filter good dogs: OFF"){
        newDogArray = []
        const dogBar = document.getElementById('dog-bar').innerHTML = ""
        dogFilter.innerHTML = yes
        dogArray.forEach(dog => {
          if (dog.isGoodDog === true) {
            newDogArray.push(dog)
          }
        })
        dogList(newDogArray)
      } else {
        dogFilter.innerHTML = no
        const dogBar = document.getElementById('dog-bar').innerHTML = ""

        dogList(dogArray)
      }
    })
  }

  function dogList(dogArray) {
    dogArray.forEach(dog => {
      const span = document.createElement('span')
      span.innerHTML = dog.name
      dogBar.append(span)
      span.addEventListener("click", () => {
        const dogInfo = document.getElementById('dog-info')
        dogInfo.innerHTML = ""
        const img = document.createElement('img')
        const dogName = document.createElement('H2')
        const dogButton = document.createElement('button')
        img.src = dog.image
        dogName.innerHTML = dog.name
        dog.isGoodDog ? dogButton.innerHTML = "Good Dog!" : dogButton.innerHTML = "Bad Dog!"
        dogButton.addEventListener("click", () => {
          dogButton.innerHTML === "Good Dog!" ? dogButton.innerHTML = "Bad Dog!": dogButton.innerHTML = "Good Dog!"
          dog.isGoodDog === true ? dog.isGoodDog = false : dog.isGoodDog = true
          changeDogStatus(dog.id, dog.isGoodDog)
        })
        dogInfo.append(dogName, img, dogButton)
      })
    })
  }
}
