//Getting these DOM's elements from HTML. ========================================================
const container = document.querySelector(".content");
const addressInput = document.querySelector("#address");
const apiInput = document.querySelector("#api-key");
const searchButton = document.querySelector("#search");
const outputParent = document.querySelector("#parent-output");
outputParent.className = "section";

//Creating some DOM elements, appeding  to HTML later on.=========================================
const outputTitle = document.createElement("div");
outputTitle.id = "output-title";
outputTitle.className = "outputs";
outputTitle.innerText = "Next Satellite Pass Will Be";

const outputRise = document.createElement("div");
outputRise.id = "output-rise";
outputRise.className = "outputs";
outputRise.innerHTML = "Rise:";

const outputCulminate = document.createElement("div");
outputCulminate.id = "output-culminate";
outputCulminate.className = "outputs";
outputCulminate.innerHTML = "Culminate:";

const outputSet = document.createElement("div");
outputSet.id = "output-set";
outputSet.className = "outputs";
outputSet.innerHTML = "Set:";

//Appending all modifications made above.
outputParent.appendChild(outputTitle);
outputParent.appendChild(outputRise);
outputParent.appendChild(outputCulminate);
outputParent.appendChild(outputSet);

//=====================================================================================================

//On click Event 
searchButton.addEventListener("click",() =>{
    // outputParent.style.opacity = '1';
    const getMapBoxURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/
    ${encodeURI(addressInput.value)}
    .json?access_token=${apiInput.value}`;
    //Request MapBox API to tranfer User Address into Coordinates.

    fetch(getMapBoxURL)
        .then((rawData) => rawData.json())
        .then((Data) =>{
            const longitude = Data.features[0].center[0];
            const latitude = Data.features[0].center[1];
            const satellite = document.querySelector('#norad');

            const getSatelliteURL = "https://satellites.fly.dev/passes/"+satellite.value+"?lat="+latitude+"&lon="+longitude+"&limit=1&days=15&visible_only=true";
            //Request Satellite Location using the Coordinates from last Fetch
            fetch(getSatelliteURL)
            .then((rawData2) => rawData2.json())
            .then((Data2) =>{
                if(Data2.length > 0){
                    //Add Satellite information from the API request and Display to user.
                    outputTitle.innerHTML = `The Next Sattellite Pass in ${addressInput.value.toUpperCase()} will be`;
                    outputRise.innerHTML += " " + Data2[0].rise.utc_datetime;
                    outputCulminate.innerHTML += " " + Data2[0].culmination.utc_datetime;
                    outputSet.innerHTML += " " + Data2[0].set.utc_datetime;

                    //Reset Input Values
                    addressInput.value = '';
                    apiInput.value = '';
                    satellite.value = '';
                }else{
                    outputTitle.innerText = "No Satelite passes found in this time frame for this address."
                }
                
            });
        });
});
