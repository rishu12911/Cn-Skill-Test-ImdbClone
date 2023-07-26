//https://www.omdbapi.com/?s=${value}&apikey=3c3fceca
//https://www.omdbapi.com/?t=${value}&apikey=3c3fceca

const form=document.getElementById("form-container")
const input=document.getElementById('input-field')
const movieinfo=document.getElementById('movie-info-container')
const autocmplete=document.getElementById('autocomplete-list')
const homebtn=document.getElementById('home-btn')
const counter=document.getElementById('counter')

//Array to store the movie name
var movie=[]

//Action on any input in the search box
input.addEventListener('keyup',()=>{
    allname();
    async function allname(){
        await removelist()
        const inputvalue=await input.value.toLowerCase();
        await autocompletelist(inputvalue);
        let list = [];
        movie.forEach((name) => {
          if (
            //comparing the input name with the names store in movie array
            name.substr(0, inputvalue.length).toLowerCase() === inputvalue &&
            inputvalue != 0
          )
            list.push(name);
     
        })
        await suggmovielist(list)
    } 
}) 
//to change the list according to the matching value and remove the previous list being showed
function removelist() {
    const element = document.getElementById("list-movie-names");
    if (element) {
      element.remove();
    }
  }

//Api is being called to fecth the data
async function autocompletelist(value){

    const fetchedata=await fetch(`https://www.omdbapi.com/?s=${value}&apikey=3c3fceca`) 
    const data=await fetchedata.json()
    const moviearr=await data.Search
    if(data.Response==='True'){
        //storing the title in movie array
    movie = moviearr.map((e) => {
        return e.Title;
      })
    }
    else{
        return
    }    
  }

//to display the list of movie matching to the input value
 async function suggmovielist(list) {
    const movielist=document.createElement('div')
    movielist.id='list-movie-names'
    list.forEach((e) => {
      const element = document.createElement("div");
      element.classList.add("suggestions")
      element.innerText=e
      element.addEventListener("click", () => {
       input.value = element.innerHTML;
       const removeid = document.getElementById("list-movie-names");
         if (removeid) {
        removeid.remove();
         }
      });
     movielist.appendChild(element)
     autocmplete.appendChild(movielist);
    });
  }

// when the search box value gets submitted to search the movie
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    const value=input.value;
    if(!value){
        alert(('Input the movie name'))
        return
    }
    apicall(value)
    input.value=""
    removelist()
})

//function to get the data about the movie being searched and display on the screen
async function apicall(value){

    const data=await fetch(`https://www.omdbapi.com/?t=${value}&apikey=3c3fceca`)
    const fetchedata=await data.json();
    if(fetchedata.Response==='True'){
        movieinfo.innerHTML=`
        <div id="fav-add-btn" onclick="changeshape()"><i class="fa-solid fa-heart fa-2x" id="fav-shape"></i></div>
        <div class="movie-poster"><img src="${fetchedata.Poster}"></div>
        <div class="name">${fetchedata.Title}</div>
        <div class="year">Year: <span id="year">${fetchedata.Year}</span></div>
        <div class="released-date">Released: <span> ${fetchedata.Released}</span></div>
        <div class="rating">Rating: <span id="rating">${fetchedata.Rated}</span></div>
        <div class="writer">Writer: <span>${fetchedata.Writer}</span></div>
        <div class="actor">Actor: <span>${fetchedata.Actors}</span></div>
        <div class="language">Language: <span>${fetchedata.Language}</span></div>
        <div class="plot">Plot: <span id="plot">${fetchedata.Plot}</span> </div>
         `
        // adding event to the favbtn 
        const favbtn=document.getElementById('fav-add-btn').addEventListener("click",()=>{
            handelfavbtn(fetchedata.Title)
            console.log(fetchedata.Title);
        })
    }
    //if the invalid movie name is being searched
    else{
        movieinfo.innerHTML=`       
        <div class='Error'>Error....Movie Not Found</div>
        `       
    }
}

//array to store the fav movie 
var favmoviearray=[]

// handeling fav btn click event
async function handelfavbtn(moviename){
    
    const retivedata= await localStorage.getItem("favmovie")
    if(retivedata!=null){
        favmoviearray= await JSON.parse(retivedata)
    }
    // to remove the duplicacy of fav. movie
    if(favmoviearray.includes(moviename)){
        let index=favmoviearray.indexOf(moviename);
        favmoviearray.splice(index,1)
        await localStorage.setItem("favmovie",JSON.stringify(favmoviearray))
        console.log(index);
        counter.innerText=favmoviearray.length
        return;
    }
    else{
    await favmoviearray.push(moviename);
    await localStorage.setItem("favmovie",JSON.stringify(favmoviearray))
    console.log(favmoviearray);
    }

    //to display the number of fav movie selected
    counter.innerText=favmoviearray.length
}

//to change the color of fav btn to show the user the movie is being added in fav list
function changeshape(){
    const el=document.getElementById('fav-shape')
    el.classList.toggle('chngcolor')
}

//Action when the Home button is being clicked
homebtn.addEventListener('click',()=>{
    movieinfo.innerHTML=""
    input.value=""
} )


