
// original

// declaring variables
var selectGroup = document.getElementById("selectGroup"); // add countries names
var selectElement = document.getElementById("choosenCountry"); // get from select element
var flagImg = document.getElementById("flagImg"); 
var coatOFarmy = document.getElementById("army");
var unimemberTrue = document.getElementById("unTrue");
var unimemberFalse = document.getElementById("unFalse");
var independentTrue = document.getElementById("indTrue");
var independentFalse = document.getElementById("indFalse");
var population = document.getElementById("population");
var region = document.getElementById("region");
var startOfWeek = document.getElementById("startOfWeek");
var timeZone = document.getElementById("timeZone");
var capital = document.getElementById("capital");
var mapFrame = document.getElementById("map-frame"); 
var mapBtn = document.getElementById("map-btn");

// hide page content
var pageInfo = document.getElementsByClassName("pageInfo"); 
console.log(pageInfo);
pageInfo[0].style.display="none";
pageInfo[1].style.display="none";
pageInfo[2].style.display="none";


/////// Fetch all needed data ///////
async function fetchData() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,coatOfArms,unMember,independent,population,continents,startOfWeek,timezones,capital,maps,cca2');
        if (response.ok) {  //(HTTP status code 200)
            let data = await response.json();
            return data;
        } else {
            console.error(`Error ${response.status}: ${response.statusText}`);
                                        //404               //NotFound
            return []; // Return an empty array in case of an error
        }
    } catch (error) {
        console.error('ERROR', error.message);
        return []; // Return an empty array in case of an exception
    }
}

////////////// Fetch News /////////////
async function fetchAllNews(selectedCountryName) {
    const response = await fetch(`https://api.worldnewsapi.com/search-news?api-key=798db9ed21264c72aa6bf1f1a0022991&text=${selectedCountryName}`);
    if (response.ok) {                                                              
        let news = await response.json();
        return news;
    } else {
        console.error(`Error ${response.status}: ${response.statusText} for ${selectedCountryName}`);
                                //402                   
    }
} 

///////// Assign names to options /////////
async function populateCountries() {
    let countriesData = await fetchData();
    let countryNames = countriesData.map((country) => country.name.common).sort(); // return sorted aray of countries names
    console.log(countryNames);
    countryNames.forEach((countryName) => { // append opion 
    selectGroup.innerHTML += ` <option value="${countryName}">${countryName}</option> `;
    });
}

/////////// Update page based on selected country ///////////
async function updatePage(selectedCountry) {
    if (selectedCountry) {  
        flagImg.src = selectedCountry.flags?.png || "../images/NotFound.png";
        coatOFarmy.src = selectedCountry.coatOfArms?.png || "../images/NotFound.png";
        //// UniMember or Not /////
        if (unimemberTrue && unimemberFalse) {
            unimemberTrue.style.display = selectedCountry.unMember ? "inline-block" : "none";
            unimemberFalse.style.display = selectedCountry.unMember ? "none" : "inline-block";
        }
        //// Independent or Not /////
        if (independentTrue && independentFalse) {
            independentTrue.style.display = selectedCountry.independent ? "inline-block" : "none";
            independentFalse.style.display = selectedCountry.independent ? "none" : "inline-block";
        }
        //// read facts /////
        population.textContent=selectedCountry.population.toLocaleString('en-US', { style: 'decimal' }); // 1,456,790
        region.textContent=selectedCountry.continents;
        startOfWeek.textContent= selectedCountry.startOfWeek.charAt(0).toUpperCase() + selectedCountry.startOfWeek.slice(1) ;
        timeZone.textContent=selectedCountry.timezones[0]; // just one
        capital.textContent=selectedCountry.capital;

        //// maps //////
        //points to Google Maps with the query parameter which specifies the location to be displayed on the map.
        mapFrame.src = `https://www.google.com/maps?q=${selectedCountry.name.common}&hl=en&z=6&output=embed`;
        mapBtn.href = selectedCountry.maps.googleMaps || "#";
        //console.log(mapBtn.href)

        /////------------/ start news /-----------/////
        let countriesnews = await fetchAllNews(selectedCountry.name.common); // get all data about news
        countriesnews = countriesnews.news // get country news
        console.log(countriesnews);
        // print only four
        for ( let i = 0 ; i < 4 ; i++){ 

            //////// set dates/////////
           let dates = document.getElementsByClassName("newsDate");
          // console.log(countriesnews[i].publish_date);
          var date = new Date(countriesnews[i].publish_date);
           dates[i].innerHTML = `${date.getDate()} ${date.toLocaleString("default",{ month: "short" })}, ${date.getFullYear()}`; //19 jul,2024
           //console.log(dates[i]);

           ///// set images //////
           let imgs = document.getElementsByClassName("newsimages");
           //console.log(countriesnews[i].image);
           imgs[i].src = `${countriesnews[i].image}`;
           if(imgs[i].src == null || undefined){ // check image source
            imgs[i].src = "../images/NotFound.png";
           }
           imgs[i].style.height = "200px";

           //// set title /////
           let titles = document.getElementsByClassName("newstitle");
          // console.log(countriesnews[i].title);
           titles[i].href = `${countriesnews[i].url}`
           titles[i].innerHTML= `${countriesnews[i].title.slice(0,30)}`; // print only 30 char
         

           ///// set body ///////////
           let topic = document.getElementsByClassName("newsbody");
           //console.log(countriesnews[i].text);
           topic[i].innerHTML= `${countriesnews[i].text.slice(0,100)}`; // print only 100 char
           topic[i].style.overflow = "hidden";

           //// set author //////
           let newsauthors = document.getElementsByClassName("newsauthor");
           //console.log(countriesnews[i].authors);
           if (countriesnews[i].authors.length == 1 ){  // check 
            newsauthors[i].innerHTML= `${countriesnews[i].authors[0]}`;
        }
        else {
            newsauthors[i].innerHTML= `${countriesnews[i].authors[1]}`;
           }
        }
        /////// end news //////////

    } else {        
        console.log("faild to fetch country");
    }
}
/////// end updates function //////////

////// start email ////////

    var submitElm = document.getElementById("button");
    
    function sendMail() {
      var name = document.getElementById("from_name").value;
      var email = document.getElementById("email_id").value;
      var message = document.getElementById("messsage").value;
      var emailStatus = document.getElementById("email-status");
    
      if (!name.trim() || !email.trim() || !message.trim()) {
        emailStatus.innerText = "Please fill out all fields.";
        emailStatus.style.display="block";
        emailStatus.classList.add("email-fail");
        return;
      }
      if (email.indexOf("@") == -1) {
        emailStatus.innerText = "Email address is not valid.";
        emailStatus.style.display="block";
        emailStatus.classList.add("email-fail");
        return;
      }
    
       const serviceID = 'default_service';
       const templateID = 'template_j3ik1xm';

       var params = {
        name: name,
        email: email,
        message: message,
      };
    
      emailjs
        .send(serviceID, templateID, params)
        .then((res) => {
          document.getElementById("from_name").value = "";
          document.getElementById("email_id").value = "";
          document.getElementById("messsage").value = "";
          emailStatus.innerText = "Email sent successfully!";
          emailStatus.style.display="block";
          emailStatus.classList.add("email-success");
        })
        .catch((err) => {
          console.log(err);
          emailStatus.innerText = "Failed to send email.";
          emailStatus.style.display="block";
          emailStatus.classList.add("email-fail");
        });
    }
    
    submitElm.addEventListener("click", sendMail);

/*  ////////// original //////////////  
const btn = document.getElementById('button');
document.getElementById('form')
 .addEventListener('submit', function(event) {
   event.preventDefault();
   btn.value = 'Sending...';

   const serviceID = 'default_service';
   const templateID = 'template_j3ik1xm';

   emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.value = 'Send Email';
    }, (err) => {
      btn.value = 'Send Email';
      alert(JSON.stringify(err));
    });
});
*/
///// end email ///////

// Event listener for select element change
selectElement.addEventListener('change', async function (event) {
    pageInfo[0].style.display="block";
    pageInfo[1].style.display="block";
    pageInfo[2].style.display="block";


    const selectedCountryName = event.target.value;
        // Filter the data based on the selected country name and display its data
    let selectedCountry = (await fetchData()).find(country => country.name.common === selectedCountryName);
    updatePage(selectedCountry);
});

// Initial population of countries
populateCountries();

