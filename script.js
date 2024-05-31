var isLoggedIn = localStorage.getItem('isLoggedIn') == 'true' ? true : false;
const loginBtn = document.getElementById('login');
const logoutBtn = document.getElementById('logout');
const registerBtn = document.getElementById('register');
const userNameText = document.getElementById('userName');

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const mainContent = document.getElementById('mainContent');


loginBtn.addEventListener('click', function(){
    loginForm.style.display = '';
    registerForm.style.display = 'none';
    mainContent.style.display = 'none';
});

logoutBtn.addEventListener('click', function(){
    logout();
});

registerBtn.addEventListener('click', function(){
    registerForm.style.display = '';
    loginForm.style.display = 'none';
    mainContent.style.display = 'none';
});


registerForm.addEventListener('submit', function(e){
    e.preventDefault();
    register();
});

loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    login();
});


var userName = 'No name';

if(isLoggedIn){
    userName = localStorage.getItem('userName');
    fetch('userdata.json')
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        
        var userData = data.users;
        //console.log(userData);

        var found = false;
        
        for(var i = 0; i < userData.length; i++){
            if(userData[i].username == userName){
                found = true;
                break;
            }
        }

        if(!found){
            isLoggedIn = false;
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.setItem('userName', '');
            var image = document.querySelector('.centered-image');
            image.classList.remove('hide');
        }
        else{
            var image = document.querySelector('.centered-image');
            image.classList.add('hide');
        }
        init();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
else{
    var image = document.querySelector('.centered-image');
    image.classList.remove('hide');

}

init();



document.addEventListener('keydown', function(event) {
    if (event.key === 'b') {
        let randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        let ball = document.getElementById('ball');
        ball.style.color = randomColor;

        let computedStyle = window.getComputedStyle(ball);
        let rgbColor = computedStyle.color;

        // Convert the rgb color to hsv
        let hsvColor = rgbToHsv(rgbColor);

        // Check if the hue is in the range for blue
        if (hsvColor.h >= 200 && hsvColor.h <= 260) {
            alert("The color of LONDON!");
        }
    }
});

function rgbToHsv(rgbColor) {
    let rgb = rgbColor.match(/\d+/g);
    let r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;

    let d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h * 360, s: s * 100, v: v * 100 };
}

function init(){
    console.log('init');
    if(isLoggedIn){
        loginBtn.style.display = 'none';
        logoutBtn.style.display = '';
        registerBtn.style.display = 'none';
        userNameText.innerHTML = 'Hello, ' + userName;

        mainContent.style.display = '';
        registerForm.style.display = 'none';
        loginForm.style.display = 'none';
    }else{
        loginBtn.style.display = '';
        logoutBtn.style.display = 'none';
        registerBtn.style.display = '';
        userNameText.innerHTML = 'You are not logged in!';

        mainContent.style.display = 'none';
        registerForm.style.display = 'none';
        loginForm.style.display = 'none';
    }
}

function login(){
    //Get the username and password from the form
    var username = document.getElementById('loginUsername').value;
    var password = document.getElementById('loginPassword').value;

    fetch('userdata.json')
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        
        var userData = data.users;
        //console.log(userData);
        
        for(var i = 0; i < userData.length; i++){
            if(userData[i].username == username && userData[i].password == password){
                isLoggedIn = true;
                userName = username;
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', userName);
                init();
                return;
            }
        }
        window.location.href = '404page.html';
        alert('Invalid username or password!');
    })
    .catch(error => {
        console.error('Error:', error);

        //Load the 404page.html
        window.location.href = '404page.html';
    });
    var image = document.querySelector('.centered-image');
    image.classList.add('hide');
}

function logout(){
    console.log('logout');
    isLoggedIn = false;
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.setItem('userName', '');
    var image = document.querySelector('.centered-image');
    image.classList.remove('hide');
    init();
}

function register(){
    var username = document.getElementById('registerUsername').value;
    var password = document.getElementById('registerPassword').value;
    var email = document.getElementById('registerEmail').value;
    var phone = document.getElementById('registerPhoneNumber').value;

    fetch('userdata.json')
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        
        var userData = data.users;
        //console.log(userData);
        
        for(var i = 0; i < userData.length; i++){
            if(userData[i].username == username){
                alert('Username already exists!');
                return;
            }
            if(userData[i].email == email){
                alert('Email already exists!');
                return;
            }
        }

        var newUser = {
            "username": username,
            "password": password,
            "email": email,
            "phoneNumber": phone,
        };

        userData.push(newUser);

        var newData = {
            "users": userData
        };

        fetch('userdata.json', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            if (data) {
                data = JSON.parse(data);
                console.log('Success:', data);
            }
        
            isLoggedIn = true;
            userName = username;
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', userName);
            init();
        })
        .catch((error) => {
            console.error('Error:', error);
            //Load the 404page.html
            window.location.href = '404page.html';
        });


    })
    .catch(error => {
        console.error('Error:', error);

        //Load the 404page.html
        window.location.href = '404page.html';
    });
}

