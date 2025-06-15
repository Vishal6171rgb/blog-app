const postsContainer = document.getElementById('posts');
const postForm = document.getElementById('postForm');

// Change this to your deployed Render backend
const BASE_URL = 'https://blog-app-eat2.onrender.com';

let posts = [];

// Fetch and display posts from server on page load
async function fetchPosts() {
    try {
        const res = await fetch(`${BASE_URL}/posts`);
        posts = await res.json();
        displayPosts();
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Display posts in the DOM
function displayPosts() {
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <button onclick="deletePost(${post.id})">Delete</button>
        `;
        postsContainer.appendChild(postElement);
    });
}

// Add post via API
async function addPost(post) {
    try {
        const res = await fetch(`${BASE_URL}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post),
        });
        if (res.ok) {
            fetchPosts(); // Refresh posts after adding
            postForm.reset();
        } else {
            alert('Failed to add post');
        }
    } catch (error) {
        console.error('Error adding post:', error);
    }
}

// Delete post via API
async function deletePost(id) {
    try {
        const res = await fetch(`${BASE_URL}/posts/${id}`, {
            method: 'DELETE',
        });
        if (res.ok) {
            fetchPosts(); // Refresh posts after deletion
        } else {
            alert('Failed to delete post');
        }
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

// Form submit event listener
postForm.addEventListener('submit', event => {
    event.preventDefault();
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();

    if (!title || !content) {
        alert('Please fill in both fields');
        return;
    }

    addPost({ title, content });
});

// Load posts on page load
fetchPosts();

// Make deletePost globally accessible for inline onclick in generated HTML
window.deletePost = deletePost;
