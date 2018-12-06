const FADE_DELAY = 200;

var state = {
	step: 0,
    game: -1,
    gamename: "",
	type: "",
	popularity: "",
	variety: false
};

var suggestionLoadedCount = 0;
var suggestionLoadedCountBound = 8;
var suggestionData = [];
var userData = {};
var streamData = {};
var gameData = {};

$( "#Logo").css("cursor","pointer").click(function() {
    location.reload()
});

//Hide Streamers and CTA -  and disable clicks on type and popularity
$( document ).ready( function() {
    $("#Streamer-link-section").css("display","none")
    $("#CTA").css("display","none")
    $("#Streamer-heading").css("display","none")
    $(".type").addClass("non-active").click(function(event){
        event.preventDefault();        
    }).css( {"cursor" : "default" , "pointer-events" : "none"});
    $("#type-heading").addClass("not-active");
    $(".popularity").addClass("non-active").click(function(event){
        event.preventDefault();
    }).css( {"cursor" : "default" , "pointer-events" : "none"});
    $("#popularity-heading").addClass("not-active");
})

//Display the streamers saved in cookies
$ (document).ready(function(){
    var count = getCookie("countcookie");
    // In case no cookie is set
    if (count == "" ){   
    // In case one streamer has been set
    } else if (count == "1"){
        $("#Streamer-link-section").css("display","block");
        $("#streamer2-box").css("display","none");
        $("#streamer3-box").css("display","none");
        var streamer1URL = getCookie("Streamer1-URL");
        var streamer1Name = getCookie("Streamer1-Name");
        var streamer1Game = getCookie("Streamer1-Game");
        $("#streamer1-text").text(streamer1Name);
        $("#streamer1-game").text(streamer1Game);
        $("#streamer1-url").attr("href",streamer1URL);
    // In case two streamers have been set
    } else if (count == "2"){
        $("#Streamer-link-section").css("display","block");
        $("#streamer3-box").css("display","none");
        var streamer1URL = getCookie("Streamer1-URL");
        var streamer1Name = getCookie("Streamer1-Name");
        var streamer1Game = getCookie("Streamer1-Game");
        $("#streamer1-text").text(streamer1Name);
        $("#streamer1-game").text(streamer1Game);
        $("#streamer1-url").attr("href",streamer1URL);
        var streamer2URL = getCookie("Streamer2-URL");
        var streamer2Name = getCookie("Streamer2-Name");
        var streamer2Game = getCookie("Streamer2-Game");
        $("#streamer2-text").text(streamer2Name);
        $("#streamer2-game").text(streamer2Game);
        $("#streamer2-url").attr("href",streamer2URL);
    // In case three streamers have been set
    } else {
        $("#Streamer-link-section").css("display","block");
        var streamer1URL = getCookie("Streamer1-URL");
        var streamer1Name = getCookie("Streamer1-Name");
        var streamer1Game = getCookie("Streamer1-Game");
        $("#streamer1-text").text(streamer1Name);
        $("#streamer1-game").text(streamer1Game);
        $("#streamer1-url").attr("href",streamer1URL);
        var streamer2URL = getCookie("Streamer2-URL");
        var streamer2Name = getCookie("Streamer2-Name");
        var streamer2Game = getCookie("Streamer2-Game");
        $("#streamer2-text").text(streamer2Name);
        $("#streamer2-game").text(streamer2Game);
        $("#streamer2-url").attr("href",streamer2URL);
        var streamer3URL = getCookie("Streamer3-URL");
        var streamer3Name = getCookie("Streamer3-Name");
        var streamer3Game = getCookie("Streamer3-Game");
        $("#streamer3-text").text(streamer3Name);
        $("#streamer3-game").text(streamer3Game);
        $("#streamer3-url").attr("href",streamer3URL);
    }
})

//Hide streamers click
$(".hide-button").click(function(){
    $("#Streamer-link-section").css("display","none")
})

//Step 1

//Creates the dropdown by pulling game data and assembling an HTML
$( document ).ready( function() {
    var html = "<div data-delay=\"0\" class=\"w-dropdown\" style><div class=\"game-dropdown w-dropdown-toggle\"><div class=\"w-icon-dropdown-toggle\"></div><div class=\"text-block\" id=\"menu\"><strong>Choose Game</strong></div></div><nav class=\"w-dropdown-list\">"
    requestData( "get_selected_games", null, function( games ) {
        for( var i=0; i<games.length; i++ ) {
            html += "<a href=\"#\" class=\"w-dropdown-link\" id=\"" + games[i]["MasterGameID"] + "\"" + ">" + games[i]["name"] + "</a>";
        };
        html += "</nav>"
        $("#game-dropdown").html( html ); 
        //Resets the webflow.js for dropdown to work
        $( document ).ajaxComplete( function() {
            window.Webflow && window.Webflow.destroy();
            window.Webflow && window.Webflow.ready();
            document.dispatchEvent( new Event( 'readystatechange' ) );
        })
        //Saves the game on click and enables Step 2
        $(".w-dropdown-link").click (function( event ){
            event.preventDefault();
            state["game"] = $( this ).attr( "id" );
            state["gamename"] =  $( this ).text();
            state["variety"] = false;
            $( "#menu" ).text(state["gamename"]).css({"color":"#f1b91e","font-weight":"700"});
            $( ".game-dropdown" ).css( {"background-color":"#080b2e","border":"2px solid #fff"});
            $( ".w-dropdown-list").slideUp("slow");
            //Activates Step 2 - but only for streamers with active streams
            requestData( "get_streamer_types", {s0: state["game"]}, function(streamerTypes){
                for( i=0; i<streamerTypes.length; i++ ) {
                    if( streamerTypes[i]["stream_count"] > 0 ) {
                        $("#" + streamerTypes[i]["streamer_type"]).removeClass("non-active").css( {"cursor" : "pointer" , "pointer-events" : "auto"});
                    }
                }
            })
            $(".game-dropdown").css("pointer-events","none");
            $("#type-heading").removeClass("not-active");
            $('html,body').animate({
                scrollTop: $("#type-section").offset().top},
                'slow');
        })        
    })
});

//Step 2

$(".type").click (function( event ){
    event.preventDefault();
    state["type"] = $( this ).attr( "id" );
    $(".type").addClass("non-active").css({ "color" : "#fff" , "pointer-events" : "none" });
    $( "#" + state["type"]).removeClass("non-active");
    $( this ).css({"color":"#f1b91e"});
    //Activates Step 3 - but only for streamers with active streams
    requestData( "get_popular_streamers", {s0: state["game"], s1: state["type"]}, function(streamerPop){
        for( i=0; i<streamerPop.length; i++ ) {
            if( streamerPop[i]["stream_counts"] > 0 ) {
                $("#" + streamerPop[i]["popularity"]).removeClass("non-active").css( {"cursor" : "pointer" , "pointer-events" : "auto"});
            }
        }
    })
    $("#popularity-heading").removeClass("not-active");
    $('html,body').animate({
        scrollTop: $("#popularity-section").offset().top},
        'slow');
})

//Step 3

$(".popularity").click (function( event ){
    event.preventDefault();
    state["popularity"] = $( this ).attr( "id" );
    $(".popularity").addClass("non-active").css({ "color" : "#fff" , "cursor" : "default" , "pointer-events" : "none"});
    $( "#" + state["popularity"]).removeClass("non-active");
    $( this ).css({"color":"#f1b91e"});
    if(state["game"] != "-1" && state["type"] != "" && state["popularity"] != "") {
        $("#CTA").css("display","block")
         
    }
    $('html,body').animate({
        scrollTop: $("#popularity-section").offset().top},
        'slow');
})


//Results click
$("#CTA").click(function(event){
    event.preventDefault();
    $("#Streamer-link-section,#game-section,#type-section,#popularity-section,#cta-section").css("display","none");
    requestData( "get_suggestions" ,  
        {s0: state["game"], 
         s1: state["type"], 
         s2: state["popularity"]},
        function( result ) {
            suggestionLoadedCount = 0;
            suggestionLoadedCountBound = result.length * 3;
            suggestionData = result;
            for( var i=0; i<result.length; i++ ) {
                requestData( "get_user", {s0: result[i]["MasterUserID"]}, function( user ) {
                    userData[user["MasterUserID"]] = user;
                    suggestionLoadedCount++;
                    if( suggestionLoadedCount == suggestionLoadedCountBound ) loadSuggestions();
                });
                requestData( "get_stream", {s0: result[i]["MasterStreamID"]}, function( stream ) {
                    streamData[stream["MasterStreamID"]] = stream;
                    suggestionLoadedCount++;
                    if( suggestionLoadedCount == suggestionLoadedCountBound ) loadSuggestions();
                });
                requestData( "get_game", {s0: result[i]["MasterGameID"]}, function( game ) {
                    gameData[game["MasterGameID"]] = game;
                    suggestionLoadedCount++;
                    if( suggestionLoadedCount == suggestionLoadedCountBound ) loadSuggestions();
                });
            };
        })
    })


function loadSuggestions () {
$( document ).ready ( function (){    
    var suggestionhtml = ""
    for( var i=0; i<suggestionData.length; i++){
        // thumbnail
		var src = streamData[suggestionData[i]["MasterStreamID"]]["thumbnail_url"];
		src = src.replace( "{width}", "140");
		src = src.replace( "{height}", "100");
		// Twitch link
        var url = "https://twitch.tv/" + userData[suggestionData[i]["MasterUserID"]]["login"] + " target=\"_blank\"";
        // HTML
        suggestionhtml +="<div class=\"results-box\"><img src=" + src + " alt=\"\"> "
        + "<div class=\"text-block-2\"><strong class=\"streamer-name\">" + userData[suggestionData[i]["MasterUserID"]]["login"] + "</strong></div>"
        + "<div class=\"game-name\">" + gameData[suggestionData[i]["MasterGameID"]]["name"] + "</div>"
        + "<div class=\"discription-text\">" + userData[suggestionData[i]["MasterUserID"]]["description"] + "</div>"
        + "<a name=" + userData[suggestionData[i]["MasterUserID"]]["login"] + " game=" + gameData[suggestionData[i]["MasterGameID"]]["name"]
        + " href=" + url + " class=\"watch-on-twitch-button w-button\">Watch on Twitch</a></div>"
        }
        $("#streamer-container").html( suggestionhtml );
        $("#Streamer-heading").css("display","block");
        $( document ).ajaxComplete( function() {
            window.Webflow && window.Webflow.destroy();
            window.Webflow && window.Webflow.ready();
            document.dispatchEvent( new Event( 'readystatechange' ) );
        })
    //Create cookie that remembers the URL of the streamer clicked
    $ (".watch-on-twitch-button").click(function(){
        var rememberStreamerURL = $( this ).attr("href");
        var rememberStreamerName = $( this ).attr("name");
        var rememberStreamerGame = state["gamename"];
        var count = getCookie("countcookie");
        // In case no cookie is set
        if (count == "" ){
            setCookie("Streamer1-URL",rememberStreamerURL,7);
            setCookie("Streamer1-Name",rememberStreamerName,7);
            setCookie("Streamer1-Game",rememberStreamerGame,7);
            setCookie("countcookie","1",7);
        // In case one streamer has been set
        } else if (count == "1"){
            setCookie("Streamer2-URL",rememberStreamerURL,7);
            setCookie("Streamer2-Name",rememberStreamerName,7);
            setCookie("Streamer2-Game",rememberStreamerGame,7);
            setCookie("countcookie","2",7);
        // In case two streamers have been set
        } else if (count == "2"){
            setCookie("Streamer3-URL",rememberStreamerURL,7);
            setCookie("Streamer3-Name",rememberStreamerName,7);
            setCookie("Streamer3-Game",rememberStreamerGame,7);
            setCookie("countcookie","3",7)
        // In case three streamers have been set - using three cases for the display saved streamers function
        } else if (count == "3"){
            setCookie("Streamer1-URL",rememberStreamerURL,7);
            setCookie("Streamer1-Name",rememberStreamerName,7);
            setCookie("Streamer1-Game",rememberStreamerGame,7);
            setCookie("countcookie","4",7)
        } else if (count == "4"){
            setCookie("Streamer2-URL",rememberStreamerURL,7);
            setCookie("Streamer2-Name",rememberStreamerName,7);
            setCookie("Streamer2-Game",rememberStreamerGame,7);
            setCookie("countcookie","5",7)
        } else {
            setCookie("Streamer3-URL",rememberStreamerURL,7);
            setCookie("Streamer3-Name",rememberStreamerName,7);
            setCookie("Streamer3-Game",rememberStreamerGame,7);
            setCookie("countcookie","3",7)
        }
        
    })
})
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function requestData( cmd, params, callback )
{
    let data = { 
        password: 5+ropeDat+"!",
        command: cmd,
        ...params
    };
    $.ajax({
    url: "https://streamcruxbe1.azurewebsites.net/api/Query2",
    method: "GET",
    data: data,
    dataType: 'json',
    success: callback,
    error: function( jqXHR, txt, ex ) {
        alert( "A connection related error has occured. Please check your internet connection and reload the page." );
        console.log( jqXHR );
        console.log( txt );
        console.log( ex );
        }
    })}
