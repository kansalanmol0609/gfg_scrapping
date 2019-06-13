const userForm = document.querySelector('form')
const searchEl = document.querySelector('input')
const loadp = document.querySelector('#loading')
const profileEl = document.querySelectorAll('#profile > p')
const buttonEl = document.querySelector('#search123')
const profileBlockEl = document.querySelector('#profileblock')

//Function to render profile details
const profileRender = function (ans) {
    profileEl[0].textContent = `Name: ${ans.name}`
    profileEl[1].textContent = `Institute: ${ans.institute}`
    profileEl[2].textContent = `Rank in Institute: ${ans.rankInInstitute}`
    profileEl[3].textContent = `Total Problems Solved: ${ans.totalProblemSolved}`
    profileEl[4].textContent = `Total Coding Score: ${ans.codingScore}`
    profileBlockEl.style.display = null
}

//Function to create topic div
const topicsRender = function (topicArr123, problemLink, problemName) {

    for (var topic123 in topicArr123) {
        //topic123 is an array containing indexes of problemnames and links
        var topicEl = document.createElement('div')
        topicEl.classList.add("card-head", "border", "border-secondary", "text-center")
        topicEl.style.backgroundColor = "#05386B"
        topicEl.style.color = "white"
        topicEl.style.paddingTop = "2%"
        document.querySelector("#Content123").appendChild(topicEl)

        var topicElContainer = document.createElement('div')
        topicElContainer.classList.add("row")
        topicEl.appendChild(topicElContainer)

        var topicnameEl = document.createElement('p')
        topicnameEl.classList.add("col", "align-self-start")
        topicnameEl.textContent = topic123
        topicElContainer.appendChild(topicnameEl)

        var pCountEl = document.createElement('p')
        pCountEl.classList.add("col", "align-self-end")
        pCountEl.textContent = `Total Problems: ${topic123.length}`
        topicElContainer.appendChild(pCountEl)

        //Now adding problems
        var problemContainerEl = document.createElement('div')
        problemContainerEl.classList.add("card-body", "border", "border-secondary")
        problemContainerEl.style.backgroundColor = "#8EE4AF"
        problemContainerEl.style.marginBottom = "2%"
        document.querySelector("#Content123").appendChild(problemContainerEl)

        var pListEl = document.createElement('ol')
        pListEl.style.color = "#05386B"
        problemContainerEl.appendChild(pListEl)

        //Creating list of problems
        for (var p in topic123) {
            var topiclistEl = document.createElement('li')
            pListEl.appendChild(topiclistEl)

            var pNameEl = document.createElement('a')
            pNameEl.textContent = problemName[p]
            pNameEl.setAttribute('href', problemLink[p])
            pNameEl.setAttribute('target', '_blank')
            pNameEl.style.color = "#05386B"
            topiclistEl.appendChild(pNameEl)
        }
    }
    buttonEl.removeAttribute('disabled')
}

//Function that creates topic map having entry as index
const topicMap = function (ans, problemLink, problemName) {
    const totalProblems = ans.totalProblemSolved
    //Variable to store progress
    var totalProcessed = 0
    const topicArr123 = new Map()
    problemLink.forEach(link => {
        //Passing to function and at same time calling it
        (function (link) {
            fetch('/topic?link=' + link).then((response) => {
                response.json().then((dat) => {
                    dat.forEach(topicxcf => {
                        topicArr123[topicxcf] = topicArr123[topicxcf] || []
                        topicArr123[topicxcf].push(problemLink.indexOf(link))
                    })
                    totalProcessed++
                    var loadpercent = Math.round(100 * totalProcessed / totalProblems)
                    loadp.textContent = `Collecting Data: ${loadpercent} % Collected`
                    if (loadpercent === 100) {
                        loadp.textContent = `Loaded`
                        topicsRender(topicArr123, problemLink, problemName)
                    }
                })
            })
        })(link)
    })
}

//Taking input from user
userForm.addEventListener('submit', (e) => {
    e.preventDefault()
    buttonEl.setAttribute("disabled", "disabled");
    //To clear the output for other profile
    profileBlockEl.style.display = "none";
    document.querySelector("#Content123").innerHTML = ""

    const user = searchEl.value
    loadp.textContent = `Loading ... `
    //If no input
    if (user == '') {
        loadp.textContent = `Please enter some valid input!!!`
        buttonEl.removeAttribute("disabled");
    }
    else {
        fetch('/profile?user=' + user).then((response) => {
            console.log(response)
            response.json().then((data) => {
                const { error, ans, problemLink, problemName } = data || {}
                if (error) {
                    loadp.textContent = error
                    buttonEl.removeAttribute("disabled");
                }
                else {
                    profileRender(ans)
                    topicMap(ans, problemLink, problemName)
                }
            })
        })
    }
})