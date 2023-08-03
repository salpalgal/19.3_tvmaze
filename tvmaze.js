"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const episodesList = document.querySelector("#episodes-list") 


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
const arr = []
const epiArr = []
async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`)
  for(let show in res.data){
    const data= res.data[show]
    let imgObj = data.show.image
    if(imgObj == null){
      imgObj="https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg"
    }
    

    
    let obj = {id:`${data.show.id}`, name:`${data.show.name}`, summary:`${data.show.summary}`,image:`${imgObj.original}`}
    
    arr.push(obj)
    // 
  
  }
  
  return arr


  // return [
  //   {
  //     id: 1767,
  //     name: "The Bletchley Circle",
  //     summary:
  //       `<p><b>The Bletchley Circle</b> follows the journey of four ordinary 
  //          women with extraordinary skills that helped to end World War II.</p>
  //        <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their 
  //          normal lives, modestly setting aside the part they played in 
  //          producing crucial intelligence, which helped the Allies to victory 
  //          and shortened the war. When Susan discovers a hidden code behind an
  //          unsolved murder she is met by skepticism from the police. She 
  //          quickly realises she can only begin to crack the murders and bring
  //          the culprit to justice with her former friends.</p>`,
  //     image:
  //         "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
  //   }
  // ]
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="Bletchly Circle San Francisco" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);
  populateShows(shows);
  for(let show in shows ){
    
    let showID = shows[show].id
    let episodeData = await getEpisodesOfShow(showID)
    
    populateEpisodes(episodeData)
  }
  
}


$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  
  await searchForShowAndDisplay();
  


});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  /**This function returns an array of objects that contains information on episodes of the show that has the ID passed in params. */
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  for (let show in res.data){
    let obj = {id:`${res.data[show].id}`, name:`${res.data[show].name}`, season:`${res.data[show].season}`,number:`${res.data[show].number}`}
    epiArr.push(obj)
    
  }

  return epiArr
  
 }

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
    
  /**This function takes param of an array of object of info of episodes by looping through it to attach episode info to the DOM as a li.
   * Each li has a remove button append to it to remove its parent element with event handler. 
   */
  for (let episode in episodes){
    const createBtn = document.createElement("button")
    createBtn.innerText="remove"
    const createLi = document.createElement("li")
   
    createLi.innerText= `${episodes[episode].name} (season ${episodes[episode].season} , number ${episodes[episode].number})`
    createLi.append(createBtn)
    episodesList.append(createLi)
   
    createBtn.addEventListener("click",function(e){
      e.preventDefault()
      createBtn.parentElement.remove()
    })
   
  }

  
}

