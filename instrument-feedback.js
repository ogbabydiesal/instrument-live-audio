const { createDevice } = RNBO;
let myGain;
let starWrap = document.querySelector('#star-wrap')
let myAnalysis;
let volume = 0;

async function setup() {
    createCanvas(800, 600);
    myAnalysis = new p5.Amplitude();
    myAnalysis.smooth(0.9)
    //get the Audio Context to share
    let context = getAudioContext();

    // Create gain node and connect it to audio output
    myGain = new p5.Gain();

    // Fetch the exported patchers
    let response = await fetch("rnbo.shimmerev.json");
    const reverbPatcher = await response.json();

    // Create the devices
    const reverbDevice = await createDevice({ context, patcher: reverbPatcher });

    //add an event listener to the slider 
    const decayParam = reverbDevice.parametersById.get("decay");
    const revVol = reverbDevice.parametersById.get("revvol");
    const octVol = reverbDevice.parametersById.get("octvol");
    const octDamp = reverbDevice.parametersById.get("octdamp");
    const mix = reverbDevice.parametersById.get("mix");
    const size = reverbDevice.parametersById.get("size");
    const diff = reverbDevice.parametersById.get("diff");
    const jitter = reverbDevice.parametersById.get("jitter");
    const damp = reverbDevice.parametersById.get("damp");
    const pitch = reverbDevice.parametersById.get("pitch");
    const window = reverbDevice.parametersById.get("window");
    const feedback = reverbDevice.parametersById.get("feedback");
    const chorus = reverbDevice.parametersById.get("chorus");
    const pitchVol = reverbDevice.parametersById.get("pitchvol");
    revVol.value = 100;
    octVol.value = 50;
    octDamp.value = 50;
    mix.value = 50;
    decayParam.value = 50;
    size.value = 75;
    diff.value = 100;
    jitter.value = 50;
    damp.value = 20;
    pitch.value = 12;
    window.value = 125;
    feedback.value = 50;
    chorus.value = 50;
    pitchVol.value = 50;

    // Connects the RNBO node to a p5 output node
    myGain.setInput(reverbDevice.node)
    
    // Create a delay effect
    delay = new p5.Delay(0.1, 0.8);
    delay.disconnect();

    // Connect the delay to the reverb
    delay.connect(reverbDevice.node);
    delay.wet(0.75);

    //source.connect(delay);
    mic = new p5.AudioIn();
    mic.disconnect()
    mic.connect(reverbDevice.node);
    myGain.connect(myAnalysis)

    decaySlider.addEventListener("input", function() {
        decayParam.value = decaySlider.value;
    })

    volumeSlider.addEventListener("input", function() {
        mic.amp(volumeSlider.value);
        volume = volumeSlider.value;
    })
    
    pitchSlider.addEventListener("input", function() {
        pitch.value = pitchSlider.value;
    })
    
    octaveVolSlider.addEventListener("input", function() {
        pitchVol.value = octaveVolSlider.value;
    })
}

function draw() {
    let brightness = floor(myAnalysis.getLevel() * 1000)
    starWrap.style.filter = `drop-shadow(0px 2px ${floor(brightness)}px white)`
    let level = constrain(100 - brightness, 49, 100)
    //starWrap.style.opacity = `${level}%`
}

function startMic() {
    if(!mic.started) {
        mic.start();
    }
    else {
        mic.stop();
    }
}

function keyPressed() {
    if (key === '=') {
        console.log("+")
        volume += 0.01;
        if (volume >= 1) {
            volume = 1.0
        }
        volumeSlider.value = volume;
        console.log(volume)
        mic.amp(volume)
    }
    if (key === '-') {
        console.log("-")
        volume -= 0.01;
        if (volume <= 0) {
            volume = 0;
        }
        volumeSlider.value = volume;
        mic.amp(volume)
    }
    
    if (key === 's') {
        if (!mic.started) {
            mic.start();
        }
        else {
            mic.stop();
        }
    }
}