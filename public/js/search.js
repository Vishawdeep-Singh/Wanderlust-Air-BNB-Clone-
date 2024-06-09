
    // Fetch listings from the server-side using an API endpoint
// Replace this with the actual endpoint URL
const listingsEndpoint = '/api/listings';

// Fetch listings from the server
fetch(listingsEndpoint)
  .then(response => response.json())
  .then(data => {
    const destinations = data.map(listing => listing.title);
    
    function showsuggestions() {
      const searchElement = document.getElementById("Search-Input");
      const suggestBox = document.querySelector(".suggestions");
      const query = searchElement.value.toLowerCase();

      suggestBox.innerHTML = '';

      if (query.length === 0) {
        suggestBox.style.display = 'none';
        return;
      }

      const filteredDestinations = destinations.filter(destination =>
        destination.toLowerCase().includes(query)
      );

      if (filteredDestinations.length === 0) {
        suggestBox.style.display = 'none';
        return;
      }

      filteredDestinations.forEach(destination => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = destination;
        suggestionItem.onclick = () => {
          searchElement.value = destination;
          suggestBox.style.display = 'none';
        };
        suggestBox.appendChild(suggestionItem);
      });

      suggestBox.style.display = 'block';
    }

    document.addEventListener('click', function(event) {
      const suggestBox = document.querySelector('.suggestions');
      if (event.target !== document.getElementById('Search-Input')) {
        suggestBox.style.display = 'none';
      }
    });

    
  // Add event listener to the form for handling search
  document.querySelector('form[role="search"]').addEventListener("submit", handleSearch);

  // Add event listener to the input for showing suggestions
  const searchInput = document.getElementById("Search-Input");
  searchInput.addEventListener("input", showsuggestions);

async function handleSearch(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  const searchElement = document.getElementById("Search-Input");
  const query = searchElement.value.toLowerCase();

  // Fetch the listings from the API to find the ID of the matching listing
  try {
    const response = await fetch(`/api/listings?title=${query}`);
    const listings = await response.json();
    
    if (listings.length > 0) {
      // Get the ID of the first matching listing
      const listingId = listings[0]._id;

      // Redirect to the specific listing page using its ID
      window.location.href = `/listings/${listingId}`;
    } else {
      // No matching listing found, handle this scenario
      console.log("No matching listing found");
    }
  } catch (error) {
    console.error("Error searching for listings:", error);
  }
}

    
  })
  .catch(error => {
    console.error('Error fetching listings:', error);
  });

  

  