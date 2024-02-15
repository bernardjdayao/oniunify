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

async function createPost() {
    const textAreaValue = document.getElementById('create-post-textarea').value
    const userToken = localStorage.getItem('token');
    const postData = {
        "content": textAreaValue
    }

    try {
        const response = await fetch('http://localhost:3000/api/v1/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify(postData),
        });

        if (response.ok) {
            const responseData = await response.json();
            createPostPanel(responseData, 'timeline');
        } else {

        }
    } catch {

    }
}

function calculateTimeElapsed(dateTimePosted) {
    const postDate = new Date(dateTimePosted);
    const currentDate = new Date();

    const timeDifference = currentDate - postDate;
    const hoursElapsed = Math.floor(timeDifference / (1000 * 60 * 60));

    return `• ${hoursElapsed}h`;
}

function createPostPanel(responseData, page) {
    const postPanel = `
        <div id="post-panel-${responseData.postId}" class="post-panel">
            <div class="post-panel-left">
                <img src="assets/profile.png" alt="Profile Icon" />
            </div>
            <div class="post-panel-right">
                <div class="post-user-info">
                    <p id="user-id" style="margin-right: 10px;"><b>${responseData.postedBy}</b></p>
                    <p id="handle" style="margin-right: 5px;">@handle</p>
                    <p id="time-posted">${calculateTimeElapsed(responseData.dateTimePosted)}</p>
                </div>
                <div id="post">
                    <p style="margin: 0px 20px 0px 20px;">${responseData.content}</p>
                </div>
                <div class="post-panel-buttons">
                    <img src="assets/comments.png">
                    <img src="assets/retweet.png">
                    <img src="assets/like.png" id="button-${responseData.postId}" onclick="likePost('${responseData.postId}')">
                    <img src="assets/statistics.png">
                </div>
            </div>
        </div>
    `;

    if (page == 'timeline') {
        document.getElementById('timeline-posts-container').insertAdjacentHTML('afterbegin', postPanel);
        document.getElementById('profile-posts-container').insertAdjacentHTML('afterbegin', postPanel);
    } else if (page == 'profile'){
        document.getElementById('profile-posts-container').insertAdjacentHTML('afterbegin', postPanel);
    }
    
}

async function getPost() {
    const userToken = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:3000/api/v1/posts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
        });

        if (response.ok) {
            const responseData = await response.json();
            
            for (let i = 0; i < responseData.length; i++) {
                createPostPanel(responseData[i], 'profile');
            }
        } else {

        }
    } catch {

    }
}

async function likePost(postId) {
    const userToken = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/api/v1/posts/${postId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({
                "action": "like"
            })
        });

        if (response.ok) {
            console.log('edi wow');
        } else {
            console.log(postId);
        }
    } catch {
        console.log(postId);
    }
}

window.addEventListener("load", () => {
    const concealer = document.getElementById('concealer');
    const signInPanel = document.getElementById('sign-in-panel');
    const homePage = document.getElementById('home-page');
    const profilePage = document.getElementById('profile-page');

    /*homePage.style.display = 'none';*/
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
            getPost();
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
