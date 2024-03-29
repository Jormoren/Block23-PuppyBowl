/***** REFERENCES *******/
const playerContainer = document.getElementById('all-players-container');
console.log(playerContainer);
const newPlayerFormContainer = document.getElementById('new-player-form');

const form = document.querySelector("form");
const playerList =document.getElementById("playerList");

// Dialog to show Player Details
const playerDialog = document.querySelector("#playerModal");
// Event Listener for closing the Dialog
playerDialog.addEventListener("click",() => {
    playerDialog.close();
});

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2308-acc-et-web-pt-a';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;


/** 
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${APIURL}/players`);
        const json = await response.json();
        //console.log(json);
        return json.data.players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};
//fetchAllPlayers();

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/players/${playerId}`);
        const result = await response.json();
        console.log(result.data.player);
        return result.data.players;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};
//fetchSinglePlayer(1082);

const addNewPlayer = async (name, breed, status, imageUrl, teamId) => {
    try {
        const response = await fetch(`${APIURL}/players`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                breed,
                status,
                imageUrl,
                teamId,
            }),
        });
        const json = await response.json();
        if (json.error) {
            throw new Error(json.message);
          }
        init();   
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/players/${playerId}`, {
            method: "DELETE",
          });
      
          init();
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};
function showDialog(player) {
    playerDialog.innerHTML = `
                <ul>
                    <li>Name: ${player.name}</li>
                    <li>Breed: ${player.breed}</li>
                    <li>TeamID: ${player.teamId}</li>
                    <li>Status: ${player.status}</li>
                    <li>ID: ${player.id}</li>
                    <li>CohortId: ${player.cohortId}</li>
                    <li>CreatedAt: ${player.createdAt}</li>
                    <li>UpdatedAt: ${player.updatedAt}</li>
                    <li>Image: <img class="dialog-img" src="${player.imageUrl}"></li>
                </ul>
                `;
                playerDialog.showModal();
}
/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (players) => {
    try {
        console.log(players);
        const playerElements = players.map((player) => {
            const playerCards = document.createElement("li");
            playerCards.innerHTML = `
            <h2>${player.name}</h2>
            <img class="puppyImg" src="${player.imageUrl}"/>
            <button class="details-button" data-name="${player.id}">See Details</button>
            <button class="delete-button" data-name="${player.id}">Remove Puppy</button>
            `;
            //eventlistener for see details in a dialog 
            playerCards.querySelector('.details-button').addEventListener("click", () => showDialog(player));
            // reference to delete button and event listener 
            playerCards.querySelector('.delete-button').addEventListener("click", () => removePlayer(player.id));

            return playerCards;
        });
        playerList.replaceChildren(...playerElements);
    
        
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
//const renderNewPlayerForm = (event) => {
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
       await addNewPlayer(
        form.playerName.value,
        form.playerBreed.value,
        form.playerStatus.value,
        form.imageUrl.value,
        form.playerTeamID.value,
       );
    
        // Clear input fields to reset form
        form.playerName.value = '';
        form.playerBreed.value = '';
        form.playerStatus.value= '';
        form.imageUrl.value = '';
        form.playerTeamID.value = '';
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
});

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
   //console.log(players);
    //renderNewPlayerForm();
}


init();
