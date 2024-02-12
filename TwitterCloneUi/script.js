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

var signInButton = document.getElementById('sign-in');
var signUpButton = document.getElementById('sign-up');

window.addEventListener("load", () => {
    const concealer = document.getElementById('concealer');
    const signInPanel = document.getElementById('sign-in-panel');
    const homePage = document.getElementById('home-page');

    homePage.style.display = 'none';
    concealer.style.top = '0vh';
    concealer.style.left = '50vw'
    signInPanel.style.transform = 'scale(1)';
});

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
            alert("User not found! Try signing up first");
            const errorData = await response.json();
            console.error(errorData);
        }
    } catch (error) {
        console.error('Sign In Error -', error);
    }
}

function signIn() {
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

function signUp() {
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
