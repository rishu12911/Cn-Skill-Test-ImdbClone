//getting the list of fav movie stores in local storage
const favmovie=localStorage.getItem('favmovie')
const favmovarr=JSON.parse(favmovie)
const list=document.getElementById('favmovlist')
const clearall=document.getElementById('deleteall')

//function to clear the fav page
clearall.addEventListener('click',()=>{
    localStorage.clear()
    window.location.reload();
})
//loop for displaying all the movie
for(let i=0;i<favmovarr.length;i++){

    //to load each individual movie in the page 
    apicall(favmovarr[i])
}

//api call to extract the data of movies
async function apicall(value){
    const fetchedata= await fetch(`https://www.omdbapi.com/?t=${value}&apikey=3c3fceca`)
    const data= await fetchedata.json()
    //after getting the data now loading the movie on page
    await loadfavmov(data)

}

//to display the movies detail
function loadfavmov(data){
    const name=data.Title
    const element=document.createElement('div')
    element.classList.add('list')
    element.innerHTML=`
            <div class="poster"><img src="${data.Poster}"></div>
            <div class="name">${name}</div>
            <div class="year-release">${data.Year}</div>
            <div id="button"><i class="fa-solid fa-trash" id="${data.Title}"onclick="hndldltbtn(id)"></i></div>
    
    `
    list.appendChild(element)
}
//function to remove the fav movies on clicking delete icon
function hndldltbtn(id){
    let index=favmovarr.indexOf(id);
    favmovarr.splice(index,1)
    localStorage.setItem("favmovie",JSON.stringify(favmovarr))
    console.log(index);
    window.location.reload();
}
