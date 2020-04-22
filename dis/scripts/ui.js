headers_eng = ["Boeing 787-8 Airliner", "Satellite", "Meteoroid"]
headers_my = ["ဘိုးရင်း 787-8 ခရီးသည်တင် လေယာဉ်", "ဂြိုလ်တု", "ကြယ်တံခွန်"]

const modelKeys = ["airplane", "satellite", "meteoroid"]

model_names = []
var isFirstTime = true

descriptions_eng = ["The Boeing 787 Dreamliner is a wide-body airliner manufactured by Boeing Commercial Airplanes. After dropping its Sonic Cruiser project, Boeing announced .. ner is a wide-body airliner manufacner is a wide-body airliner manufacner is a wide-body airliner manufac."]
descriptions_my = ["Boeing 787 Dreamliner သည်ဘိုးအင်းစီးပွားဖြစ်လေယာဉ်များမှထုတ်လုပ်သောကျယ်ပြန့်သောလေယာဉ်ပျံဖြစ်သည်။ Sonic Cruiser စီမံကိန်းကိုဖျက်သိမ်းပြီးနောက် Boeing သည်  သည်ဘိုးအင်းစီးပွားဖြစ်လေယာဉ်များမှထုတ်လုပ်သောကျယ်ပြန့်သောလေယာဉ်ပျံဖြစ်သည်။ Sonic Cruiser စီမံကိန်းကိုဖျက်သိမ်းပြီးနောက် Boeing သည် ဖြစ်သည်။ Sonic Cruiser စီမံကိန်းကိုဖျက်သိမ်းပြီးနောက် Bဖြစ်သည်။ Sonic Cruiser စီမံကိန်းကိုဖျက်သိမ်းပြီးနောက် Bဖြစ်သည်။ Sonic Cruiser စီမံကိန်းကိုဖျက်သိမ်းပြီးနောက် Bဖြစ်သည်။ Sonic Cruiser စီမံကိန်းကိုဖျက်သိမ်းပြီးနောက် Bဖြစ်သည်။ Sonic Cruiser စီမံကိန်းကိုဖျက်သိမ်းပြီးနောက် B",
"အာကာသယာဉ်ပျံ၏အခြေအနေတွင်ဂြိုဟ်တုတစ်လုံးသည်ရည်ရွယ်ချက်ရှိရှိပတ်လမ်းအတွင်းသို့တင်ထားသည့်အရာဝတ္ထုတစ်ခုဖြစ်သည်။ ၎င်းအရာဝတ္ထုများကိုကမ္ဘာဂြိုဟ်ကဲ့သို့သောသဘာဝဂြိုလ်",
"ဥက္ကာပျံ (/ ˈmiːtiərɔɪd /) [1] သည်အာကာသထဲရှိကျောက်တုံးသို့မဟုတ်သတ္တုကိုယ်ထည်ဖြစ်သည်။ဥက္ကာပျံများသည်ဂြိုဟ်မွှားများထက်သိသိသာသာသေးငယ်ပြီးအရွယ်သေးငယ်သောပမာဏမှသည် ၁ မီတာကျယ်သောအရာဝတ္ထုများအထိရှိသည်။ ဒီထက်သေးငယ်တဲ့အရာဝတ္ထုတွေကိုခွဲခြားထားတယ်",
]

credits = ["3D model by <b><i><a target='_blank' href='https://www.turbosquid.com/3d-models/free-boeing-787-8-1-3d-model/858876#'>companion_3d</a></i></b> from <b>TurboSquid</b>",
"3D model from <i><a target='_blank' href='http://www.cadnav.com/'>CadNav</a></i>",
"3D model from <i><a target='_blank' href='https://solarsystem.nasa.gov/resources/2389/eros-3d-model/'>NASA</a></i>"]
var modal;
let descriptionTag = document.getElementById("model-description");
let headerTag = document.getElementById("model-header");
let modelCredit = document.getElementById("model-credit");
var currentShowingItem = "airplane";

function setupActionListeners() {

    // semantic ui
    $('.ui.dropdown').dropdown(

    );

    // change actions
    $('#model-types-dropdown').dropdown({
        onChange: function (val) {
            let key;
            if (val == "လေယာဉ်") {
                key = 'airplane'
            }
            else if (val == "ဂြိုလ်တု") {
                key = 'satellite'
            }
            else if (val == "ကြယ်တံခွန်") {
                key = 'meteoroid'
            }
            if(currentShowingItem == key){return }
            currentShowingItem = key
            changeModel(key)
        }
    })


    // Get the modal
    modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        hideDialog();
    }

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");
    let btnPlayPause = document.getElementById("btn-play-pause");
    let btnPlayPauseIcon = document.getElementById("btn-play-pause-icon");

    // When the user clicks the button, open the modal 
    btn.onclick = function () {
        showDialog()
    }

    btnPlayPause.onclick = function(){
        if (threeD.isPlaying){
            btnPlayPauseIcon.classList.remove('pause');
            btnPlayPauseIcon.classList.add('play');

            threeD.pause()
        }
        else{
            btnPlayPauseIcon.classList.remove('play');
            btnPlayPauseIcon.classList.add('pause');

            threeD.play()
        }
        console.log("paluse ause...")
    }

    // When the user clicks anywhere outside of the modal, close it
    // window.onclick = function (event) {
    //     if (event.target == modal) {
    //         hideDialog()
    //     }
    // }

    showDialog();
}

function showDialog() {
    
    modal.style.display = "block";

    
    
    if (isFirstTime){
        threeD.setupScene("model-image-panel")
        isFirstTime = false;
        changeModel("airplane")
    }
    else{
        changeModel(currentShowingItem)
    }
    
}

function changeModel(newModelKey) {
    let index = modelKeys.findIndex(function (x) { return x == newModelKey })
    var header = headers_my[index];
    var descritpion = descriptions_my[index];
    var credit = credits[index];

    headerTag.innerHTML = "<h4>" + header + "</h4>";
    descriptionTag.innerHTML = "<p>" + descritpion + " </p>";
    modelCredit.innerHTML = "<p>" + credit + "</p>";

    modal.style.display = "block";
    // threeD.showModel(index);

}

function hideDialog() {
    modal.style.display = "none";
    // threeD.hideModel();
}

setupActionListeners() 
