let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState, roverName) => {
    store = Object.assign(store, newState)
    console.log("newState"+newState);
    render(root, store,roverName)
}

const render = async (root, state, selectedRover) => {
    root.innerHTML = App(state,selectedRover)
    
    document.getElementById("roverTabs").addEventListener("click", function(e) {
        // e.target is the clicked element!
        // If it was a list item
        if(e.target && e.target.nodeName == "LI") {
            // List item found!  Output the ID!
            getImageOfTheDay(e.target.id,state);
        }
    });
}

// create content
const App = (state,selectedRover) => {
    let { rovers, apod } = state
    return `
    <header>${Greeting(state.user.name)}</header>
        <main>
            <ul id="roverTabs">
                ${Tabs(rovers)}
            </ul>
            <section>
                ${Dashboard(apod,selectedRover)}
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

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Create a list of rovers
const Tabs = (tab) => {
    if (tab) {
        const roverTabs = `
            ${tab.map(t => (`<li id="${t}">${t}</li>`)).join('')}
        `
        
        return roverTabs;
    }
}

// Example of a pure function that renders infomation requested from the backend
const Dashboard = (apod,rover) => {
    if (!apod ) {
        getImageOfTheDay(rover,store)
    }

    let ingList ="No images today";


    ingList += `<h2>rover.name : ${apod.image.photos[0].rover.name}</h2>`;

    const nphotos = apod.image.photos.length;
    for(let n=0; n<nphotos; n++){
        ingList += `<img src="${apod.image.photos[n].img_src}" height="350px" />`;
    }

    return (`
        ${ingList}
    `)
}


// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (roverName,state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod/${roverName}`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }, roverName))

}

