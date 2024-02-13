history.scrollRestoration = "manual";

function toggleConcealer() {
    const concealer = document.getElementById('concealer');
    const signInPanel = document.getElementById('sign-in-panel');
    const signUpPanel = document.getElementById('sign-up-panel');

    if (this.id == 'sign-up') {
        concealer.style.top = '-100vh';
        concealer.style.left = '-50vw';
        signInPanel.style.transform = 'scale(0)';
        signUpPanel.style.transform = 'scale(1)';
    } else {
        concealer.style.top = '0vh';
        concealer.style.left = '50vw';
        signInPanel.style.transform = 'scale(1)';
        signUpPanel.style.transform = 'scale(0)';
    }
}

var createPostTextarea = document.getElementById('create-post-textarea');

createPostTextarea.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});

window.addEventListener("load", () => {
    const concealer = document.getElementById('concealer');
    const signInPanel = document.getElementById('sign-in-panel');
    const homePage = document.getElementById('home-page');
    const profilePage = document.getElementById('profile-page');

    homePage.style.display = 'none';
    profilePage.style.display = 'none';
    concealer.style.top = '0vh';
    concealer.style.left = '50vw'
    signInPanel.style.transform = 'scale(1)';
});

const homePageButton = document.getElementById('home-page-button');
homePageButton.addEventListener('click', function () {
    const profilePage = document.getElementById('profile-page');
    const timelinePage = document.getElementById('timeline-page');

    profilePage.style.display = 'none';
    timelinePage.style.display = 'flex';
});

const profilePageButton = document.getElementById('profile-page-button');
profilePageButton.addEventListener('click', function () {
    const profilePage = document.getElementById('profile-page');
    const timelinePage = document.getElementById('timeline-page');

    profilePage.style.display = 'flex';
    timelinePage.style.display = 'none';
});

var signInButton = document.getElementById('sign-in');
var signUpButton = document.getElementById('sign-up');

signInButton.addEventListener('click', toggleConcealer);
signUpButton.addEventListener('click', toggleConcealer);

function switchPages(showAuthPage) {
    const authPage = document.getElementById('auth-page');
    const homePage = document.getElementById('home-page');
    const body = document.body;

    if (showAuthPage) {
        authPage.style.display = 'flex';
        homePage.style.display = 'none';
        body.style.overflow = 'hidden';
    } else {
        authPage.style.display = 'none';
        homePage.style.display = 'flex';
        body.style.overflowX = 'hidden';
        body.style.overflowY = 'auto';
    }
}

async function signInApi(data) {
    try {
        const response = await fetch('http://localhost:3000/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const token = await response.text();
            localStorage.setItem('token', token);
            switchPages(false);
        } else {
            alert("Invalid username or incorrect password!");
            const errorData = await response.json();
            console.error(errorData);
        }
    } catch (error) {
        console.error('Sign In Error -', error);
    }
}

function signIn(event) {
    event.preventDefault();

    const username = document.getElementById('sign-in-username').value;
    const password = document.getElementById('sign-in-password').value;

    const signInData = {
        "username": username,
        "password": password
    };

    signInApi(signInData);
}

async function signUpApi(data) {
    try {
        const response = await fetch('http://localhost:3000/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            signInApi(data);
        } else {
            alert("User already exists!");
            const errorData = await response.json();
            console.error(errorData);
        }
    } catch (error) {
        console.error('Sign Up Error -', error);
    }
}

function signUp(event) {
    event.preventDefault();
    
    const password = document.getElementById('sign-up-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match. Please re-enter your password.");
    } else {
        const username = document.getElementById('sign-up-username').value;
        
        const signUpData = {
            "username": username,
            "password": password
        };

        signUpApi(signUpData);
    }
}
