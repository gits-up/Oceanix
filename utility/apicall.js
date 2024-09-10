export async function fetchLocationData(station, parameter) {
  const apiKey = "446d183e64e64e8eb4bca1407ab02a89";
  const url = `https://gemini.incois.gov.in/OceanDataAPI/api/wqns/${station}/${parameter}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      console.log("Failed to fetch: " + response.status);
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

export async function getCurrentTemperature(cityName) {
  const apiKey = "a3e964ae145d4aa89bf51645240109";
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}`;

  try {
    const response = await fetch(url);

    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      console.log("Failed to fetch: " + response.status);
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}
