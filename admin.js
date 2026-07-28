import supabase, { BUCKET_NAME } from "./supabase.js";

// ======================================
// RAY SPORTS CLUB ADMIN PANEL
// PART 1
// ======================================

// -------------------------------
// HTML ELEMENTS
// -------------------------------

const loginBox = document.getElementById("loginBox");
const dashboard = document.getElementById("dashboard");

const email = document.getElementById("email");
const password = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const uploadBtn = document.getElementById("uploadBtn");
const mediaFile = document.getElementById("mediaFile");

const adminGallery = document.getElementById("adminGallery");
const loginMessage = document.getElementById("loginMessage");

// -------------------------------
// LOGIN
// -------------------------------

loginBtn.addEventListener("click", async () => {

    loginMessage.innerHTML = "";
    loginMessage.style.color = "red";

    const userEmail = email.value.trim();
    const userPassword = password.value;

    if (!userEmail || !userPassword) {

        loginMessage.innerHTML =
            "Please enter Email and Password.";

        return;

    }

    loginBtn.disabled = true;
    loginBtn.innerHTML = "Logging In...";

    const { error } =
        await supabase.auth.signInWithPassword({

            email: userEmail,
            password: userPassword

        });

    loginBtn.disabled = false;
    loginBtn.innerHTML = "Login";

    if (error) {

        loginMessage.innerHTML =
            error.message;

        return;

    }

    loginMessage.style.color = "green";

    loginMessage.innerHTML =
        "Login Successful";

});

// -------------------------------
// LOGOUT
// -------------------------------

logoutBtn.addEventListener("click", async () => {

    await supabase.auth.signOut();

});

// -------------------------------
// SESSION CHECK
// -------------------------------

async function checkSession() {

    const { data } =
        await supabase.auth.getSession();

    if (data.session) {

        loginBox.style.display = "none";

        dashboard.style.display = "block";

        loadGallery();

    }

    else {

        loginBox.style.display = "block";

        dashboard.style.display = "none";

    }

}

checkSession();

// -------------------------------
// AUTH LISTENER
// -------------------------------

supabase.auth.onAuthStateChange(

    (event, session) => {

        if (session) {

            loginBox.style.display = "none";

            dashboard.style.display = "block";

            loadGallery();

        }

        else {

            loginBox.style.display = "block";

            dashboard.style.display = "none";

        }

    }

);

// ======================================
// PART 2 STARTS NEXT
// ======================================
// ======================================
// UPLOAD PHOTO / VIDEO
// ======================================

uploadBtn.addEventListener("click", async () => {

    const file = mediaFile.files[0];

    if (!file) {

        alert("Please select a photo or video.");

        return;

    }

    uploadBtn.disabled = true;

    uploadBtn.innerHTML = "Uploading...";

    try {

        const extension = file.name.split(".").pop();

        const uniqueName =
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 8) +
            "." +
            extension;

        const folder =
            file.type.startsWith("image/")
                ? "photos"
                : "videos";

        const filePath =
            folder + "/" + uniqueName;

        // ==========================
        // UPLOAD TO STORAGE
        // ==========================

        const { error: uploadError } =
            await supabase.storage
                .from(club_media)
                .upload(filePath, file);

        if (uploadError)
            throw uploadError;

        // ==========================
        // GET PUBLIC URL
        // ==========================

        const {
            data: publicData
        } = supabase.storage
            .from(club_media)
            .getPublicUrl(filePath);

        const publicURL =
            publicData.publicUrl;

        // ==========================
        // SAVE TO DATABASE
        // ==========================

        const { error: dbError } =
           await supabase
.from("media")
.insert([{

    file_name: uniqueName,

    file_url: publicURL,

    file_type:
    folder==="photos"
    ?"photo"
    :"video",

    uploaded_at:
    new Date().toISOString()

}]);

        if (dbError)
            throw dbError;

        alert("Upload Successful.");

        mediaFile.value = "";

        await loadGallery();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

    finally {

        uploadBtn.disabled = false;

        uploadBtn.innerHTML = "Upload";

    }

});



// ======================================
// LOAD GALLERY
// ======================================

async function loadGallery() {

    adminGallery.innerHTML = "";

    const {
        data,
        error
    } = await supabase
        .from("media")
        .select("*")
        .order("uploaded_at",{
ascending:false,
nullsFirst:false
})
        ;

    if (error) {

        console.error(error);

        return;

    }

    if (!data || data.length === 0) {

        adminGallery.innerHTML =
            "<h3>No media uploaded yet.</h3>";

        return;

    }
        // ==========================
    // CREATE GALLERY CARDS
    // ==========================

    data.forEach((item) => {

        const card = document.createElement("div");

        card.className = "imageCard";



        // ==========================
        // PHOTO
        // ==========================

        if (item.file_type === "photo") {

            const img = document.createElement("img");

            img.src = item.file_url;

            img.loading = "lazy";

            card.appendChild(img);

        }



        // ==========================
        // VIDEO
        // ==========================

        else {

            const video = document.createElement("video");

            video.src = item.file_url;

            video.controls = true;

            video.preload = "metadata";

            card.appendChild(video);

        }



        // ==========================
        // FILE NAME
        // ==========================

        const title = document.createElement("p");

        title.textContent = item.file_name;

        card.appendChild(title);



        // ==========================
        // DELETE BUTTON
        // ==========================

        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "Delete";



        deleteBtn.onclick = async () => {

            const confirmDelete = confirm(
                "Are you sure you want to delete this file?"
            );

            if (!confirmDelete)
                return;

            try {

                const folder =
                    item.file_type === "photo"
                        ? "photos"
                        : "videos";

                const storagePath =
                    `${folder}/${item.file_name}`;

                // Delete from Storage

                const { error: storageError } =
                    await supabase.storage
                        .from(club_media)
                        .remove([storagePath]);

                if (storageError)
                    throw storageError;

                // Delete from Database

                const { error: dbError } =
                    await supabase
                        .from("media")
                        .delete()
                        .eq("file_name", item.file_name);

                if (dbError)
                    throw dbError;

                alert("Deleted Successfully");

                await loadGallery();

            }

            catch (error) {

                console.error(error);

                alert(error.message);

            }

        };



        card.appendChild(deleteBtn);

        adminGallery.appendChild(card);

    });

}
