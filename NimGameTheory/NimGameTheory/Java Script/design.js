//make the cover disappear
window.onload = function() {
    const cover = document.querySelector('.cover');
    const game = document.querySelector('.game');
    setTimeout(function() {
        cover.style.opacity = 0;
    }, 700);
    setTimeout(function() {
        cover.style.display = 'none';
        game.style.display = 'block';
    }, 1500);
}
function navigateToAnotherPage() {
    window.location.href = "Intro-page.html";
}
//sound functions
function playClickSound() {
    var audio = document.getElementById("clickSound1");
    if (audio.readyState >= 2) {
        audio.currentTime = 0;
        audio.play();
    } else {
        audio.addEventListener('canplay', function() {
            audio.currentTime = 0;
            audio.play();
        });
    }
}

function playClickSound1() {
    var audio = document.getElementById("clickSound2");
    if (audio.readyState >= 2) {
        audio.currentTime = 0;
        audio.play();
    } else {
        audio.addEventListener('canplay', function() {
            audio.currentTime = 0;
            audio.play();
        });
    }
}