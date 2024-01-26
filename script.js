// the pain begins...
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const pokeNameSpan = document.getElementById('pokemon-name');
const pokeIdSpan = document.getElementById('pokemon-id');
const pokeWeightSpan = document.getElementById('weight');
const pokeHeightSpan = document.getElementById('height');
const pokeImage = document.getElementById('sprite');
const pokeTypes = document.getElementById('types');
const pokeHPElement = document.getElementById('hp');
const pokeAttackElement = document.getElementById('attack');
const pokeDefenseElement = document.getElementById('defense');
const pokeSpAttackElement = document.getElementById('special-attack');
const pokeSpDefenseElement = document.getElementById('special-defense');
const pokeSpeedElement = document.getElementById('speed');
const pokeImageDir = document.getElementById('img-dir');
const pokeImageShiny = document.getElementById('img-shiny');
const pokeImageGender = document.getElementById('img-gender');

const pokeAPI = 'https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/';
let currentPokeId = 25;
const imgProps = {
    back: false,
    shiny: false,
    gender: false
}

searchButton.addEventListener('click', handleInput);
pokeImageDir.addEventListener('click', () => {
    imgProps.back = !imgProps.back;
    handleImageChange();
});
pokeImageShiny.addEventListener('click', () => {
    imgProps.shiny = !imgProps.shiny;
    handleImageChange();
});
pokeImageGender.addEventListener('click', () => {
    imgProps.gender = !imgProps.gender;
    handleImageChange();
});
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleInput();
    }
});

function handleInput() {
    const string = (searchInput.value)
                    .toLowerCase()
                    .replace(/\s/, '-');
    
    if (!string) {
        return
    }

    fetch(`https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${string}`)
        .then(res => {
            if (!res.ok) {
                throw new Error("Bad network response");
            }
            return res.json()
        })
        .then(data => {
            destructObject(data); // Have to do this since local variables are dumb sometimes
        })
        .catch(err => {
            console.error('Error: ', err);
            alert("Pokémon not found");
            return
        });
}

function destructObject(pokeObj) {
    const {name, id, height, weight, sprites: {front_default}} = pokeObj;
    let {stats, types} = pokeObj
    const pokeArr = [name, id, height, weight, front_default];
    
    stats = organizeStats(stats);
    pokeArr.push(stats);

    types = organizeTypes(types);
    pokeArr.push(types);

    updateUI(pokeArr);
    currentPokeId = id;
    handleImageChange();
}
function organizeStats(obj) {
    const arr = [];
    for (let i = 0; i < 6; i++) {
        arr.push(obj[i].base_stat);
    }
    return arr;
}

function organizeTypes(obj) {
    const arr = [];
    arr.push(obj[0].type.name);
    if (obj[1]) {
        arr.push(obj[1].type.name);
    }
    return arr;
}

function updateUI(pokeArr) {
    // Left Half
    pokeNameSpan.textContent = pokeArr[0].toUpperCase();
    pokeIdSpan.textContent = pokeArr[1];
    pokeHeightSpan.textContent = pokeArr[2];
    pokeWeightSpan.textContent = pokeArr[3];
    pokeImage.src = pokeArr[4];
    pokeImage.alt = pokeArr[0];
    
    // Stats
    pokeHPElement.textContent = pokeArr[5][0];
    pokeAttackElement.textContent = pokeArr[5][1];
    pokeDefenseElement.textContent = pokeArr[5][2];
    pokeSpAttackElement.textContent = pokeArr[5][3];
    pokeSpDefenseElement.textContent = pokeArr[5][4];
    pokeSpeedElement.textContent = pokeArr[5][5];
    
    // Types
    pokeTypes.innerHTML = `
        <span class="type ${pokeArr[6][0]}">${pokeArr[6][0].toUpperCase()}</span>
    `;
    if (pokeArr[6][1]) {
        pokeTypes.innerHTML += `
        <span class="type ${pokeArr[6][1]}">${pokeArr[6][1].toUpperCase()}</span>
    `;
    }
}

function handleImageChange() {
    let outputString = '';
    if (imgProps.back) {
        outputString += 'back/';
    }
    if (imgProps.shiny) {
        outputString += 'shiny/';
    }
    if (imgProps.gender) {
        outputString += 'female/';
    }

    

    fetch(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${outputString}${currentPokeId}.png`)
        .then(res => {
            if (res.ok) {
                pokeImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${outputString}${currentPokeId}.png`;
            }
            else {
                imgProps.back = false;
                imgProps.shiny = false;
                imgProps.gender = false;
                handleImageChange();
            }
        });
}



handleInput();