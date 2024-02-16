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
            localStorage.setItem('username', data.username);
            const profileUsername = document.getElementById('profile-username');
            profileUsername.textContent = localStorage.getItem('username');
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

window.addEventListener("load", () => {
    const userToken = localStorage.getItem('token');

    const body = document.body;
    const authPage = document.getElementById('auth-page');
    const homePage = document.getElementById('home-page');
    const profilePage = document.getElementById('profile-page');
    const concealer = document.getElementById('concealer');
    const signInPanel = document.getElementById('sign-in-panel');
    const profileUsername = document.getElementById('profile-username');

    if (userToken) {
        body.style.overflowX = 'hidden';
        body.style.overflowY = 'auto';
        authPage.style.display = 'none';
        homePage.style.display = 'flex';
        profilePage.style.display = 'none';
        concealer.style.top = '0vh';
        concealer.style.left = '50vw';
        signInPanel.style.transform = 'scale(0)';
        profileUsername.textContent = localStorage.getItem('username');

        getPost()
    } else {
        authPage.style.display = 'flex';
        homePage.style.display = 'none';
        profilePage.style.display = 'none';
        concealer.style.top = '0vh';
        concealer.style.left = '50vw';
        signInPanel.style.transform = 'scale(1)';
    }
});

function toggleContainer() {
    const container = document.getElementById('account-settings-container');
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'block';
        const userId = document.getElementById('user-id');
        const rect = userId.getBoundingClientRect(); 
        const containerHeight = container.offsetHeight;
        const offset = 21; 
        container.style.top = (rect.top - containerHeight - offset) + 'px'; 
    } else {
        container.style.display = 'none';
    }
}

function logout() {
    localStorage.clear();
    location.reload();
}

async function postCounter(username) {
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
            const postCount = document.getElementById('post-count');
            
            let postCounter = 0;
            
            for (let i = 0; i < responseData.length; i++) {
                if (responseData[i].postedBy == username) {
                    postCounter++;
                }
            }

            postCount.textContent = `${postCounter} posts`;
        }
    } catch {

    }
}

async function loadProfileInfo() {
    const userToken = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/api/v1/users/${localStorage.getItem('username')}/following`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
        });

        if (response.ok) {
            const responseData = await response.json();

            postCounter(`${localStorage.getItem('username')}`);

            const profileUsername = document.getElementsByClassName('profile-username');
            for (let i = 0; i < profileUsername.length; i++) {
                profileUsername[i].textContent = localStorage.getItem('username');
            }

            const followingCount = document.getElementById('following-count');
            followingCount.textContent = `${responseData.length} Following`;

            const editProfileButton = document.getElementById('edit-profile');
            const followButton = document.getElementById('follow');
            const unfollowButton = document.getElementById('unfollow');
            editProfileButton.style.display = 'flex';
            followButton.style.display = 'none';
            unfollowButton.style.display = 'none';

            const profilePostsContainer = document.getElementById('profile-posts-container');
            const searchedUserPostsContainer = document.getElementById('searched-user-posts-container');
            profilePostsContainer.style.display = 'flex';
            searchedUserPostsContainer.style.display = 'none';
        }
    } catch {

    }
}

var homePageButton = document.getElementById('home-page-button');
homePageButton.addEventListener('click', function () {
    const profilePage = document.getElementById('profile-page');
    const timelinePage = document.getElementById('timeline-page');

    profilePage.style.display = 'none';
    timelinePage.style.display = 'flex';
});

var profilePageButton = document.getElementById('profile-page-button');
profilePageButton.addEventListener('click', function () {
    loadProfileInfo();

    const profilePage = document.getElementById('profile-page');
    const timelinePage = document.getElementById('timeline-page');

    profilePage.style.display = 'flex';
    timelinePage.style.display = 'none';
});

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
                if (responseData[i].postedBy == localStorage.getItem('username')) {
                    createPostPanel(responseData[i], 'user-profile');
                }
            }

            postCounter(`${localStorage.getItem('username')}`);

            for (let i = 0; i < responseData.length; i++) {
                createPostPanel(responseData[i], 'timeline-onload');
            }
        }
    } catch {

    }
}

var createPostTextarea = document.getElementById('create-post-textarea');

createPostTextarea.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});

function calculateTimeElapsed(dateTimePosted) {
    const postDate = new Date(dateTimePosted);
    const currentDate = new Date();

    const timeDifference = currentDate - postDate;
    const hoursElapsed = Math.floor(timeDifference / (1000 * 60 * 60));

    return `· ${hoursElapsed}h`;
}

function createPostPanel(responseData, page) {
    const postPanel = `
        <div id="post-panel" class="post-panel">
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
                    <img src="assets/like.png" onclick="togglePostLike('${responseData.postId}')">
                    <img src="assets/statistics.png">
                </div>
            </div>
        </div>
    `;

    if (page == 'timeline-onload') {
        document.getElementById('timeline-posts-container').insertAdjacentHTML('afterbegin', postPanel);
    } else if (page == 'timeline') {
        document.getElementById('timeline-posts-container').insertAdjacentHTML('afterbegin', postPanel);
        document.getElementById('profile-posts-container').insertAdjacentHTML('afterbegin', postPanel);
    } else if (page == 'user-profile') {
        document.getElementById('profile-posts-container').insertAdjacentHTML('afterbegin', postPanel);
    } else if (page == 'searchedUser-profile') {
        document.getElementById('searched-user-posts-container').insertAdjacentHTML('afterbegin', postPanel);
    }
}

async function createPost() {
    const userToken = localStorage.getItem('token');
    const textAreaValue = document.getElementById('create-post-textarea').value;

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
            alert('Liked post!');
        }
    } catch {

    }
}

async function unlikePost(postId) {
    const userToken = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/api/v1/posts/${postId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({
                "action": "unlike"
            })
        });

        if (response.ok) {
            alert('Unliked post!');
        }
    } catch {

    }
}

async function togglePostLike(postId) {
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
                if (responseData[i].postId == postId) {
                    if (responseData[i].likes.includes(localStorage.getItem('username'))) {
                        await unlikePost(postId);
                    } else {
                        likePost(postId);
                    }
                }
            }
        }
    } catch {

    }
}

var searchInput = document.getElementById('search-input');
searchInput.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();

        const usernameToSearch = searchInput.value.trim();

        if (usernameToSearch !== '') {
            searchUser(usernameToSearch);
        }
    }
});

async function searchUser(username) {
    const userToken = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:3000/api/v1/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
        });

        if (response.ok) {
            const responseData = await response.json();

            if (username == localStorage.getItem('username')) {
                loadProfileInfo();

                const profilePage = document.getElementById('profile-page');
                const timelinePage = document.getElementById('timeline-page');

                profilePage.style.display = 'flex';
                timelinePage.style.display = 'none';
            } else if (responseData.includes(username)) {
                showUserProfile(username);

                const profilePage = document.getElementById('profile-page');
                const timelinePage = document.getElementById('timeline-page');

                profilePage.style.display = 'flex';
                timelinePage.style.display = 'none';
            } else {
                alert(`Username "${username}" was not found!`);
            }
        }
    } catch {

    }
}

async function isUserFollowed(username) {
    const userToken = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/api/v1/users/${localStorage.getItem('username')}/following`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
        });

        if (response.ok) {
            const responseData = await response.json();

            return responseData.includes(username);
        } else {
            return false;
        }
    } catch {
        return false;
    }
}

async function showUserProfile(username) {
    const userToken = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/api/v1/users/${username}/following`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
        });

        if (response.ok) {
            const responseData = await response.json();

            const postCount = document.getElementById('post-count');
            postCount.textContent = 'hidden';

            const profileUsername = document.getElementsByClassName('profile-username');
            for (let i = 0; i < profileUsername.length; i++) {
                profileUsername[i].textContent = username;
            }
            
            const followingCount = document.getElementById('following-count');
            followingCount.textContent = `${responseData.length} Following`;

            const editProfileButton = document.getElementById('edit-profile');
            editProfileButton.style.display = 'none';

            const followButton = document.getElementById('follow');
            const unfollowButton = document.getElementById('unfollow');

            const profilePostsContainer = document.getElementById('profile-posts-container');
            const searchedUserPostsContainer = document.getElementById('searched-user-posts-container');
            profilePostsContainer.style.display = 'none';

            while (searchedUserPostsContainer.firstChild) {
                searchedUserPostsContainer.removeChild(searchedUserPostsContainer.firstChild);
            }

            if (await isUserFollowed(username)) {
                followButton.style.display = 'none';
                unfollowButton.style.display = 'flex';

                searchedUserPostsContainer.style.display = 'flex';

                showUserPosts(username);
            } else {
                followButton.style.display = 'flex';
                unfollowButton.style.display = 'none';

                searchedUserPostsContainer.style.display = 'none';
            }
        }
    } catch {

    }
}

async function showUserPosts(username) {
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
                if (responseData[i].postedBy == username) {
                    createPostPanel(responseData[i], 'searchedUser-profile');
                }
            }

            postCounter(username);
        }
    } catch {

    }
}

async function followUser() {
    const userToken = localStorage.getItem('token');
    const profileUsername = document.getElementsByClassName('profile-username');

    try {
        const response = await fetch(`http://localhost:3000/api/v1/users/${localStorage.getItem('username')}/following/${profileUsername[0].textContent}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
        });

        if (response.ok) {
            const followButton = document.getElementById('follow');
            const unfollowButton = document.getElementById('unfollow');
            followButton.style.display = 'none';
            unfollowButton.style.display = 'flex';

            showUserPosts(`${profileUsername[0].textContent}`);

            const searchedUserPostsContainer = document.getElementById('searched-user-posts-container');
            searchedUserPostsContainer.style.display = 'flex';
        }
    } catch {

    }
}

async function unfollowUser() {
    const profileUsername = document.getElementsByClassName('profile-username');
    const userToken = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/api/v1/users/${localStorage.getItem('username')}/following/${profileUsername[0].textContent}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
        });

        if (response.ok) {
            const postCount = document.getElementById('post-count');
            postCount.textContent = 'hidden';
            
            const followButton = document.getElementById('follow');
            const unfollowButton = document.getElementById('unfollow');
            followButton.style.display = 'flex';
            unfollowButton.style.display = 'none';

            const searchedUserPostsContainer = document.getElementById('searched-user-posts-container');
            searchedUserPostsContainer.style.display = 'none';

            while (searchedUserPostsContainer.firstChild) {
                searchedUserPostsContainer.removeChild(searchedUserPostsContainer.firstChild);
            }
        }
    } catch {

    }
}
