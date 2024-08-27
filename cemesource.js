// ==UserScript==
// @name         CEME lite dev build with Enhanced Theme Management
// @namespace    http://tampermonkey.net/
// @version      1.9.5
// @description  Enhance your EmeraldChat experience with a sleek, animated UI, customizable themes stored in session storage, and a popup menu for selecting themes.
// @author       Your Name
// @match        https://emeraldchat.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(function() {
    'use strict';

    let latestChannelId = null;

    // Welcome to CEME lite open source feel free to expand on this as I'll be gone for a while.
    // You can also double check through all the code here in case you're cautious about using scripts.
    GM_addStyle(`
        @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
        }

        #floatingMenu {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            background-color: #1a1a2e;
            color: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border-radius: 12px;
            z-index: 1001;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: Arial, sans-serif;
            font-size: 14px;
            animation: fadeIn 0.6s ease-in-out;
        }

        #floatingMenu h2 {
            margin-bottom: 10px;
            font-size: 18px;
            text-align: center;
            color: #00ffcc;
        }

        #floatingMenu p {
            margin-bottom: 20px;
            font-size: 12px;
            text-align: center;
            color: #aaaaaa;
        }

        #floatingMenu button {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s, transform 0.2s;
            animation: fadeIn 0.4s ease-in-out;
        }

        #floatingMenu button:hover {
            transform: translateY(-2px);
        }

        #executor-btn {
            background-color: #007bff;
        }

        #executor-btn:hover {
            background-color: #0056b3;
        }

        #ceme-btn {
            background-color: #28a745;
        }

        #ceme-btn:hover {
            background-color: #218838;
        }

        #open-themes-btn {
            background-color: #444;
        }

        #open-themes-btn:hover {
            background-color: #555;
        }

        #add-theme-btn {
            background-color: #7289da;
        }

        #add-theme-btn:hover {
            background-color: #99aab5;
        }

        #theme-popup, #theme-select-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            padding: 20px;
            width: 80%;
            max-width: 400px;
            color: white;
            z-index: 1003;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            animation: fadeIn 0.6s ease-in-out;
            display: none;
        }

        #theme-popup h2, #theme-select-popup h2 {
            font-size: 18px;
            margin-bottom: 15px;
            text-align: center;
            color: #00ffcc;
        }

        #theme-popup input, #theme-popup textarea, #theme-select-popup .theme-option {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            background-color: #333;
            color: white;
            border-radius: 5px;
            border: none;
            font-size: 14px;
        }

        #theme-popup button, #theme-select-popup button {
            width: 100%;
            padding: 10px;
            background: linear-gradient(to right, #007bff, #6610f2);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
        }

        #theme-popup button:hover, #theme-select-popup button:hover {
            background-color: #4e33cc;
        }

        .theme-option {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            transition: background-color 0.3s;
            text-align: center;
        }

        .theme-option:hover {
            background-color: #555;
        }

        .delete-theme-btn {
            background-color: #ff4d4d;
            border: none;
            border-radius: 5px;
            color: white;
            cursor: pointer;
            padding: 5px 10px;
            font-size: 12px;
            margin-left: 10px;
            transition: background-color 0.3s;
        }

        .delete-theme-btn:hover {
            background-color: #ff1a1a;
        }

        #custom-alert {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #333;
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            z-index: 1004;
            font-family: Arial, sans-serif;
            display: none;
        }

        #custom-alert p {
            margin: 0;
            font-size: 14px;
        }

        #scriptExecutor, #userSelectionUI, #votingUI {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            padding: 20px;
            width: 80%;
            max-width: 400px;
            color: white;
            z-index: 1002;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            animation: fadeIn 0.6s ease-in-out;
        }

        #scriptExecutor h1, #votingUI h3 {
            font-size: 18px;
            margin-bottom: 15px;
            text-align: center;
            color: #00ffcc;
        }

        #script-content {
            width: 100%;
            padding: 10px;
            background-color: #333;
            color: white;
            border-radius: 5px;
            border: none;
            font-size: 14px;
            margin-bottom: 15px;
        }

        #execute-script {
            width: 100%;
            padding: 10px;
            background: linear-gradient(to right, #007bff, #6610f2);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
            animation: slideIn 0.4s ease-in-out;
        }

        #execute-script:hover {
            background-color: #4e33cc;
        }

        #userSelectionUI div, #votingUI button {
            padding: 8px;
            margin-bottom: 8px;
            background-color: #444;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background-color 0.3s, transform 0.2s;
        }

        #userSelectionUI div:hover, #votingUI button:hover {
            background-color: #555;
            transform: translateX(3px);
        }

        #upvote-btn {
            background-color: #28a745;
        }

        #downvote-btn {
            background-color: #ff0000;
        }
    `);

    // Inject the floating menu and custom alert
    $('body').append(`
        <div id="floatingMenu">
            <h2>C:\\EME lite</h2>
            <p id="status">Disconnected</p>
            <button id="executor-btn">Script Executor</button>
            <button id="ceme-btn">Fetch Users</button>
            <button id="open-themes-btn">Select Theme</button>
            <button id="add-theme-btn">Add New Theme</button>
        </div>

        <div id="theme-popup">
            <h2>Add New Theme</h2>
            <input type="text" id="theme-name" placeholder="Theme Name" />
            <textarea id="theme-css" placeholder="Enter your custom CSS here..."></textarea>
            <button id="save-theme">Save Theme</button>
        </div>

        <div id="theme-select-popup">
            <h2>Select a Theme</h2>
            <div id="theme-options"></div>
            <button id="close-theme-select">Close</button>
        </div>

        <div id="custom-alert">
            <p id="custom-alert-text"></p>
        </div>
    `);

    // Custom alert function
    function showAlert(message, duration = 3000) {
        $('#custom-alert-text').text(message);
        $('#custom-alert').fadeIn();

        setTimeout(() => {
            $('#custom-alert').fadeOut();
        }, duration);
    }

    // Load saved themes from session storage
    function loadThemes() {
        const themes = JSON.parse(sessionStorage.getItem('customThemes')) || {};
        const themeOptions = $('#theme-options');
        themeOptions.empty();
        for (const [name, css] of Object.entries(themes)) {
            themeOptions.append(`
                <div class="theme-option" data-name="${name}">
                    <span>${name}</span>
                    <button class="delete-theme-btn" data-name="${name}">Delete</button>
                </div>
            `);
        }
    }

    // Save a new theme
    function saveTheme(name, css) {
        const themes = JSON.parse(sessionStorage.getItem('customThemes')) || {};
        themes[name] = css;
        sessionStorage.setItem('customThemes', JSON.stringify(themes));
        loadThemes();
        showAlert('Theme saved successfully!');
    }

    // Apply the selected theme
    function applyCustomTheme(css) {
        const style = document.createElement('style');
        style.id = 'custom-theme';

        style.textContent = css;

        // Remove any existing custom theme
        const existingStyle = document.getElementById('custom-theme');
        if (existingStyle) {
            existingStyle.remove();
        }

        // Apply the new custom theme
        document.head.appendChild(style);
        showAlert('Theme applied successfully!');
    }

    // Event handler for opening the theme selection popup
    $('#open-themes-btn').on('click', function() {
        $('#theme-select-popup').fadeIn();
    });

    // Event handler for closing the theme selection popup
    $('#close-theme-select').on('click', function() {
        $('#theme-select-popup').fadeOut();
    });

    // Event handler for applying a theme from the selection popup
    $(document).on('click', '.theme-option span', function() {
        const selectedTheme = $(this).closest('.theme-option').data('name');
        const themes = JSON.parse(sessionStorage.getItem('customThemes')) || {};
        if (selectedTheme && themes[selectedTheme]) {
            applyCustomTheme(themes[selectedTheme]);
            $('#theme-select-popup').fadeOut();
        } else {
            showAlert('Failed to apply theme.', 4000);
        }
    });

    // Event handler for deleting a theme
    $(document).on('click', '.delete-theme-btn', function() {
        const themeName = $(this).data('name');
        const themes = JSON.parse(sessionStorage.getItem('customThemes')) || {};
        if (themeName && themes[themeName]) {
            delete themes[themeName];
            sessionStorage.setItem('customThemes', JSON.stringify(themes));
            loadThemes();
            showAlert('Theme deleted successfully!');
        } else {
            showAlert('Failed to delete theme.', 4000);
        }
    });

    // Show the theme addition popup
    $('#add-theme-btn').on('click', function() {
        $('#theme-popup').fadeIn();
    });

    // Save the theme from the popup form
    $('#save-theme').on('click', function() {
        const name = $('#theme-name').val().trim();
        const css = $('#theme-css').val().trim();
        if (name && css) {
            saveTheme(name, css);
            $('#theme-popup').fadeOut();
        } else {
            showAlert('Please provide both a theme name and CSS.', 4000);
        }
    });

    // Load saved themes on page load
    loadThemes();

    // Close popup when clicking outside of it
    $(document).on('click', function(event) {
        if ($(event.target).closest('#theme-popup, #add-theme-btn').length === 0) {
            $('#theme-popup').fadeOut();
        }
        if ($(event.target).closest('#theme-select-popup, #open-themes-btn').length === 0) {
            $('#theme-select-popup').fadeOut();
        }
    });

    // Event handler for Script Executor button
    $('#executor-btn').on('click', function() {
        if ($('#scriptExecutor').length) {
            $('#scriptExecutor').remove();
            $('#executor-btn').text('Script Executor');
            $('#status').text('Disconnected');
        } else {
            $('body').append(`
                <div id="scriptExecutor">
                    <h1>Script Executor</h1>
                    <textarea id="script-content" rows="8" placeholder="Write your script here..."></textarea>
                    <button id="execute-script">Execute Script</button>
                </div>
            `);

            $('#executor-btn').text('Close Executor');
            $('#status').text('Connected');

            $('#execute-script').on('click', function() {
                try {
                    eval($('#script-content').val());
                    showAlert('Script executed successfully!');
                } catch (error) {
                    showAlert('Error executing script: ' + error.message, 5000);
                }
            });
        }
    });

    // Event handler for Fetch Users button
    $('#ceme-btn').on('click', function() {
        if (latestChannelId) {
            fetchUserData();
        } else {
            showAlert('Channel ID not detected yet. Please wait and try again.', 4000);
        }
    });

    // Function to dynamically detect channel ID from network requests
    const observer = new MutationObserver(() => {
        const requests = performance.getEntriesByType('resource');
        for (const request of requests) {
            const url = new URL(request.name);
            if (url.pathname === '/channel_json' && url.searchParams.has('id')) {
                const id = url.searchParams.get('id');
                if (id && id !== latestChannelId) {
                    latestChannelId = id;
                    console.log('Updated latest channel ID:', latestChannelId);
                }
            }
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });

    // Function to fetch user data
    function fetchUserData() {
        const url = `https://emeraldchat.com/channel_json?id=${latestChannelId}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data && data.members) {
                    displayUserSelectionUI(data.members.map(member => ({
                        id: member.id,
                        name: member.display_name
                    })));
                } else {
                    showAlert('No users found.', 4000);
                }
            },
            onerror: function() {
                showAlert('Error fetching user data.', 4000);
            }
        });
    }

    // Function to display user selection UI
    function displayUserSelectionUI(users) {
        if ($('#userSelectionUI').length) $('#userSelectionUI').remove();

        const userElements = users.map(user => `<div data-id="${user.id}">${user.name} (${user.id})</div>`).join('');

        $('body').append(`
            <div id="userSelectionUI">
                <h1>Select User</h1>
                ${userElements}
                <button id="close-fetch-users" style="width:100%;padding:10px;">Close</button>
            </div>
        `);

        $('#userSelectionUI div').on('click', function() {
            const userId = $(this).data('id');
            openVotingUI(userId, $(this).text());
        });

        // Event handler to close the user selection UI
        $('#close-fetch-users').on('click', function() {
            $('#userSelectionUI').remove();
        });
    }

    // Function to display the voting UI
    function openVotingUI(userId, userName) {
        if ($('#votingUI').length) $('#votingUI').remove();

        $('body').append(`
            <div id="votingUI">
                <h3>Vote for ${userName}</h3>
                <button id="upvote-btn">Upvote</button>
                <button id="downvote-btn">Downvote</button>
            </div>
        `);

        $('#upvote-btn').on('click', function() {
            sendVote(userId, 1);
        });

        $('#downvote-btn').on('click', function() {
            sendVote(userId, -1);
        });
    }

    // Function to send a vote
    function sendVote(userId, polarity) {
        const url = `https://emeraldchat.com/karma_give?id=${userId}&polarity=${polarity}`;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                if (response.status === 204) {
                    showAlert('Vote sent successfully.');
                    if ($('#votingUI').length) $('#votingUI').remove();
                } else {
                    showAlert('Failed to send vote.', 4000);
                }
            },
            onerror: function() {
                showAlert('Error sending vote.', 4000);
            }
        });
    }
})();
