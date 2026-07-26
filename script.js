import supabase from "./supabase.js";

const gallery =
document.getElementById("galleryContainer");



async function loadGallery(){

gallery.innerHTML=`

<div class="loading">

<h2>

📸 गॅलरी लोड होत आहे...

</h2>

</div>

`;



const{

data,

error

}=await supabase

.from("media")

.select("*")

.order("uploaded_at",{

ascending:false

});



if(error){

gallery.innerHTML=`

<div class="loading">

<h2>

Gallery Failed To Load

</h2>

</div>

`;

console.log(error);

return;

}



if(data.length===0){

gallery.innerHTML=`

<div class="loading">

<h2>

अद्याप फोटो उपलब्ध नाहीत.

</h2>

</div>

`;

return;

}



gallery.innerHTML="";



data.forEach(item=>{

const card=document.createElement("div");

card.className="galleryCard";



if(item.file_type==="photo"){

card.innerHTML=`

<img

src="${item.file_url}"

alt="${item.file_name}"

loading="lazy"

>

`;

}

else{

card.innerHTML=`

<video

controls

playsinline

preload="metadata">

<source

src="${item.file_url}">

</video>

`;

}



gallery.appendChild(card);

});

}



loadGallery();



setInterval(()=>{

loadGallery();

},30000);