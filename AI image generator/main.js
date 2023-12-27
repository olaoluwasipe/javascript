const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");
const imgModal = document.querySelector(".imgModal");
const imgsCard = document.querySelectorAll(".img-card")

const OPENAI_API_KEY = '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';
let isImageGenerating = false;

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");

        // Set the image src to the AI generated image data
        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        // When the image is loaded remove the loading class and set download attributes
        imgElement.onload = () => {
            imgsCard.forEach((card) => {
                if(!card.classList.contains('loading')) card.addEventListener("click", handleModal);
            })
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    })
}

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        // Send request to OpenAI API to generate images based on the user's inputs.
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: '512x512',
                response_format: "b64_json"
            })
        });

        if(!response.ok) throw new Error("Failed to generate images! Please try again.");

        const { data } = await response.json();
        updateImageCard([...data]);
    } catch (error) {
        alert(error.message)
        console.error(error)
    } finally {
        isImageGenerating = false;
    }
}

// Function to handle image prompt form submission
const handleFormSubmission = (e) => {
    e.preventDefault();
    if(isImageGenerating) return;
    isImageGenerating = true;

    // Get user input from the input form
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;

    // Creating HTML markup for image cards with loading state
    const imgCardMarkUp = Array.from({length: userImgQuantity}, () =>
        `<div class="img-card loading">
            <img src="images/loader.svg" alt="image">
            <a href="#" class="download-btn">
                <img src="images/download.svg" alt="download icon">
            </a>
        </div>`
    ).join("");

    imageGallery.innerHTML =  imgCardMarkUp
    generateAiImages(userPrompt, userImgQuantity);
}

// Function to handle image modal
const handleModal = (e) => {
    if(imgModal.classList.contains("open")){
        // If modal is open, remove the open class
        imgModal.classList.remove("open")
    }else{
        // If modal is closed, get the current image and place it in the modal's image src.
        const imgg = e.target.querySelector("img");
        imgModal.querySelector("img").src = imgg.src;
        imgModal.classList.add("open")
    }
}

generateForm.addEventListener("submit", handleFormSubmission);

imgsCard.forEach((card) => {
    if(!card.classList.contains('loading')) card.addEventListener("click", handleModal);
})
imgModal.addEventListener("click", handleModal)
