// creatting an Immutable Map to store application state
let store = Immutable.Map({
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
})

// assigning the display div to the 'root' element
const root = document.getElementById('root')

// updating the state store
const updateStore = (state, newState) => {
    store = state.merge(newState)
    render(root, store)
}

// rendering state 
const render = async (root, state) => {
    root.innerHTML = App(state)
}

// APP: the main, Higher Order Function - returns a collection of component functions
const App = (state) => {
    const manifestInfo = store.toJS().manifest
    const featuredRover = manifestInfo.name
    return `
        <header>
            <h1>NASA's Mars Rover Data</h1>
        </header>
        <main>
                <div class="rover-name"> 
                    ${featuredRoverName(featuredRover)}
                </div>
            <section>
                <div class="manifest" id="manifest-info">
                    ${displayManifestInfo()}                
                </div>
            </section>
                <div class="gallery" id="img-gallery">
                    ${displayRoverImages()}                
                </div>
            <div class="selector-btn-outer">
                <div  class="selector-btn-container" id="img-gallery">
                    ${createRoverSelectors()}                
                </div>
            </div>
        <footer>
            Images and information made possible by: <a href="https://api.nasa.gov/">NASA's Public API</a>
        </footer>
        </main>

    `
}

// listening for load event because page should load before any JS is called
// using Math.random to choose random rover on load
window.addEventListener('load', () => {
    const randomNum = Math.floor(Math.random() * 3)
    const rovers = store.get('rovers')
    getRoverPics(rovers[randomNum])
    getRoverManifest(rovers[randomNum])
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS
// Pure function that renders a photo gallery built from the latest photos taken by the featured rover
// incorporates get, map & slice methods
const displayRoverImages = () => {
const roverGallery = store.get('roverPics')
const curatedRoverGallery = roverGallery.slice(0,9)
 if (curatedRoverGallery !== undefined) {
     return curatedRoverGallery.map(pic => {
        return (
        `<img src="${pic.toJS().img_src}" class="rover-image" height="400px" width="400px"></img>`)}).join(' ')
    } else { 
        return `
    <p>Ah, Houston. We may have had a problem...
    we can't seem to find the photos you requested...
    please standby</p>
    `
    }
}

//returns display elements with selected rover's name
const featuredRoverName = (roverName) => {
    if (roverName !== undefined) {
        return `
            <div class="h-wrapper">
                <h2>${roverName.toUpperCase()}</h2>
            </div>
        `
    }

    return `
        <p>Ah, Houston, we've had a problem...
        we can't seem to find the mission manifest for the requested rover...</p>
        <p>Please standby...or maybe try refreshing the page and starting over again...</p>
    `
}

// returns display elements with the chosen rover's manifest info
const displayManifestInfo = (roverSelection) => {
    const latestPhotoDate = store.toJS().roverPics[0].earth_date
    const manifestInfo = store.toJS().manifest
    const featuredRover = manifestInfo.name
    const landingDate = manifestInfo.landing_date
    const launchDate = manifestInfo.launch_date
    const missionStatus = manifestInfo.status
    return (
        `<div> 
            <ul> 
                <li>These photos were taken by <em><strong>${featuredRover}</strong></em> on earth date: <strong>${latestPhotoDate}</strong></li>
                <li><em><strong>${featuredRover}</strong></em>'s launch date: <strong>${launchDate}</strong></li>
                <li>Landing date: <strong>${landingDate}</strong></li>
                <li>Mission status: <strong>${missionStatus.toUpperCase()}</strong> </li>
            </ul>
     </div>`
    )
}

// calls API with selected rover as arg
const roverClicked = (rover) => {
    getRoverPics(`${rover}`)
    getRoverManifest(`${rover}`)
}

// dynamically generates rover selector buttons with the help of the map (high order array) method
const createRoverSelectors = () => {
    const rover = () => store.get('rovers') 
    return rover().map(rover => {
        return (`
            <div class="selector-btn-container">
                <button class="selector-btn" id="${rover}" value="" onclick="roverClicked('${rover}')">
                     ${rover}
                </button>
            </div> 
            `
    ) }).join('')
}

// pure functions that renders infomation requested from the backend
// ------------------------------------------------------  API CALLS

const getRoverManifest = (roverName) => {
    fetch(`http://localhost:3000/manifest/${roverName}`)
        .then(res => res.json())
        .then((manifestData) => {
            const manifestDeets = manifestData.manifestInfo.photo_manifest
            updateStore(store, { manifest: manifestDeets })
        })
    }

const getRoverPics = (roverName) => {
    fetch(`http://localhost:3000/roverPicData/${roverName}`)
        .then(res => res.json())
        .then((roverData) => {
            let roverPics = roverData.roverPicData.latest_photos
            updateStore(store, { roverPics: roverPics })
        })
    }
