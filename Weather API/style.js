// will load the content the second that the page is createed - will give the compare button an event listener
window.addEventListener("DOMContentLoaded", function () {
    
    document.querySelector("#compareButton").addEventListener("click", function () {
		// in charge of clearing the tables created form previous searches
		clearResults();
		
		// store all of the values needed form the html - that the user will fill out
		const city1 = document.getElementById("city_one").value;
		const state1 = document.getElementById("stateDropDown1").value;
		
		const city2 = document.getElementById("city_two").value;
		const state2 = document.getElementById("stateDropDown2").value;
	
		const error1 = document.getElementById("fieldCheck1");
		const error2 = document.getElementById("fieldCheck2");
		
		// checks whether there are value in the city section - required before any fetch commands
		if(city1 === "" && city2 === "") {
				error1.innerText = "Please Enter A City!";
				error2.innerText = "Please Enter A City!";
				return;
		} else if (city1 === "") {
				error1.innerText = "Please Enter A City!";
				return;
		} else if (city2 === "") {
				error2.innerText = "Please Enter A City!";
				return;
		}
		
		// all areas filled out then proceeds to the first fetch request
		fetch_lat_long(city1, state1);
		fetch_lat_long(city2, state2);

		// clears the "please enter a city message"
		error1.innerHTML = "";
		error2.innerHTML = "";

    });
});

// allows the url ot change in the case of fahrenheit or celsius
let url = "";


// first fetch request in charge of taking the user inputed city and state to get the lat and the lon
function fetch_lat_long(city, state) {
	// api url - build the url link to fetch request
	const location = "https://geocode.maps.co/search?q=";
	const query = city+"+"+state+"&api_key=6644fbca045ea831112631cjv998fea";
	const url = location+query;

	//sends fetch request
	fetch(url)
	.then( response => {
		// checks the response
		if (response.ok) {
			
			// if the response is ok parse the JSON
			console.log("the resposne", response);
			return response.json();
			
		}
		// error in response so throw an error
		throw new Error("No data for city");
	})
	.then (result => {
		// proceeds to send another fetch request with the following information
		console.log("the result is", result);
		fetchWeather(result[0].lat, result[0].lon, city);
		
	})
	.catch( error => {
		// if an error was caught then the type of error is printed 
		// proceeds to call function for no data
		console.log("The resulting error: ",error);
		displayNoData(city, state);

	});
}


// Fetch weather data - taking in the lat and lon form previous request 
// is in charge of fetching the weather data using the lat and lon from the previous request
function fetchWeather(lat, lon, city) {
	
	// api location
	const location = "https://api.open-meteo.com/v1/forecast?";
	
	// the query - dependent on the user selecting fahrenheit or celsius
	const query_c = "latitude="+lat+"&longitude="+lon+"&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max";
	const query_f = "latitude="+lat+"&longitude="+lon+"&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&temperature_unit=fahrenheit";
	
	// gets the value that the user selected
	const degree_choice = document.querySelector('input[type = radio]:checked').value
	
	// checks to see what url it should use
	if (degree_choice === "fahrenheit") {
		url = location+query_f;	
	} else {
		// will be default in the case that the user does not enter a degree type
		url = location+query_c;
	}


	// send the next requast to the api
	fetch(url)
	.then( response => {
		
		if (response.ok) {
			// if the response is ok parse the JSON
			console.log("the resposne", response);
			return response.json();
		}
		// error in response so throw an error
		throw new Error("No data for city");
	})
	.then (result => {
		// proceed to the fucntion that will interpret the result and display it on the website
		displayTable(result.daily, city);

	})
	.catch( error => {

		// in the case that it catches an error
		console.log("The resulting error: ",error);
		
	});
}

// display a message that there was no data found for that city for that state
function displayNoData(city, state) {
    
	// will display an error message on the website - visable to the user
	const weatherDiv = document.querySelector("#weatherCharts");
    let html = `<h2> Could not find data for ${city} in the state of ${state} </h2>`;
	weatherDiv.insertAdjacentHTML("beforeend", html);
}

// in charge of clearing the weather chart div where the tables are displayed - set up for new comparison
function clearResults() {
	// will clear the information on the tables form the previous comparison
	document.querySelector("#weatherCharts").innerHTML = "";		
}


// display the weather data for both cities - if found - inclides the max temp, min temp, rain chance, icon, day
function displayTable(weaklyWeatherData, city) {	
	
	// creates an array that contains the tyoe of inomrmation shown
	const weatherDiv = document.querySelector("#weatherCharts");
	const headerArray = ["Day", "High", "Low", "Rain", "Outlook"];
	
	// stores the information returnes by the fetch request
	const time = weaklyWeatherData.time;
	const max_temp = weaklyWeatherData.temperature_2m_max;
	const min_temp = weaklyWeatherData.temperature_2m_min;
	const rain = weaklyWeatherData.precipitation_probability_max;
	const code = weaklyWeatherData.weather_code;
	
	// starts building the table
	let html = "<h3>Five Day Forcast</h3>" ;
	html += "<table>";

	// gives the table the name of the city
	html += `<caption class="cityLabel">${city}</caption>`;
    
	// adds the first array containing information type
	html += `<tr><th>${headerArray[0]}</th>`;
	
	// adds the day of the week for weather info
	for (let j = 0; j < 5; j++) {
		let datestr = time[j];
		let theDate = new Date(datestr);
		let dayWeek = theDate.toLocaleDateString("en-US", {weekday: "short", timeZone: "UTC"});
		html += `<td>${dayWeek}</td>`;
	}
	html += `<tr><th>${headerArray[1]}</th>`;
	
	// adds the array of the maximum temperature 
	for (let j = 0; j < 5; j++) {
		html += `<td>${max_temp[j]}</td>`;
	}

	html += `<tr><th>${headerArray[2]}</th>`;
	// adds the array of the minimum temperature
	for (let j = 0; j < 5; j++) {
		html += `<td>${min_temp[j]}</td>`;
	}
	
	html += `<tr><th>${headerArray[3]}</th>`;
	// adds the percipitation information
	for (let j = 0; j < 5; j++) {
		html += `<td>${rain[j]}%</td>`;
	}
	html += `<tr><th>${headerArray[4]}</th>`;
	
	// is in charge of displaying the weather icons
	for (let j = 0; j < 5; j++) {
		
		// depending on the weather code will display certain weather icons
		if(code[j] === 0) {
			html += `<td><img class="icon" src="images/sun.jpg"></td>`
		} else if (code[j] >= 1 && code[j] <= 3 ){
			html += `<td><img class="icon" src="images/cloudy-sun.webp"></td>`;
		} else if (code[j] >= 45 && code[j] <= 67) {
			html += `<td><img class="icon" src="images/rain.webp"></td>`;
		} else if (code[j] >= 71 && code[j] <= 86) {
			html += `<td><img class="icon" src="images/snow.webp"></td>`;
		} else {
			html += `<td><img class="icon" src="images/cloudy-sun.webp"></td>`;
		}
	}

	// ends the table html
    html += "</table>";

   // add the html to the weatherDiv
    weatherDiv.insertAdjacentHTML("beforeend", html);
	
}