var urlcont = [];
var pageCounter = 1;
var pplContainer = document.getElementById("people-info");
var btn = document.getElementById("btn");

var btn2 = document.getElementById("btn2");
var contContainer = document.getElementById("contact-info");


//-------------------------------------------------------------------------
var personButton = document.getElementById("personButton");

var personContainer = document.getElementById("specific-info");

var namez = "";

if (document.getElementById("nameFindID")){
  namez = document.getElementById("nameFindID").value;
}

console.log("names = " + namez);
function getPerson(){
  //if (namez ==  ourRequest.data[i].firstName){  // data.firstName){
     //viewCurrentContact();
  //}

  var ourRequest = new XMLHttpRequest();
  ourRequest.open('GET', 'https://mustang-index.azurewebsites.net/index.json');
  ourRequest.onload = function() {
    var ourData = JSON.parse(ourRequest.responseText);
    
      renderFirstName(ourData);
   
  };
  ourRequest.send();
  

}

function renderFirstName(data){

  if (document.getElementById("nameFindID")){
    namez = document.getElementById("nameFindID").value;
  }

  var thisCon = "";

  for (i = 0; i < data.length; i++) {
    var fname = data[i].Name.split(" ")
    console.log("first name = " + fname[0]);

    if (fname[0]==namez){
      document.getElementById("nameID").value = data[i].Name;
      document.getElementById("emailID").value = data[i].Email;
      thisCon = data[i].ContactURL;
    }
  }

  var ourRequest = new XMLHttpRequest();
  ourRequest.open('GET', thisCon);
  ourRequest.onload = function() {
      var ourData = JSON.parse(ourRequest.responseText);

        document.getElementById("zipID").value = ourData.zip;
        document.getElementById("cityID").value = ourData.city;
        document.getElementById("stateID").value = ourData.state;
        //document.getElementById("zipID").value = ourData.zip;
        
        console.log("data = " + ourData);
   
    };
  
  ourRequest.send();

}

//---------------------------------------------------------------------------

var contactArray = [];
var currentContactIndex = -1; //was 0

//add
function addContact(){
  console.log("addContact() running");
  var newContact = {
    preferredName  : document.getElementById("nameID").value,   
    email : document.getElementById("emailID").value,  
    zip : document.getElementById("zipID").value,  
    city  : document.getElementById("cityID").value,   
    state : document.getElementById("stateID").value //,
    //zip : document.getElementById("zipID").value  
  }
  contactArray.push(newContact);
  //currentContactIndex.push(newContact);
  currentContactIndex = currentContactIndex + 1;
  console.log(contactArray);
  viewCurrentContact();

  //pplContainer.insertAdjacentHTML('beforeend', newContact);
}

function remove(){
  var contactArray2 = [];
  console.log("removeContact() Running");
  if (contactArray.length > 1){
    contactArray.splice(currentContactIndex,1);
    currentContactIndex -= 1;
  }
  else if (contactArray.length == 1){
      currentContactIndex = currentContactIndex -1;
      contactArray.pop();
    
  }
  console.log(contactArray);
  //viewCurrentContact();
}

function viewCurrentContact() {

  currentContact = contactArray[currentContactIndex];
  console.log(currentContact);
  document.getElementById("nameID").value = currentContact.preferredName;   
  document.getElementById("emailID").value = currentContact.email;   
  document.getElementById("zipID").value = currentContact.zip;
  document.getElementById("cityID").value = currentContact.city;   
  document.getElementById("stateID").value = currentContact.state;
  //document.getElementById("zipID").value = currentContact.zip;   


}


//load/save php -----------------------------------------------------------


function saveContactsToServer() {
  console.log("saveContactsToServer()");
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          console.log('Response: ' + this.responseText);
          setStatus(this.responseText)
      }
  };
  xmlhttp.open("POST", "save-con.php", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send("contacts=" + JSON.stringify(contactArray));   
}

function loadContactsFromServer() {
  console.log("loadContactsFromServer()");

  // Clear the current contacts.
  contactArray.length = 0;

  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          contactArray = JSON.parse(this.responseText);
          setStatus("Loaded contacts (" + contactArray.length + ")");

          currentContactIndex = 0;
          viewCurrentContact()
      }
  };

  xmlhttp.open("GET", "load-con.php", true);
  xmlhttp.send();   
}


//end load/save php -------------------------------------------------------


function setStatus(status) {
  document.getElementById("statusID").innerHTML = status;    
}

function previous() {
  if (currentContactIndex > 0) {
      currentContactIndex--;
  }
  currentContact = contactArray[currentContactIndex];
  viewCurrentContact();
}

function next() {
  if (currentContactIndex < (contactArray.length-1)) {
      currentContactIndex++;
  }
  currentContact = contactArray[currentContactIndex];
  viewCurrentContact();
  console.log(contactArray);
}


//-------------------------------------------------------------------------------
//---------------------based on base code----------------------------------------
function callZip(){
  getPlace();
}


function getPlace(){
  var zip = document.getElementById("zipID").value
  console.log("zip:"+zip);

  console.log("function getPlace(zip) { ... }");
  var xhr = new XMLHttpRequest();

  // Register the embedded handler function
  xhr.onreadystatechange = function() {

    if (xhr.readyState == 4 && xhr.status == 200) {
      var result = xhr.responseText;
      console.log("result:"+result);

      var place = result.split(', ');
      

      var citycity = place[0];

      console.log("city = "+citycity);

      if ((document.getElementById("cityID").value == "") || (document.getElementById("cityID").value == " "))
          document.getElementById("cityID").value = citycity;
      if (document.getElementById("stateID").value == "")
          document.getElementById("stateID").value = place[1];
      }
    }
    xhr.open("GET", "zip-to-city-state.php?zip=" + zip);
    xhr.send(null);
}

function keyPressed() {
    console.log('keyPressed()');

}


//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------


btn.addEventListener("click", function() {
    btns();
});

function btns() {
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'https://mustang-index.azurewebsites.net/index.json');
    ourRequest.onload = function() {
      var ourData = JSON.parse(ourRequest.responseText);
      
        renderHTML(ourData);
     
    };
    ourRequest.send();
    
  };
  

function renderHTML(data) {
  var htmlString = "";

  
  for (i = 0; i < data.length; i++) {
    htmlString += "<p>" + data[i].Name + " " + data[i].Email + " " + data[i].ContactURL;
    
     urlcont.push(data[i].ContactURL)
    

    console.log(urlcont);
  }

  pplContainer.insertAdjacentHTML('beforeend', htmlString);
}


function btns2(URL){

    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', URL);
    ourRequest.onload = function() {
        var ourData = JSON.parse(ourRequest.responseText);
         console.log(ourData[0]);
        renderHTML2(ourData);
     
         };
    
    ourRequest.send();
  };


  btn2.addEventListener("click", function() {
    contactHelper();

    console.log("btn2 hit");
    
    
  });


  function renderHTML2(data) {
    var htmlString = "";
  
    
    
      htmlString += "<p>" + " first name: " + data.firstName + " last name: " + data.lastName + 
      " prefered name: " + 
      data.preferredName + " email: " + data.email + " phone number: " + data.phoneNumber
      + " class: " + data.class + " room: " + data.room + " Start: " + data.startTime + 
      " Seat: " + data.seatNumber + " inPerson: " + data.inPerson + " virtual: " + data.virtual 
      + " city: " + data.city + " state: " + data.state + " zip: " + data.zip +
       " lat: " + data.lat + " lng: " + data.lng + " hobby: " + data.favoriteHobby + " ";
   
    console.log(data.firstName + " " + data.lastName + " " + "loaded");

    contContainer.insertAdjacentHTML('beforeend', htmlString);
  }



  function contactHelper() {
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'https://mustang-index.azurewebsites.net/index.json');
    ourRequest.onload = function() {
      var ourData = JSON.parse(ourRequest.responseText);
      //console.log(ourData[0]);
        //renderHTML(ourData);
        renderContactHelper(ourData);
    };
    ourRequest.send();
    
  };


  function renderContactHelper(data) {

    if (urlcont.length < 1){
        
    
     for (i = 0; i < data.length; i++) { //here is other loop
        urlcont.push(data[i].ContactURL)
        }
    }
        loopy();
    }

function loopy(){

    for (i = 0; i < urlcont.length; i++) {
        btns2(urlcont[i]);
    }
}


