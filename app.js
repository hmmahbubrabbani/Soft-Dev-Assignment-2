const searchInput = document.getElementById('searchInput');
const searchForm = document.getElementById('searchForm');
const playerCardsContainer = document.getElementById('playerCards');
const cartList = document.getElementById('cartList');
const totalPlayersElement = document.getElementById('totalPlayers');
const playerDetailsModal = document.getElementById('playerDetailsModal');
const playerDetailsBody = document.getElementById('playerDetailsBody');
const cartLimit = 11;


let players = [];
let cartItems = [];

fetchAndDisplayPlayers();


function fetchAndDisplayPlayers() {
  fetch('https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=Danny')
    .then(response => response.json())
    .then(data => {
      console.log(data);

      players = data.player; 
      displayPlayerCards();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while fetching player data. Please try again later.');
    });
}

function searchPlayer() {
  const playerName = searchInput.value;
  fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${playerName}`)
    .then(response => response.json())
    .then(data => {
      players = data.player || [];
      displayPlayerCards();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function displayPlayerCards() {
  playerCardsContainer.innerHTML = '';
  players.forEach(player => {
    const card = document.createElement('div');
    card.classList.add('card', 'player-card', 'mb-3');
    card.innerHTML = `
      <img src="${player.strThumb || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${player.strPlayer}">
      <div class="card-body">
        <p class="card-title"><b>Name: </b>${player.strPlayer}</p>
        <p class="card-text"><b>Nationality: </b>${player.strNationality}</p>
        <p class="card-text"><b>Team: </b>${player.strTeam}</p>
        <p class="card-text"><b>Sport: </b>${player.strSport}</p>
        <p class="card-text"><b>Gender: </b>${player.strGender}</p>
        <p class="card-text"><b>Country: </b>${player.strBirthLocation}</p>
        <button class="btn btn-primary btn-sm add-to-cart" data-player-id="${player.idPlayer}" style="display: block;" >Add to Group</button>
        <button class="btn btn-primary btn-sm view-details" style="margin-top: 10px;" data-player-id="${player.idPlayer}">View Details</button>
      </div>
    `;
    card.querySelector('.add-to-cart').addEventListener('click', () => addToCart(player));
    playerCardsContainer.appendChild(card);

    const viewDetailsButton = card.querySelector('.view-details');
    viewDetailsButton.addEventListener('click', () => showPlayerDetails(player));

  });
}



function addToCart(player) {
  if (cartItems.length >= cartLimit) {
    alert(`You can only add up to ${cartLimit} players to the cart.`);
    return;
  }

  const existingIndex = cartItems.findIndex(item => item.idPlayer === player.idPlayer);
  if (existingIndex === -1) {
    cartItems.push(player);
    updateCartList();
  }
}

function updateCartList() {
  cartList.innerHTML = '';
  cartItems.forEach(item => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    listItem.textContent = item.strPlayer;
    cartList.appendChild(listItem);
  });
  totalPlayersElement.textContent = cartItems.length;
}


function showPlayerDetails(player) {
  const modalBody = document.getElementById('playerDetailsBody');
  modalBody.innerHTML = `
    <div class="row">
      <div class="col-md-4">
        <img src="${player.strThumb || 'https://via.placeholder.com/150'}" alt="${player.strPlayer}" class="img-fluid">
      </div>
      <div class="col-md-8">
        <p class="card-title"><b><b>Name: </b>${player.strPlayer}</p>
        <p class="card-text"><b>Nationality: </b>${player.strNationality}</p>
        <p class="card-text"><b>Team: </b>${player.strTeam}</p>
        <p class="card-text"><b>Sport: </b>${player.strSport}</p>
        <p class="card-text"><b>Gender: </b>${player.strGender}</p>
        <p class="card-text"><b>Birth Year: </b>${player.dateBorn}</p>
        <p class="card-text"><b>Position: </b>${player.strPosition}</p>
        <p class="card-text"><b>Salary: </b>${player.strWage}</p>
        <p class="card-text"><b>Facebook: </b>${player.strFacebook}</p>
        <p class="card-text"><b>Instagram: </b>${player.strInstagram}</p>
        <p class="card-text"><b>Description: </b>${player.strDescriptionEN?.slice(0, 60)}</p>
      </div>
    </div>
  `;

  const playerDetailsModalInstance = new bootstrap.Modal(playerDetailsModal);
  playerDetailsModalInstance.show();
}

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  searchPlayer();
});