let store = {
    user: { name: " " },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}


// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState, roverName) => {
    store = Object.assign(store, newState)
    render(root, store,roverName)
}

const render = async (root, state, selectedRover) => {
    root.innerHTML = App(state,selectedRover)
    
    document.getElementById("roverTabs").addEventListener("click", function(e) {
        if(e.target && e.target.nodeName == "LI") {
            getImageOfTheDay(e.target.id,state);
        }
    });

    document.getElementById("imgList").addEventListener("click", function(e) {
        if(e.target && e.target.nodeName == "IMG") {
            showThisPic(e.target.src);
        }
    });
}

// create content
const App = (state,selectedRover) => {
    let { rovers, apod } = state
    return `
    <header>Mars Dashboard</header>
        <main>
            <ul id="roverTabs">
                ${Tabs(rovers)}
            </ul>
            <section>
                ${roverInfos(apod,selectedRover)}
            </section>
            <section>
                <img id="expandedImg" />
                <ul id="imgList">
                ${imgList(apod,selectedRover)}
                </ul>
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
     render(root, store,"Curiosity");
})

// ------------------------------------------------------  COMPONENTS

// Create a list of rovers
const Tabs = (tab) => {
    if (tab) {
         // console.log(tab); [ "Curiosity", "Opportunity", "Spirit" ]
        const roverTabs = `
            ${tab.map(t => (`<li id="${t}">${t}</li>`)).join('')}
        `
        return roverTabs;
    }
}

// get the rover infos
const roverInfos = (apod,rover) => {
    if (!apod ) {
        getImageOfTheDay(rover,store)
    }
    let roverInfos = '';
    roverInfos += `<h2>Name of the Rover : ${apod.image.photos[0].rover.name}</h2>`;
    roverInfos += `<p>Landing date on Mars : ${apod.image.photos[0].rover.landing_date}</p>`;
    roverInfos += `<p>Launch date from Earth : ${apod.image.photos[0].rover.launch_date}</p>`;
    roverInfos += `<p>Status : ${apod.image.photos[0].rover.status}</p>`;
    return (`
        ${roverInfos}
    `)
}

// Get the list of images
const imgList = (apod,rover) => {
    if (!apod ) {
        getImageOfTheDay(rover,store)
    }

    const imgFiles = [];
    
    let nphotos = apod.image.photos.length;
    if(nphotos>=5){
        nphotos=5;
    } 
    for(let n=0; n<nphotos; n++){
        imgFiles.push(apod.image.photos[n].img_src);
    }
    const imgList = `${imgFiles.map(i => (`<li><img src="${i}" width="350" /></li>`)).join('')}`

    return imgList;
}

const showThisPic = (thisPic) => {
    const expandedImg = document.getElementById('expandedImg');
    expandedImg.src = thisPic;
}


// ------------------------------------------------------  API CALL

// Example API call
const getImageOfTheDay = (roverName,state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod/${roverName}`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }, roverName))

}

