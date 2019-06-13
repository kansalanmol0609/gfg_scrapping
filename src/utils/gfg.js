const cheerio = require('cheerio')
const request = require('request')

//Function to fetch data by entering username
const profileAnalyze = function(user, callback){
    //User Details
    const ans = {}
    //Web Scraping
    request({url: `https://auth.geeksforgeeks.org/user/${user}/practice/`}, (error, {body})=> {
        if(error){
            return callback('Unable to connect to geeksforgeeks.org')
        }

        let $ = cheerio.load(body);

        //Invalid User Request
        if($('title').text().trim() == "GeeksforGeeks"){
            return callback('Please enter some Valid username!!')
        }

        //Extracting all user details
        ans.name = $('div.mdl-grid > div.medText').text()
        ans.codingScore = $('div.mdl-cell.mdl-cell--6-col.mdl-cell--12-col-phone.textBold').get(0).children[0].data
        ans.codingScore = 1*(ans.codingScore.replace("Overall Coding Score:", "").trim())
        ans.totalProblemSolved = $('div.mdl-cell.mdl-cell--6-col.mdl-cell--12-col-phone.textBold > a').get(0).children[0].data
        ans.totalProblemSolved = 1*(ans.totalProblemSolved.replace("Problems Solved:", "").trim())
        ans.institute = $('div.mdl-cell.mdl-cell--9-col.mdl-cell--12-col-phone.textBold > a').get(0).children[0].data.trim()
        ans.rankInInstitute = $('div.mdl-cell.mdl-cell--9-col.mdl-cell--12-col-phone.textBold').get(2).children[0].data
        ans.rankInInstitute = (ans.rankInInstitute.replace("#", "").trim())*1

        var count=0
        const problemLink = []
        const problemName = []
        
        $('div.page-content > ul.mdl-grid > li.mdl-cell > a').each(function(ind, el){
            problemLink.push(el.attribs.href)
            problemName.push(el.children[0].data)
        })
        callback(undefined, {ans, problemLink, problemName})
    })
}

//Function to return topics array
const topicArray = function(xurl, callback){
    const topic = []
    // console.log(xurl, ind)
    request({ url: xurl }, (error, {body} = {}) => {
        // console.log(xurl, body)
        if (error || !body) {
            return callback('Error')
        }
        
        let t$ = cheerio.load(body);
        //If insufficient Privileges due to contest questions
        //Plus non empty body
        if (!t$('h4').text().trim().includes("Insufficient Privileges")) {
            //for each topic tag
            t$('.topicTags').each(function (indu, ele) {
                var val = t$(this).text().toString()
                topic.push(val)
            })
        }
        callback(undefined, topic)
    })
}

module.exports = { profileAnalyze, topicArray }