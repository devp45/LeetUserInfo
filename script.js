document.addEventListener('DOMContentLoaded', function(){


    const usernameInput = document.getElementById('user-input');
    const searchButton = document.getElementById('search-btn');
    const statsContainer = document.querySelector('.stats-container');
    const easyProgressCircle = document.querySelector('.easy-progress');
    const mediumProgressCircle = document.querySelector('.medium-progress');
    const hardProgressCircle = document.querySelector('.hard-progress');
    const easyLabel = document.querySelector('.easy-label');
    const mediumLabel = document.querySelector('.medium-label');
    const hardLabel = document.querySelector('.hard-label');
    const userContainer = document.querySelector('.user-container');
    const cardStatsContainer = document.querySelector('.stats-card');

    //return true if username is valid else false
    function validateUsername(username){
        if(username.trim() === ""){
            alert("Please enter a username");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        if(!regex.test(username)){
            alert("Username must be alphanumeric and between 1 and 15 characters");
            return false;
        }
        return true;
    }
    
    async function fetchUserDetails(username){
        const url =`https://leetcode-stats-api.herokuapp.com/${username}`;
        try{

            searchButton.innerText = "Loading...";
            searchButton.disabled = true;
            
            const response = await fetch(url);
            if(!response.ok){
                throw new Error("Failed to fetch user details");
            }
            const data = await response.json();
            console.log("Login Details: ", data);
            return data;
        }
        catch(error){
            statsContainer.innerText = "Error fetching user details";
        }
        finally{
            searchButton.innerText = "Search";
            searchButton.disabled = false;
        }
    }


    function setProgress(progressClass, percentage) {
        // Calculate degree (percentage of 360 degrees for the circle)
        const degree = (percentage / 100) * 360;
        
        // Update the CSS variable for the specific circle
        document.querySelector(progressClass).style.setProperty('--progress-degree', degree + 'deg');
        
        // Update the label to show the percentage
        document.querySelector(progressClass ).innerText = `${percentage} %`;

    }

    function generateCardStats(easyPercentage, mediumPercentage, hardPercentage){
        return `
            <div class="stats-card">
                <div class="easy-progressT">
                    <p>Easy</p>
                </div>
                <div class="medium-progressT">
                    <p>Medium</p>
                </div>
                <div class="hard-progressT">
                    <p>Hard</p>
                </div>
            </div>
        `
    }

    searchButton.addEventListener('click', function(){
        const username = usernameInput.value;
        console.log("Username: ", username);
        if(validateUsername(username)){
            const userDetails = fetchUserDetails(username);
            userDetails.then(data => {
                console.log("User Details: ", data);
                if(data.status === 'success'){
                    const {easySolved, mediumSolved, hardSolved,  totalEasy, totalMedium, totalHard} = data;

                    const e= ((easySolved / totalEasy) * 100);
                    const m = (mediumSolved / totalMedium) * 100;
                    const h = (hardSolved / totalHard )* 100;

                    const easyPercentage = Math.floor(e);
                    const mediumPercentage = Math.floor(m);
                    const hardPercentage = Math.floor(h);
                    

                    // easyProgressCircle.innerText = `${easyPercentage } %`;
                    // mediumProgressCircle.innerText = `${mediumPercentage} %`;
                    // hardProgressCircle.innerText = `${hardPercentage} %`;

                    setProgress('.easy-progress', easyPercentage);
                    setProgress('.medium-progress', mediumPercentage);
                    setProgress('.hard-progress',hardPercentage);

                    cardStatsContainer.innerHTML = generateCardStats(easyPercentage, mediumPercentage, hardPercentage);

                    // Update text labels
                    // document.getElementById('easy-label').innerText = `${easyPercentage.toFixed(1)}%`;
                    // document.getElementById('medium-label').innerText = `${mediumPercentage.toFixed(1)}%`;
                    // document.getElementById('hard-label').innerText = `${hardPercentage.toFixed(1)}%`;
                }

            })
        }

    })
})
