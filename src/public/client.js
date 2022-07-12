let store = {
    user: { name: " " },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState, roverName) => {
    store = Object.assign(store, newState)
    render(root, store, roverName)
}

const render = async (root, state, selectedRover) => {


    root.innerHTML = App(state,selectedRover) // Add main html structure with tabs
    
    document.getElementById("roverTabs").addEventListener("click", function(e) {
        if(e.target && e.target.nodeName == "LI") {
            getImageOfTheDay(e.target.id,state);
        }
    });

    document.getElementById("imgList").addEventListener("click", function(e) {
        if(e.target && e.target.getImageOfTheDaynodeName == "IMG") {
            showThisPic(e.target.src);
        }
    });
}

// create structure
const App = (state,selectedRover) => {
    let { rovers, apod } = state


    // var ele = [];
    // for (var i = 0; i < rovers.length; ++i) {
    //     ele[i] = imgList(apod,rovers[i]);
    //     console.log(ele[i]);
    //     console.log(rovers[i]);
    // }

    return `
    <header>Mars Dashboard</header>
        <main>
            <ul id="roverTabs">
                ${Tabs(rovers)}
                
            </ul>
            <section id="tabsContent">
                ${TabContent(state,selectedRover)}
            </section>
        </main>
        <footer></footer>
    `
}
// create Tab Content
const TabContent = (state,selectedRover) => {
    let { apod } = state
    return `
        ${roverInfos(apod,selectedRover)}
        <img id="expandedImg" />
        <ul id="imgList">
        ${imgList(apod,selectedRover)}
        </ul>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
     
    render(root, store, "Curiosity");




})

// ------------------------------------------------------  COMPONENTS
// Create a list of rovers
const Tabs = (tab) => {
    if (tab) {
        
        getListOfRovers((data) => {
             data.rovers.forEach(el => {
                tab.push(el.name)
             });
        })

        const roverList = Immutable.List(tab);
        const roverList1 = roverList.toSet().toList();
        const roverTabs = `${roverList1.map(t => (`<li id="${t}">${t}</li>`)).join('')}`
       
        return roverTabs;
    }
}



const displayInfos = (rover) => {
    console.log(rover);
    console.log(rover.name);
    console.log(rover.landing_date);
    console.log(rover.launch_date);
    console.log(rover.total_photos);

    let roverInfos = '';
    roverInfos += `<h2>Name of the Rover : ${rover.name}</h2>`;
    roverInfos += `<p>Landing date on Mars : ${rover.landing_date}</p>`;
    roverInfos += `<p>Launch date from Earth : ${rover.launch_date}</p>`;
    roverInfos += `<p>Status : ${rover.status}</p>`;
    return (`
        ${roverInfos}
    `)
}


// get the rover infos
const roverInfos = (rover) => {

    getListOfRovers((data) => {
        const found = data.rovers.find(el => el.name == rover)
        displayInfos(found);
    })
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
    // const imgList = `${imgFiles.map(i => (`<li><img src="${i}" width="350" /></li>`)).join('')}`

    return imgFiles;
}

const showThisPic = (thisPic) => {
    const expandedImg = document.getElementById('expandedImg');
    expandedImg.src = thisPic;
}


// ------------------------------------------------------  API CALL

// API call
const getImageOfTheDay = (roverName) => {

    fetch(`http://localhost:3000/apod/${roverName}`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }, roverName))
        .catch((error) => {
            console.log(error)
        });

}

const getListOfRovers = (callback) => {
    fetch('http://localhost:3000/rovers')
      .then(res => res.json())
      .then(json => callback(json))
      .catch((error) => {
          console.log(error)
      });
  }