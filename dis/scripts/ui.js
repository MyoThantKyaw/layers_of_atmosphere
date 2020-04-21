headers_eng = ["Boeing 787-8 Airliner"]
headers_my = ["ဘိုးရင်း 787-8 ခရီးသည်တင် လေယာဉ်"]

model_names = []

descriptions_eng = ["The Boeing 787 Dreamliner is a wide-body airliner manufactured by Boeing Commercial Airplanes. After dropping its Sonic Cruiser project, Boeing announced .. ner is a wide-body airliner manufacner is a wide-body airliner manufacner is a wide-body airliner manufac."]
descriptions_my = ["Boeing 787 Dreamliner သည်ဘိုးအင်းစီးပွားဖြစ်လေယာဉ်များမှထုတ်လုပ်သောကျယ်ပြန့်သောလေယာဉ်ပျံဖြစ်သည်။ Sonic Cruiser စီမံကိန်းကိုဖျက်သိမ်းပြီးနောက် Boeing သည်  သည်ဘိုးအင်းစီးပွားဖြစ်လေယာဉ်များမှထုတ်လုပ်သောကျယ်ပြန့်သောလေယာဉ်ပျံဖြစ်သည်။ Sonic Cruiser စီမံကိန်းကိုဖျက်သိမ်းပြီးနောက် Boeing သည် ဖြစ်သည်။ Sonic Cruiser စီမံကိန်းကိုဖျက်သိမ်းပြီးနောက် Bဖြစ်သည်။ Sonic Cruiser စီမံကိန်းကိုဖျက်သိမ်းပြီးနောက် Bဖြစ်သည်။ Sonic Cruiser စီမံကိန်းကိုဖျက်သိမ်းပြီးနောက် Bဖြစ်သည်။ Sonic Cruiser စီမံကိန်းကိုဖျက်သိမ်းပြီးနောက် Bဖြစ်သည်။ Sonic Cruiser စီမံကိန်းကိုဖျက်သိမ်းပြီးနောက် B"]

credits = ["Credits to someone..."]
var modal;
var descriptionTag = document.getElementById("model-description");
var headerTag = document.getElementById("model-header");

function setupActionListeners() {
    // Get the modal
    modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        hideDialog();
    }

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // When the user clicks the button, open the modal 
    btn.onclick = function () {
        showDialog(0)
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            hideDialog()
        }
    }
}

function showDialog(index) {

    headerTag.innerHTML = "<h3>" + headers_my[index] + "</h3>";
    descriptionTag.innerHTML = "<p>" + descriptions_my[index] + " </p>";

    modal.style.display = "block";
    threeD.showModel("airplane", "model-image-panel");
}

function hideDialog() {
    modal.style.display = "none";
}

setupActionListeners() 
