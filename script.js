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
const enquireBtn = document.getElementById("enquireBtn");
const enquiryForm = document.getElementById("enquiryForm");

if (enquireBtn && enquiryForm) {
    enquireBtn.addEventListener("click", () => {
        enquiryForm.style.display = "block";
        enquiryForm.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
}
// ================================
// ENQUIRY SUBMISSION
// ================================

const submitEnquiry = document.getElementById("submitEnquiry");

if (submitEnquiry) {

    submitEnquiry.addEventListener("click", async () => {

        const name =
            document.getElementById("enquiryName").value.trim();

        const phone =
            document.getElementById("enquiryPhone").value.trim();

        const age =
            document.getElementById("enquiryAge").value;

        const sport =
            document.getElementById("enquirySport").value;

        const message =
            document.getElementById("enquiryMessage").value.trim();

        if (!name || !phone) {
            alert("Please enter your name and phone number.");
            return;
        }

        submitEnquiry.disabled = true;
        submitEnquiry.textContent = "Submitting...";

        try {

            const { error } = await supabase
                .from("enquiries")
                .insert([{
                    name: name,
                    phone: phone,
                    age: age ? Number(age) : null,
                    sport: sport || null,
                    message: message || null
                }]);

            if (error) {
                throw error;
            }

            alert("Enquiry submitted successfully! Sir will contact you soon.");

            document.getElementById("enquiryName").value = "";
            document.getElementById("enquiryPhone").value = "";
            document.getElementById("enquiryAge").value = "";
            document.getElementById("enquirySport").value = "";
            document.getElementById("enquiryMessage").value = "";

        } catch (error) {

            console.error(error);
            alert("Unable to submit enquiry. Please try again.");

        }

        submitEnquiry.disabled = false;
        submitEnquiry.textContent = "Submit Enquiry";

    });

}
