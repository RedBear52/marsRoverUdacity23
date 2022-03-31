let store = Immutable.Map({
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    featuredRover: '',
    roverPics: []
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (state, newState) => {
    store = state.merge(newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

// create content
const App = (state) => {
    const featuredRover = store.toJS().manifest.name
    // console.log(store)
    // const featuredRover = store.get('featuredRover').toJS()
    // const roverPics = store.get('roverPics').toJS()
    // let dataBase = store.toJS().manifest 
    // line above - destructure? into variables in the fetch realm and then put here?!
    // console.log(store.toJS().manifest.landing_date)
    // console.log(store.map(keys => keys))

    return `
        <header><h1>NASA's Mars Rover Data</h1></header>
        <main>
            <section>
                <div> ${featuredRoverName(featuredRover)}</div>
                <p>Here are the latest photos taken by ${store.toJS().manifest.name} on earth date: ${store.toJS().roverPics[0].earth_date}</p>
                <div>
                    ${displayRoverImages()}                
                </div>
                <p>
                    The launch date for ${store.toJS().manifest.name}'s mission was ${store.toJS().manifest.launch_date} and the landing date was ${store.toJS().manifest.landing_date}.
                </p>
                <p>
                    The status of ${store.toJS().manifest.name}'s mission is '${store.toJS().manifest.status}''.
                </p>
            
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    // const randomNum = Math.floor(Math.random() * 3)
    // getRoverManifest(store, store.get('rovers'))
    getRoverPics('Opportunity')
    getRoverManifest('Opportunity')
    render(root, store)
   
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const displayRoverImages = () => {
    const roverGallery = store.get('roverPics')
    const curatedRoverGallery = roverGallery.slice(0,9)
        if (curatedRoverGallery !== undefined) {
            return curatedRoverGallery.map(pic => {
                return (
                ` <div>
                    <img src="${pic.toJS().img_src}"></img>
                </div>
                `)
            }).join(' ') 
        } else { return `<p>Ah, Houston. We may have had a problem...
        we can't seem to find the photos you requested...please standby</p>`
    }
}

const featuredRoverName = (roverName) => {
    if (roverName) {
        return `
            <h3>Featured Rover: ${roverName}</h3>
        `
    }

    return `
        <h3>Hello!</h3>
    `
}
// Example of a pure function that renders infomation requested from the backend


// ------------------------------------------------------  API CALLS

const getRoverManifest = (roverName) => {
    fetch(`http://localhost:8000/manifest/${roverName}`)
        .then(res => res.json())
        .then((manifestData) => {
            let manifestDeets = manifestData.manifestInfo.photo_manifest
            updateStore(store, { manifest: manifestDeets })
            console.log(manifestData)
            console.log(manifestDeets)
            console.log(store.toJS())
            console.log(store.toJS().manifest.landing_date)
        })
    }

const getRoverPics = (roverName) => {
    fetch(`http://localhost:8000/roverPicData/${roverName}`)
        .then(res => res.json())
        .then((roverData) => {
            let roverPics = roverData.roverPicData.latest_photos
            updateStore(store, { roverPics: roverPics })
            console.log(roverPics)
            console.log(roverData)
            console.log(store.toJS())
        })
    }

    // const getRoverManifest = (roverName) => {
    //     const response = fetch(`http://localhost:3000/manifest/${roverName}`)
    //     const data = response.json()
    //     console.log(data)
    //     const landingDate = data.manifestInfo.photo_manifest.landing_date
    //     const launchDate = data.manifestInfo.photo_manifest.launch_date
    //     const featuredRover = data.manifestInfo.photo_manifest.name
    //     const missionStatus = data.manifestInfo.photo_manifest.status
    //     console.log(store)
    //     console.log(landingDate, launchDate, featuredRover, missionStatus)
    //     updateStore(store, {
    //         landingDate: landingDate,
    //         launchDate: launchDate,
    //         featuredRover: featuredRover,
    //         missionStatus: missionStatus
    //     }) 
    //     console.log(missionStatus)
    // }